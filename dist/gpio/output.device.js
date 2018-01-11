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
var gpio_device_1 = require("./gpio-device");
var OutputDevice = /** @class */ (function (_super) {
    __extends(OutputDevice, _super);
    function OutputDevice(pinNumber) {
        return _super.call(this, pinNumber, { mode: gpio_device_1["default"].OUTPUT }) || this;
    }
    OutputDevice.prototype.setValue = function (value) {
        this.digitalWrite(value);
        return this;
    };
    return OutputDevice;
}(gpio_device_1["default"]));
exports.OutputDevice = OutputDevice;
