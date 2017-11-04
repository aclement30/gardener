"use strict";
exports.__esModule = true;
var accessory_manager_1 = require("./accessory-manager");
var homekit_bridge_1 = require("./homekit-bridge");
var garden_monitor_1 = require("./garden-monitor");
var gpio_manager_1 = require("./gpio/gpio-manager");
// Controllers
var lights_controller_1 = require("./controllers/lights.controller");
// Init accessory manager
var accessoryManager = new accessory_manager_1.AccessoryManager();
// Load all accessories from config
var accessories_1 = require("./config/accessories");
accessoryManager.loadFromConfig(accessories_1["default"]);
// Start Homekit bridge
var homekitBridge = new homekit_bridge_1.HomekitBridge(accessoryManager);
homekitBridge.publish();
garden_monitor_1.GardenMonitor.announce(' 🚀  Gardener launched');
// Start controllers
var controllers = [
    new lights_controller_1.LightsController(accessoryManager),
];
process.on('exit', function () {
    gpio_manager_1["default"].destroy();
});
