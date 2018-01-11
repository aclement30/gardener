"use strict";
exports.__esModule = true;
var BehaviorSubject_1 = require("rxjs/BehaviorSubject");
var ReplaySubject_1 = require("rxjs/ReplaySubject");
require("rxjs/add/operator/map");
var async = require("async");
var garden_monitor_1 = require("./garden-monitor");
var greenhouse_accessory_1 = require("./accessories/greenhouse.accessory");
var greenhouses_1 = require("./config/greenhouses");
var AccessoryManager = /** @class */ (function () {
    function AccessoryManager() {
        this._accessories = new Map();
        this.accessoryAdded$ = new ReplaySubject_1.ReplaySubject();
        this.accessories$ = new BehaviorSubject_1.BehaviorSubject(this._accessories);
    }
    AccessoryManager.prototype.loadFromConfig = function (accessoriesList) {
        var _this = this;
        garden_monitor_1.GardenMonitor.notice("Loading " + Object.keys(accessoriesList).length + " accessories from config:");
        Object.keys(accessoriesList).forEach(function (alias) {
            var accessory = accessoriesList[alias];
            _this.addAccessory(alias, accessory);
        });
    };
    AccessoryManager.prototype.addAccessory = function (alias, accessory) {
        var _this = this;
        if (this._accessories.has(alias))
            return;
        this._accessories.set(alias, accessory);
        this.accessoryAdded$.next(accessory);
        if (accessory instanceof greenhouse_accessory_1.Greenhouse) {
            // Register child accessories from greenhouse
            var childAccessories_1 = accessory.getChildAccessories();
            Object.keys(childAccessories_1).forEach(function (childAlias) {
                var childAccessory = childAccessories_1[childAlias];
                _this.addAccessory(alias + "-" + childAlias, childAccessory);
            });
            if (!greenhouses_1["default"][alias]) {
                garden_monitor_1.GardenMonitor.warning(garden_monitor_1.LOG_TYPE.SETUP_ERROR, "No greenhouse config for " + name);
            }
        }
        garden_monitor_1.GardenMonitor.registerAccessory(alias, function (error, accessoryId) {
            if (!error) {
                accessory.id = accessoryId;
                garden_monitor_1.GardenMonitor.notice("+ " + accessory.name);
            }
        });
    };
    AccessoryManager.prototype.removeAccessory = function (alias) {
        this._accessories["delete"](alias);
    };
    AccessoryManager.prototype.getByName = function (alias) {
        return this._accessories.get(alias);
    };
    AccessoryManager.prototype.getByType = function (type) {
        return this.accessories$.asObservable().map(function (accessories) {
            var filteredAccessories = new Map();
            accessories.forEach(function (accessory, alias) {
                if (accessory instanceof type) {
                    filteredAccessories.set(alias, accessory);
                }
            });
            return filteredAccessories;
        });
    };
    AccessoryManager.prototype.forEach = function (callback) {
        this._accessories.forEach(callback);
    };
    AccessoryManager.prototype.shutdownAll = function (callback) {
        var accessories = Array.from(this._accessories.values());
        async.each(accessories, function (accessory, callback) {
            accessory.shutdown(callback);
        }, callback);
    };
    Object.defineProperty(AccessoryManager.prototype, "count", {
        get: function () {
            return this._accessories.size;
        },
        enumerable: true,
        configurable: true
    });
    return AccessoryManager;
}());
exports.AccessoryManager = AccessoryManager;
