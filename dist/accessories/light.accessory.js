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
var output_device_1 = require("../gpio/output.device");
exports.namespace = 'gardener:accessories:light';
var Light = /** @class */ (function (_super) {
    __extends(Light, _super);
    function Light(name, pinNumber) {
        var _this = _super.call(this, name, HAP.uuid.generate(exports.namespace + ":" + name)) || this;
        // Manual override to disable automatic light management
        _this._manualOverride = false;
        // Override to keep the light turned OFF (has priority over manual override)
        _this._emergencyOverride = false;
        _this.shutdown = function (callback) {
            _this._gpioDevice.setValue(false, callback);
            _this.power$.next(false);
        };
        // Homekit characteristics get/set
        _this._getAccessoryPower = function (callback) {
            callback(null, _this.power$.getValue());
        };
        _this._setAccessoryPower = function (status, callback) {
            // Toggle manual override
            _this._manualOverride = !_this._manualOverride;
            _this.setPower(status, false, callback);
        };
        _this.name = name;
        _this.power$ = new BehaviorSubject_1.BehaviorSubject(false);
        _this._configureHomekit();
        // Init GPIO device
        _this._gpioDevice = new output_device_1.OutputDevice(pinNumber, _this).setup(function (error) {
            if (error)
                return;
            _this.power$.subscribe(function (power) {
                // Send inverse of value because of the relay connected to the GPIO pin
                _this._gpioDevice.setValue(!power);
            });
        });
        return _this;
    }
    Light.prototype.setPower = function (status, automated, callback) {
        if (automated === void 0) { automated = true; }
        // Skip if emergency override is activated
        if (this._emergencyOverride) {
            garden_monitor_1.GardenMonitor.warning(garden_monitor_1.LOG_TYPE.OVERRIDE, "Emergency override preventing light to be turned " + (status ? 'on' : 'off'), this);
            if (callback)
                callback(true);
            return;
        }
        // Skip automated change when manual override is activated
        if (automated && this._manualOverride) {
            garden_monitor_1.GardenMonitor.warning(garden_monitor_1.LOG_TYPE.OVERRIDE, "Manual override preventing light to be turned " + (status ? 'on' : 'off'), this);
            if (callback)
                callback(true);
            return;
        }
        if (this.id)
            garden_monitor_1.GardenMonitor.info(status ? garden_monitor_1.LOG_TYPE.TURN_ON : garden_monitor_1.LOG_TYPE.TURN_OFF, status, this, "Turning the light " + (status ? 'on' : 'off') + " (" + (automated ? 'auto' : 'manual') + ")");
        this.power$.next(status);
        if (callback)
            callback();
    };
    // Automated function shortcuts
    Light.prototype.turnOn = function (automated) {
        if (automated === void 0) { automated = false; }
        this.setPower(true, automated);
    };
    Light.prototype.turnOff = function (automated) {
        if (automated === void 0) { automated = false; }
        this.setPower(false, automated);
    };
    Object.defineProperty(Light.prototype, "isOn", {
        get: function () {
            return this.power$.getValue();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Light.prototype, "hasOverride", {
        get: function () {
            return this._manualOverride || this._emergencyOverride;
        },
        enumerable: true,
        configurable: true
    });
    // Immediately shutdown the light and prevent it from turning ON again
    // until the emergency override is disabled
    Light.prototype.emergencyShutdown = function () {
        garden_monitor_1.GardenMonitor.emergency(garden_monitor_1.LOG_TYPE.EMERGENCY_SHUTDOWN, 'Emergency shutdown', this);
        this.power$.next(false);
        this._emergencyOverride = true;
    };
    // Disable the emergency override and allow the light to be turned ON again
    Light.prototype.disableEmergencyOverride = function () {
        this._emergencyOverride = false;
    };
    // Configure Homekit accessory
    Light.prototype._configureHomekit = function () {
        var _this = this;
        this
            .addService(HAP.Service.Lightbulb)
            .getCharacteristic(HAP.Characteristic.On)
            .on('set', this._setAccessoryPower);
        this
            .getService(HAP.Service.Lightbulb)
            .getCharacteristic(HAP.Characteristic.On)
            .on('get', this._getAccessoryPower);
        this.power$.subscribe(function (power) {
            // Update the characteristic value so interested iOS devices can get notified
            _this
                .getService(HAP.Service.Lightbulb)
                .getCharacteristic(HAP.Characteristic.On)
                .updateValue(power);
        });
    };
    return Light;
}(HAP.Accessory));
exports.Light = Light;
