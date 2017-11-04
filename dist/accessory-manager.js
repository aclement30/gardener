"use strict";
exports.__esModule = true;
var BehaviorSubject_1 = require("rxjs/BehaviorSubject");
var ReplaySubject_1 = require("rxjs/ReplaySubject");
require("rxjs/add/operator/map");
var async = require("async");
var garden_monitor_1 = require("./garden-monitor");
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
        if (this._accessories.has(alias))
            return;
        this._accessories.set(alias, accessory);
        this.accessoryAdded$.next(accessory);
        garden_monitor_1.GardenMonitor.notice("+ " + accessory.name);
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
