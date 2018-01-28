"use strict";
exports.__esModule = true;
var humidity_sensor_accessory_1 = require("../accessories/humidity-sensor.accessory");
var light_accessory_1 = require("../accessories/light.accessory");
var temperature_sensor_accessory_1 = require("../accessories/temperature-sensor.accessory");
var dht_sensor_1 = require("../gpio/dht-sensor");
var greenhouse_accessory_1 = require("../accessories/greenhouse.accessory");
var globalDHTSensorDevice = new dht_sensor_1.DHTSensorDevice(4, {
    readingInterval: 30,
    calibration: {
        humidity: -3,
        temperature: +2
    }
});
var greenhouseDHTSensorDevice = new dht_sensor_1.DHTSensorDevice(23, {
    readingInterval: 30,
    calibration: {
        humidity: +20,
        temperature: +2
    }
});
exports["default"] = {
    'humidity': new humidity_sensor_accessory_1.HumiditySensor('Humidité globale', globalDHTSensorDevice),
    'light-top': new light_accessory_1.Light('Lumière haut', 11),
    'light-bottom': new light_accessory_1.Light('Lumière bas', 13),
    'temperature': new temperature_sensor_accessory_1.TemperatureSensor('Température', globalDHTSensorDevice),
    'greenhouse': new greenhouse_accessory_1.Greenhouse('Miniserre', {
        'humidity': new humidity_sensor_accessory_1.HumiditySensor('Miniserre - Humidité', greenhouseDHTSensorDevice),
        'temperature': new temperature_sensor_accessory_1.TemperatureSensor('Miniserre - Température', greenhouseDHTSensorDevice)
    })
};
