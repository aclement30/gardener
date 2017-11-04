"use strict";
exports.__esModule = true;
var gpio_manager_1 = require("../gpio/gpio-manager");
var garden_monitor_1 = require("../garden-monitor");
var GpioDevice = /** @class */ (function () {
    function GpioDevice(pinNumber, accessory, direction) {
        var _this = this;
        this._pinNumber = pinNumber;
        this._accessory = accessory;
        gpio_manager_1["default"].setup(this._pinNumber, direction, function () {
            garden_monitor_1.GardenMonitor.warning("Could not setup GPIO device on pin #" + _this._pinNumber, _this._accessory, [garden_monitor_1.GPIO_TAG]);
        });
    }
    return GpioDevice;
}());
exports.GpioDevice = GpioDevice;
