"use strict";
exports.__esModule = true;
var colors = require("colors");
var pad = require("pad");
var GardenMonitor = /** @class */ (function () {
    function GardenMonitor() {
    }
    GardenMonitor.log = function (message, accessory, tags) {
        console.log(message);
    };
    GardenMonitor.info = function (message, accessory, tags) {
        if (accessory) {
            console.log(pad("[INFO] (" + accessory.name + ")", 32) + message);
        }
        else {
            console.log("" + message);
        }
    };
    GardenMonitor.notice = function (message, accessory, tags) {
        GardenMonitor.log(colors.yellow(message), accessory, tags);
    };
    GardenMonitor.announce = function (message, tags) {
        GardenMonitor.log(colors.green(message));
    };
    GardenMonitor.warning = function (message, accessory, tags) {
        GardenMonitor.log('⚠️  ' + message, accessory, tags);
    };
    GardenMonitor.emergency = function (message, accessory, tags) {
        GardenMonitor.log('🚨  ' + message, accessory, tags);
    };
    return GardenMonitor;
}());
exports.GardenMonitor = GardenMonitor;
exports.GPIO_TAG = 'GPIO';
exports.ACCESSORY_TAG = 'ACCESSORY';
