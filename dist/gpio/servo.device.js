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
var output_device_1 = require("./output.device");
var ServoDevice = /** @class */ (function (_super) {
    __extends(ServoDevice, _super);
    function ServoDevice() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    // Position: servo orientation (0-180 deg.)
    ServoDevice.prototype.setPosition = function (position) {
        var pulseWidth = (position * 2000 / 180) + 500;
        this.servoWrite(pulseWidth);
        return this;
    };
    ServoDevice.prototype.setValue = function (value) {
        throw new Error('ServoDevice.setValue() is not implemented!');
    };
    return ServoDevice;
}(output_device_1.OutputDevice));
exports.ServoDevice = ServoDevice;
