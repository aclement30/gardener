"use strict";
exports.__esModule = true;
var Observable_1 = require("rxjs/Observable");
require("rxjs/add/observable/interval");
require("rxjs/add/operator/combineLatest");
var greenhouses_1 = require("../config/greenhouses");
var greenhouse_accessory_1 = require("../accessories/greenhouse.accessory");
var greenhouse_servo_accessory_1 = require("../accessories/greenhouse-servo.accessory");
var GreenhousesController = /** @class */ (function () {
    function GreenhousesController(accessoryManager) {
        this.accessoryManager = accessoryManager;
        this.handleClimate = function (greenhouses) {
            greenhouses.forEach(function (greenhouse, alias) {
                var humidity = greenhouse.humidity$.getValue();
                var coverState = greenhouse.coverState$.getValue();
                if (humidity > greenhouses_1["default"][alias].maxHumidity && coverState === greenhouse_servo_accessory_1.SERVO_POSITION.CLOSED) {
                    greenhouse.open(true);
                }
                else if (humidity < greenhouses_1["default"][alias].minHumidity && coverState === greenhouse_servo_accessory_1.SERVO_POSITION.OPEN) {
                    greenhouse.close(true);
                }
            });
        };
        this.greenhouses$ = accessoryManager.getByType(greenhouse_accessory_1.Greenhouse);
        // Check the climate status on every 3 seconds
        // TODO: Augment the delay
        Observable_1.Observable.interval(3000).combineLatest(this.greenhouses$, function (time, greenhouses) { return (greenhouses); })
            .subscribe(this.handleClimate);
    }
    return GreenhousesController;
}());
exports.GreenhousesController = GreenhousesController;
