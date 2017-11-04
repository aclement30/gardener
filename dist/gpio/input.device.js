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
var Subject_1 = require("rxjs/Subject");
var gpio_manager_1 = require("../gpio/gpio-manager");
var gpio_device_1 = require("./gpio.device");
var garden_monitor_1 = require("../garden-monitor");
var InputDevice = /** @class */ (function (_super) {
    __extends(InputDevice, _super);
    function InputDevice(pinNumber, accessory) {
        var _this = _super.call(this, pinNumber, accessory, gpio_manager_1["default"].DIR_IN) || this;
        _this.value$ = new Subject_1.Subject();
        _this._onGpioValueChange = function (channel, value) {
            if (channel !== _this._pinNumber)
                return;
            garden_monitor_1.GardenMonitor.info("Value received from pin #" + _this._pinNumber + ": " + value, _this._accessory, [garden_monitor_1.GPIO_TAG]);
            _this.value$.next(value);
        };
        gpio_manager_1["default"].on('change', _this._onGpioValueChange);
        return _this;
    }
    return InputDevice;
}(gpio_device_1.GpioDevice));
exports.InputDevice = InputDevice;
