"use strict";
exports.__esModule = true;
var gpio_manager_1 = require("../gpio/gpio-manager");
var garden_monitor_1 = require("../garden-monitor");
var GpioDevice = /** @class */ (function () {
    function GpioDevice(pinNumber, accessory, direction) {
        this._gpio = gpio_manager_1["default"];
        this._pinNumber = pinNumber;
        this._accessory = accessory;
        this._direction = direction;
    }
    GpioDevice.prototype.setup = function (callback) {
        var _this = this;
        gpio_manager_1["default"].setup(this._pinNumber, this._direction, function (error) {
            if (error) {
                garden_monitor_1.GardenMonitor.warning("Could not setup GPIO device on pin #" + _this._pinNumber + ": " + error, _this._accessory, [garden_monitor_1.GPIO_TAG]);
            }
            callback(error);
        });
        return this;
    };
    return GpioDevice;
}());
exports.GpioDevice = GpioDevice;
