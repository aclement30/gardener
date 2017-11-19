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
exports.namespace = 'gardener:accessories:humidity-sensor';
var HumiditySensor = /** @class */ (function (_super) {
    __extends(HumiditySensor, _super);
    function HumiditySensor(name, sensorDevice) {
        var _this = _super.call(this, name, HAP.uuid.generate(exports.namespace + ":" + name)) || this;
        _this.getHumidity = function (callback) {
            var humidity = _this.currentHumidity$.getValue();
            callback(null, humidity);
        };
        _this.shutdown = function (callback) {
            if (callback)
                callback();
        };
        _this._onValueChange = function (value) {
            _this.currentHumidity$.next(value.humidity);
            if (_this.id)
                garden_monitor_1.GardenMonitor.info(garden_monitor_1.LOG_TYPE.READING, value.humidity, _this, "Humidity: " + value.humidity + "%");
        };
        _this.name = name;
        _this.currentHumidity$ = new BehaviorSubject_1.BehaviorSubject(0);
        _this._configureHomekit();
        // Init DHT sensor device
        _this._dhtSensorDevice = sensorDevice;
        _this._dhtSensorDevice.value$.subscribe(_this._onValueChange);
        return _this;
    }
    // Configure Homekit accessory
    HumiditySensor.prototype._configureHomekit = function () {
        var _this = this;
        this
            .addService(HAP.Service.HumiditySensor)
            .getCharacteristic(HAP.Characteristic.CurrentRelativeHumidity)
            .on('get', this.getHumidity);
        this.currentHumidity$.subscribe(function (currentHumidity) {
            // Update the characteristic value so interested iOS devices can get notified
            _this
                .getService(HAP.Service.HumiditySensor)
                .setCharacteristic(HAP.Characteristic.CurrentRelativeHumidity, currentHumidity);
        });
    };
    return HumiditySensor;
}(HAP.Accessory));
exports.HumiditySensor = HumiditySensor;
