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
var input_device_1 = require("../gpio/input.device");
exports.namespace = 'gardener:accessories:moisture-sensor';
var MoistureSensor = /** @class */ (function (_super) {
    __extends(MoistureSensor, _super);
    function MoistureSensor(name, pinNumber) {
        var _this = _super.call(this, name, HAP.uuid.generate(exports.namespace + ":" + name)) || this;
        _this.getMoisture = function (callback) {
            var moisture = _this.currentMoisture$.getValue();
            callback(null, moisture);
        };
        _this.shutdown = function () { };
        _this._randomizeMoisture = function () {
            // randomize moisture to a value between 0 and 100
            var value = Math.round(Math.random() * 100);
            _this.currentMoisture$.next(value);
        };
        _this._onValueChange = function (value) {
            _this.currentMoisture$.next(value);
        };
        _this.name = name;
        _this.currentMoisture$ = new BehaviorSubject_1.BehaviorSubject(0);
        _this._configureHomekit();
        // Init GPIO device
        _this._gpioDevice = new input_device_1.InputDevice(pinNumber, _this);
        _this._gpioDevice.value$.subscribe(_this._onValueChange);
        setInterval(function () {
            _this._randomizeMoisture();
        }, 3000);
        return _this;
    }
    // Configure Homekit accessory
    MoistureSensor.prototype._configureHomekit = function () {
        var _this = this;
        this
            .addService(HAP.Service.HumiditySensor)
            .getCharacteristic(HAP.Characteristic.CurrentRelativeHumidity)
            .on('get', this.getMoisture);
        this.currentMoisture$.subscribe(function (currentMoisture) {
            garden_monitor_1.GardenMonitor.info("Moisture: " + currentMoisture + "%", _this, [garden_monitor_1.ACCESSORY_TAG]);
            // Update the characteristic value so interested iOS devices can get notified
            _this
                .getService(HAP.Service.HumiditySensor)
                .setCharacteristic(HAP.Characteristic.CurrentRelativeHumidity, currentMoisture);
        });
    };
    return MoistureSensor;
}(HAP.Accessory));
exports.MoistureSensor = MoistureSensor;
