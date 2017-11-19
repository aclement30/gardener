"use strict";
exports.__esModule = true;
var humidity_sensor_accessory_1 = require("../accessories/humidity-sensor.accessory");
var light_accessory_1 = require("../accessories/light.accessory");
var temperature_sensor_accessory_1 = require("../accessories/temperature-sensor.accessory");
var dht_sensor_1 = require("../gpio/dht-sensor");
var dhtSensorDevice = new dht_sensor_1.DHTSensorDevice(4, {
    readingInterval: 30,
    calibration: {
        humidity: 0,
        temperature: +2
    }
});
exports["default"] = {
    'humidity': new humidity_sensor_accessory_1.HumiditySensor('Humidité globale', dhtSensorDevice),
    'light-top': new light_accessory_1.Light('Lumière haut', 11),
    'light-bottom': new light_accessory_1.Light('Lumière bas', 13),
    'temperature': new temperature_sensor_accessory_1.TemperatureSensor('Température', dhtSensorDevice)
};
