"use strict";
exports.__esModule = true;
var Observable_1 = require("rxjs/Observable");
var Subject_1 = require("rxjs/Subject");
require("rxjs/add/observable/interval");
var dht_sensor_driver_1 = require("../gpio/dht-sensor-driver");
var garden_monitor_1 = require("../garden-monitor");
var DHTSensorDevice = /** @class */ (function () {
    function DHTSensorDevice(pinNumber, options) {
        if (options === void 0) { options = {}; }
        var _this = this;
        this.value$ = new Subject_1.Subject();
        this._getSensorValue = function () {
            dht_sensor_driver_1["default"].read(_this._type, _this._pinNumber, function (error, temperature, humidity) {
                if (error) {
                    garden_monitor_1.GardenMonitor.warning(garden_monitor_1.LOG_TYPE.READ_ERROR, "DHT sensor reading error on pin #" + _this._pinNumber + " (" + error + ")");
                    return;
                }
                _this.value$.next({
                    temperature: temperature + _this._calibration.temperature,
                    humidity: humidity + _this._calibration.humidity
                });
            });
        };
        var sensorOptions = Object.assign({}, {
            calibration: { temperature: 0, humidity: 0 },
            readingInterval: 60,
            type: 11
        }, options);
        this._pinNumber = pinNumber;
        this._type = sensorOptions.type;
        this._calibration = sensorOptions.calibration;
        // Read sensor value every 60 seconds
        Observable_1.Observable.interval(sensorOptions.readingInterval * 1000).subscribe(this._getSensorValue);
        // Initial reading (wait for next tick so accessory will be subscribed when initial value is pushed)
        setTimeout(function () { _this._getSensorValue(); }, 0);
    }
    return DHTSensorDevice;
}());
exports.DHTSensorDevice = DHTSensorDevice;
