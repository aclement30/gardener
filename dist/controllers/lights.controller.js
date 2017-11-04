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
            var currentTime = new Date();
            var lightingUpTime = _this._toDateTime(lights_1["default"].lightingUpTime);
            var lightingDownTime = _this._toDateTime(lights_1["default"].lightingDownTime);
            if (currentTime >= lightingUpTime && currentTime < lightingDownTime) {
                lights.forEach(function (light) {
                    if (!light.isOn && !light.hasOverride)
                        light.turnOn(true);
                });
            }
            else {
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
    LightsController.prototype._toDateTime = function (time) {
        var today = new Date();
        var splitTime = time.split(':');
        return new Date(today.getFullYear(), today.getMonth(), today.getDate(), +splitTime[0], +splitTime[1]);
    };
    return LightsController;
}());
exports.LightsController = LightsController;
