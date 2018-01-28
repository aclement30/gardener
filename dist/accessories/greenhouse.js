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
var humidity_sensor_accessory_1 = require("./humidity-sensor.accessory");
var temperature_sensor_accessory_1 = require("./temperature-sensor.accessory");
var greenhouse_servo_accessory_1 = require("./greenhouse-servo.accessory");
var garden_monitor_1 = require("../garden-monitor");
var accessory_group_1 = require("./accessory-group");
var Greenhouse = /** @class */ (function (_super) {
    __extends(Greenhouse, _super);
    function Greenhouse(name, accessories) {
        var _this = _super.call(this, name, accessories) || this;
        _this.shutdown = function (callback) {
            // Bridge accessory: nothing to do
        };
        Object.keys(accessories).forEach(function (alias) {
            var accessory = accessories[alias];
            if (accessory instanceof humidity_sensor_accessory_1.HumiditySensor) {
                _this._humiditySensor = accessory;
                _this.humidity$ = _this._humiditySensor.currentHumidity$;
            }
            else if (accessory instanceof temperature_sensor_accessory_1.TemperatureSensor) {
                _this._temperatureSensor = accessory;
            }
            else if (accessory instanceof greenhouse_servo_accessory_1.GreenhouseServo) {
                _this._servo = accessory;
                _this.coverState$ = _this._servo.currentPosition$;
            }
            else {
                garden_monitor_1.GardenMonitor.warning(garden_monitor_1.LOG_TYPE.SETUP_ERROR, "Wrong greenhouse config: unknown type for " + (name + ' - ' + accessory.name), _this);
            }
        });
        return _this;
    }
    Greenhouse.prototype.open = function (automated) {
        if (!this._servo)
            return;
        this._servo.open(automated);
    };
    Greenhouse.prototype.close = function (automated) {
        if (!this._servo)
            return;
        this._servo.close(automated);
    };
    return Greenhouse;
}(accessory_group_1.AccessoryGroup));
exports.Greenhouse = Greenhouse;
