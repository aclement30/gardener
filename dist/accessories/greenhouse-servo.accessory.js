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
var servo_device_1 = require("../gpio/servo.device");
exports.namespace = 'gardener:accessories:greenhouse-servo';
exports.SERVO_POSITION = {
    OPEN: 100,
    CLOSED: 0
};
exports.SERVO_POSITION_STATE = {
    DECREASING: 0,
    INCREASING: 1,
    STOPPED: 2
};
function getPositionLabel(position) {
    if (position === 100)
        return 'OPEN';
    if (position === 0)
        return 'CLOSED';
}
var GreenhouseServo = /** @class */ (function (_super) {
    __extends(GreenhouseServo, _super);
    function GreenhouseServo(name, pinNumber) {
        var _this = _super.call(this, name, HAP.uuid.generate(exports.namespace + ":" + name)) || this;
        // Manual override to disable automatic management
        _this._manualOverride = false;
        // Override to keep the servo motor OFF (has priority over manual override)
        _this._emergencyOverride = false;
        _this.shutdown = function (callback) {
            _this._gpioDevice.setPosition(90);
            _this.targetPosition$.next(exports.SERVO_POSITION.CLOSED);
            callback();
        };
        // Homekit characteristics get/set
        _this._getAccessoryCurrentPosition = function (callback) {
            callback(null, _this.currentPosition$.getValue());
        };
        _this._getAccessoryTargetPosition = function (callback) {
            callback(null, _this.targetPosition$.getValue());
        };
        _this._getAccessoryPositionState = function (callback) {
            callback(null, _this.positionState$.getValue());
        };
        _this._setAccessoryTargetPosition = function (position, callback) {
            // Toggle manual override
            _this._manualOverride = !_this._manualOverride;
            _this.setPosition(position > 0 ? exports.SERVO_POSITION.OPEN : exports.SERVO_POSITION.CLOSED, false, callback);
        };
        _this.name = name;
        _this.currentPosition$ = new BehaviorSubject_1.BehaviorSubject(exports.SERVO_POSITION.CLOSED);
        _this.targetPosition$ = new BehaviorSubject_1.BehaviorSubject(exports.SERVO_POSITION.CLOSED);
        _this.positionState$ = new BehaviorSubject_1.BehaviorSubject(exports.SERVO_POSITION_STATE.STOPPED);
        _this._configureHomekit();
        // Init GPIO device
        _this._gpioDevice = new servo_device_1.ServoDevice(pinNumber);
        _this.targetPosition$.subscribe(function (position) {
            _this._gpioDevice.setPosition(position === exports.SERVO_POSITION.OPEN ? 90 : 180);
            if (position === exports.SERVO_POSITION.OPEN) {
                _this.positionState$.next(exports.SERVO_POSITION_STATE.INCREASING);
            }
            else {
                _this.positionState$.next(exports.SERVO_POSITION_STATE.DECREASING);
            }
            _this.positionState$.next(exports.SERVO_POSITION_STATE.STOPPED);
            _this.currentPosition$.next(position);
        });
        return _this;
    }
    GreenhouseServo.prototype.setPosition = function (position, automated, callback) {
        if (automated === void 0) { automated = true; }
        // Skip if emergency override is activated
        if (this._emergencyOverride) {
            garden_monitor_1.GardenMonitor.warning(garden_monitor_1.LOG_TYPE.OVERRIDE, "Emergency override preventing change of servo position to " + getPositionLabel(position), this);
            if (callback)
                callback(true);
            return;
        }
        // Skip automated change when manual override is activated
        if (automated && this._manualOverride) {
            garden_monitor_1.GardenMonitor.warning(garden_monitor_1.LOG_TYPE.OVERRIDE, "Manual override preventing change of servo position to " + getPositionLabel(position), this);
            if (callback)
                callback(true);
            return;
        }
        if (this.id)
            garden_monitor_1.GardenMonitor.info(position === exports.SERVO_POSITION.OPEN ? garden_monitor_1.LOG_TYPE.OPEN : garden_monitor_1.LOG_TYPE.CLOSE, position, this, "Changing servo position to " + getPositionLabel(position) + " (" + (automated ? 'auto' : 'manual') + ")");
        this.targetPosition$.next(position);
        if (callback)
            callback();
    };
    // Automated function shortcuts
    GreenhouseServo.prototype.open = function (automated) {
        if (automated === void 0) { automated = false; }
        this.setPosition(exports.SERVO_POSITION.OPEN, automated);
    };
    GreenhouseServo.prototype.close = function (automated) {
        if (automated === void 0) { automated = false; }
        this.setPosition(exports.SERVO_POSITION.CLOSED, automated);
    };
    Object.defineProperty(GreenhouseServo.prototype, "isOpen", {
        get: function () {
            return this.targetPosition$.getValue() === exports.SERVO_POSITION.OPEN;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GreenhouseServo.prototype, "hasOverride", {
        get: function () {
            return this._manualOverride || this._emergencyOverride;
        },
        enumerable: true,
        configurable: true
    });
    // Immediately sets the servo in closed position and prevent it from moving again
    // until the emergency override is disabled
    GreenhouseServo.prototype.emergencyShutdown = function () {
        garden_monitor_1.GardenMonitor.emergency(garden_monitor_1.LOG_TYPE.EMERGENCY_SHUTDOWN, 'Emergency shutdown', this);
        this.targetPosition$.next(exports.SERVO_POSITION.CLOSED);
        this._emergencyOverride = true;
    };
    // Disable the emergency override and allow the servo motor to move again
    GreenhouseServo.prototype.disableEmergencyOverride = function () {
        this._emergencyOverride = false;
    };
    // Configure Homekit accessory
    GreenhouseServo.prototype._configureHomekit = function () {
        var _this = this;
        this
            .addService(HAP.Service.Window)
            .getCharacteristic(HAP.Characteristic.TargetPosition)
            .on('set', this._setAccessoryTargetPosition);
        this
            .getService(HAP.Service.Window)
            .getCharacteristic(HAP.Characteristic.TargetPosition)
            .on('get', this._getAccessoryTargetPosition);
        this
            .getService(HAP.Service.Window)
            .getCharacteristic(HAP.Characteristic.CurrentPosition)
            .on('get', this._getAccessoryCurrentPosition);
        this
            .getService(HAP.Service.Window)
            .getCharacteristic(HAP.Characteristic.PositionState)
            .on('get', this._getAccessoryPositionState);
        this.currentPosition$.subscribe(function (position) {
            // Update the characteristic value so interested iOS devices can get notified
            _this
                .getService(HAP.Service.Window)
                .getCharacteristic(HAP.Characteristic.CurrentPosition)
                .updateValue(position);
        });
        this.targetPosition$.subscribe(function (position) {
            // Update the characteristic value so interested iOS devices can get notified
            _this
                .getService(HAP.Service.Window)
                .getCharacteristic(HAP.Characteristic.TargetPosition)
                .updateValue(position);
        });
        this.positionState$.subscribe(function (positionState) {
            // Update the characteristic value so interested iOS devices can get notified
            _this
                .getService(HAP.Service.Window)
                .getCharacteristic(HAP.Characteristic.PositionState)
                .updateValue(positionState);
        });
    };
    return GreenhouseServo;
}(HAP.Accessory));
exports.GreenhouseServo = GreenhouseServo;
