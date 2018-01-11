"use strict";
exports.__esModule = true;
var GpioDeviceFake = /** @class */ (function () {
    function GpioDeviceFake(pin, options) {
    }
    GpioDeviceFake.prototype.digitalRead = function () {
        return 1;
    };
    GpioDeviceFake.prototype.digitalWrite = function (level) {
        return this;
    };
    GpioDeviceFake.prototype.servoWrite = function (pulseWidth) {
        return this;
    };
    GpioDeviceFake.prototype.on = function (eventName, callback) {
        callback(1);
    };
    GpioDeviceFake.INPUT = 'INPUT';
    GpioDeviceFake.OUTPUT = 'OUTPUT';
    return GpioDeviceFake;
}());
exports.GpioDeviceFake = GpioDeviceFake;
module.exports = GpioDeviceFake;
