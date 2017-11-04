"use strict";
exports.__esModule = true;
var DHTSensorFake = /** @class */ (function () {
    function DHTSensorFake() {
    }
    DHTSensorFake.read = function (mode, pinNumber, callback) {
        var temperature = Math.round(Math.random() * 35);
        var humidity = Math.round(Math.random() * 100);
        callback(false, temperature, humidity);
    };
    return DHTSensorFake;
}());
exports.DHTSensorFake = DHTSensorFake;
module.exports = DHTSensorFake;
