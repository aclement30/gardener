"use strict";
exports.__esModule = true;
var isRasberryPi = require('detect-rpi')();
var DHTSensorDriver;
if (isRasberryPi) {
    DHTSensorDriver = require('node-dht-sensor');
}
else {
    DHTSensorDriver = require('./dht-sensor-driver.fake');
}
exports["default"] = DHTSensorDriver;
