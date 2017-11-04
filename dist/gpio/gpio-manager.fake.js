"use strict";
exports.__esModule = true;
var events_1 = require("events");
var channelValues = new Map();
var eventEmitter = new events_1.EventEmitter();
var GpioManagerFake = /** @class */ (function () {
    function GpioManagerFake() {
    }
    GpioManagerFake.setup = function (channel, direction, edge, onSetup) {
        if (onSetup) {
            onSetup();
        }
    };
    GpioManagerFake.write = function (channel, value, cb) {
        channelValues.set(channel, value);
        eventEmitter.emit('change', channel, value);
        if (cb) {
            cb();
        }
    };
    GpioManagerFake.read = function (channel, cb) {
        var value = channelValues.get(channel);
        cb(false, value);
    };
    GpioManagerFake.on = function (event, listener) {
        eventEmitter.addListener(event, listener);
    };
    GpioManagerFake.destroy = function (cb) {
        channelValues.clear();
        eventEmitter.removeAllListeners();
        if (cb) {
            cb();
        }
    };
    GpioManagerFake.DIR_IN = 'in';
    GpioManagerFake.DIR_OUT = 'out';
    GpioManagerFake.DIR_LOW = 'low';
    GpioManagerFake.DIR_HIGH = 'high';
    GpioManagerFake.MODE_RPI = 'mode_rpi';
    GpioManagerFake.MODE_BCM = 'mode_bcm';
    GpioManagerFake.EDGE_NONE = 'none';
    GpioManagerFake.EDGE_RISING = 'rising';
    GpioManagerFake.EDGE_FALLING = 'falling';
    GpioManagerFake.EDGE_BOTH = 'both';
    return GpioManagerFake;
}());
exports.GpioManagerFake = GpioManagerFake;
module.exports = GpioManagerFake;
