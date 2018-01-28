"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
exports.__esModule = true;
var HAP = require("hap-nodejs");
var uuid = HAP.uuid;
var storage = require("node-persist");
var garden_monitor_1 = require("../garden-monitor");
exports.namespace = 'gardener:accessory-group';
var AccessoryGroup = /** @class */ (function (_super) {
    __extends(AccessoryGroup, _super);
    function AccessoryGroup(name, accessories) {
        var _this = _super.call(this, name, uuid.generate(exports.namespace + ":" + name)) || this;
        _this._accessories = new Map();
        _this.name = name;
        Object.keys(accessories).forEach(function (alias) {
            var accessory = accessories[alias];
            _this._accessories.set(alias, accessory);
            _super.prototype.addBridgedAccessory.call(_this, accessory);
        });
        return _this;
    }
    AccessoryGroup.prototype.getAccessories = function () {
        return this._accessories;
    };
    AccessoryGroup.prototype.publish = function (homekitConfig) {
        // Initialize storage system for HAP
        storage.initSync();
        // Publish the Bridge on the local network.
        _super.prototype.publish.call(this, __assign({}, homekitConfig, { category: HAP.Accessory.Categories.BRIDGE }));
        garden_monitor_1.GardenMonitor.announce(garden_monitor_1.LOG_TYPE.HOMEKIT_START, "[" + this.name + "] group is now public on local network (pin: " + homekitConfig.pincode + ")");
        this._accessories.forEach(function (accessory, alias) {
            garden_monitor_1.GardenMonitor.notice("+ " + accessory.name);
        });
    };
    return AccessoryGroup;
}(HAP.Bridge));
exports.AccessoryGroup = AccessoryGroup;
