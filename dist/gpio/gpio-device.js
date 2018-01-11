"use strict";
exports.__esModule = true;
var isRasberryPi = require('detect-rpi')();
var GpioDevice;
if (isRasberryPi) {
    GpioDevice = require('pigpio').Gpio;
}
else {
    GpioDevice = require('./gpio-device.fake');
}
exports["default"] = GpioDevice;
