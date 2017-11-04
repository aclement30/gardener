"use strict";
exports.__esModule = true;
var isRasberryPi = require('detect-rpi')();
var GPIOManager;
if (isRasberryPi) {
    GPIOManager = require('rpi-gpio');
}
else {
    GPIOManager = require('./gpio-manager.fake');
}
exports["default"] = GPIOManager;
