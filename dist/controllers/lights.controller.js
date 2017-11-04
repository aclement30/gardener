"use strict";
exports.__esModule = true;
var Observable_1 = require("rxjs/Observable");
require("rxjs/add/observable/interval");
require("rxjs/add/operator/combineLatest");
var light_accessory_1 = require("../accessories/light.accessory");
var lights_1 = require("../config/lights");
var LightsController = /** @class */ (function () {
    function LightsController(accessoryManager) {
        var _this = this;
        this.accessoryManager = accessoryManager;
        this.handleLights = function (lights) {
            var currentTime = _this._getCurrentTime();
            if (currentTime >= lights_1["default"].lightingUpTime) {
                //console.log('TURNING LIGHTS ON');
                lights.forEach(function (light) {
                    if (!light.isOn && !light.hasOverride)
                        light.turnOn(true);
                });
            }
            else if (currentTime >= lights_1["default"].lightingDownTime || currentTime < lights_1["default"].lightingUpTime) {
                //console.log('TURNING LIGHTS OFF');
                lights.forEach(function (light) {
                    if (light.isOn && !light.hasOverride)
                        light.turnOff(false);
                });
            }
        };
        this.lights$ = accessoryManager.getByType(light_accessory_1.Light);
        // Check the status of the lights on every 3 seconds
        Observable_1.Observable.interval(3000).combineLatest(this.lights$, function (time, lights) { return (lights); })
            .subscribe(this.handleLights);
    }
    LightsController.prototype._getCurrentTime = function () {
        var date = new Date();
        return date.toTimeString().substr(0, 5);
    };
    return LightsController;
}());
exports.LightsController = LightsController;
