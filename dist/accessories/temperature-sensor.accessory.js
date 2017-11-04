"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var BehaviorSubject_1 = require("rxjs/BehaviorSubject");
var HAP = require("hap-nodejs");
var garden_monitor_1 = require("../garden-monitor");
exports.namespace = 'gardener:accessories:temperature-sensor';
var TemperatureSensor = /** @class */ (function (_super) {
    __extends(TemperatureSensor, _super);
    function TemperatureSensor(name, sensorDevice) {
        var _this = _super.call(this, name, HAP.uuid.generate(exports.namespace + ":" + name)) || this;
        _this.getTemperature = function (callback) {
            var temperature = _this.currentTemperature$.getValue();
            callback(null, temperature);
        };
        _this._onValueChange = function (value) {
            _this.currentTemperature$.next(value.temperature);
        };
        _this.name = name;
        _this.currentTemperature$ = new BehaviorSubject_1.BehaviorSubject(0);
        _this._configureHomekit();
        // Init DHT sensor device
        _this._dhtSensorDevice = sensorDevice;
        _this._dhtSensorDevice.value$.subscribe(_this._onValueChange);
        return _this;
    }
    // Configure Homekit accessory
    TemperatureSensor.prototype._configureHomekit = function () {
        var _this = this;
        this
            .addService(HAP.Service.TemperatureSensor)
            .getCharacteristic(HAP.Characteristic.CurrentTemperature)
            .on('get', this.getTemperature);
        this.currentTemperature$.subscribe(function (temperature) {
            garden_monitor_1.GardenMonitor.info("Temperature: " + temperature + "\u00B0C", _this, [garden_monitor_1.ACCESSORY_TAG]);
            // Update the characteristic value so interested iOS devices can get notified
            _this
                .getService(HAP.Service.TemperatureSensor)
                .setCharacteristic(HAP.Characteristic.CurrentTemperature, temperature);
        });
    };
    return TemperatureSensor;
}(HAP.Accessory));
exports.TemperatureSensor = TemperatureSensor;
