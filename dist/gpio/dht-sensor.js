"use strict";
exports.__esModule = true;
var Observable_1 = require("rxjs/Observable");
var Subject_1 = require("rxjs/Subject");
require("rxjs/add/observable/interval");
var dht_sensor_driver_1 = require("../gpio/dht-sensor-driver");
var garden_monitor_1 = require("../garden-monitor");
var DHTSensorDevice = /** @class */ (function () {
    function DHTSensorDevice(pinNumber, readingInterval, type) {
        if (readingInterval === void 0) { readingInterval = 60; }
        if (type === void 0) { type = 11; }
        var _this = this;
        this.value$ = new Subject_1.Subject();
        this._getSensorValue = function () {
            dht_sensor_driver_1["default"].read(_this._type, _this._pinNumber, function (error, temperature, humidity) {
                if (error) {
                    garden_monitor_1.GardenMonitor.log("\u26A0\uFE0F  Cannot read DHT sensor value on pin #" + _this._pinNumber, null, [garden_monitor_1.GPIO_TAG]);
                    return;
                }
                _this.value$.next({
                    temperature: temperature,
                    humidity: humidity
                });
            });
        };
        this._pinNumber = pinNumber;
        this._type = type;
        // Read sensor value every 1 second
        Observable_1.Observable.interval(readingInterval * 1000).subscribe(this._getSensorValue);
    }
    return DHTSensorDevice;
}());
exports.DHTSensorDevice = DHTSensorDevice;
