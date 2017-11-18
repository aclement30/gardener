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
var gpio_manager_1 = require("../gpio/gpio-manager");
var gpio_device_1 = require("./gpio.device");
var garden_monitor_1 = require("../garden-monitor");
var OutputDevice = /** @class */ (function (_super) {
    __extends(OutputDevice, _super);
    function OutputDevice(pinNumber, accessory) {
        return _super.call(this, pinNumber, accessory, gpio_manager_1["default"].DIR_HIGH) || this;
    }
    OutputDevice.prototype.setValue = function (value, callback) {
        var _this = this;
        this._gpio.write(this._pinNumber, value, function (error) {
            if (error) {
                garden_monitor_1.GardenMonitor.warning("Error on pin #" + _this._pinNumber + ": " + error, _this._accessory, [garden_monitor_1.GPIO_TAG]);
            }
            else {
                garden_monitor_1.GardenMonitor.info("Value set on pin #" + _this._pinNumber + ": " + value, _this._accessory, [garden_monitor_1.GPIO_TAG]);
            }
            if (callback)
                callback(error);
        });
        return this;
    };
    return OutputDevice;
}(gpio_device_1.GpioDevice));
exports.OutputDevice = OutputDevice;
