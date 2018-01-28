"use strict";
exports.__esModule = true;
var BehaviorSubject_1 = require("rxjs/BehaviorSubject");
var ReplaySubject_1 = require("rxjs/ReplaySubject");
require("rxjs/add/operator/map");
var async = require("async");
var garden_monitor_1 = require("./garden-monitor");
var homekit_1 = require("./config/homekit");
var AccessoryManager = /** @class */ (function () {
    function AccessoryManager() {
        this._accessories = new Map();
        this._groups = new Map();
        this.accessoryAdded$ = new ReplaySubject_1.ReplaySubject();
        this.accessories$ = new BehaviorSubject_1.BehaviorSubject(this._accessories);
    }
    AccessoryManager.prototype.loadFromConfig = function (accessoryGroups) {
        var _this = this;
        garden_monitor_1.GardenMonitor.notice("Loading accessory groups from config");
        Object.keys(accessoryGroups).forEach(function (groupAlias) {
            var group = accessoryGroups[groupAlias];
            _this._groups.set(groupAlias, group);
            // Register child accessories from group
            group.getAccessories().forEach(function (accessory, alias) {
                _this.addAccessory(groupAlias + "-" + alias, accessory, group);
            });
        });
    };
    AccessoryManager.prototype.addAccessory = function (alias, accessory, group) {
        if (this._accessories.has(alias))
            return;
        accessory.group = group;
        this._accessories.set(alias, accessory);
        this.accessoryAdded$.next(accessory);
        garden_monitor_1.GardenMonitor.registerAccessory(alias, function (error, accessoryId) {
            if (!error) {
                accessory.id = accessoryId;
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
    AccessoryManager.prototype.publishAccessories = function () {
        this._groups.forEach(function (group, alias) {
            if (homekit_1["default"][alias]) {
                group.publish(homekit_1["default"][alias]);
            }
            else {
                garden_monitor_1.GardenMonitor.warning(garden_monitor_1.LOG_TYPE.SETUP_ERROR, "No config for group " + group.name);
            }
        });
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
