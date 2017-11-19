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
exports.__esModule = true;
var storage = require("node-persist");
var HAP = require("hap-nodejs");
var garden_monitor_1 = require("./garden-monitor");
var Accessory = HAP.Accessory;
var Bridge = HAP.Bridge;
var uuid = HAP.uuid;
var HomekitBridge = /** @class */ (function (_super) {
    __extends(HomekitBridge, _super);
    function HomekitBridge(accessoryManager) {
        var _this = _super.call(this, 'Gardener', uuid.generate("Gardener")) || this;
        _this._onAccessoryAdded = function (accessory) {
            _super.prototype.addBridgedAccessory.call(_this, accessory);
        };
        _this._accessoryManager = accessoryManager;
        _this._accessoryManager.accessoryAdded$.subscribe(_this._onAccessoryAdded);
        return _this;
    }
    HomekitBridge.prototype.publish = function () {
        // Initialize storage system for HAP
        storage.initSync();
        // Publish the Bridge on the local network.
        _super.prototype.publish.call(this, {
            username: "CC:22:3D:E3:CE:F6",
            port: 51826,
            pincode: "031-45-154",
            category: Accessory.Categories.BRIDGE
        });
        garden_monitor_1.GardenMonitor.announce(garden_monitor_1.LOG_TYPE.HOMEKIT_START, 'Garden accessory bridge is now public on local network');
    };
    return HomekitBridge;
}(Bridge));
exports.HomekitBridge = HomekitBridge;
