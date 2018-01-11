"use strict";
exports.__esModule = true;
var accessory_manager_1 = require("./accessory-manager");
var homekit_bridge_1 = require("./homekit-bridge");
var garden_monitor_1 = require("./garden-monitor");
// Register listeners for process shutdown
process.on('uncaughtException', function (err) {
    console.trace(err);
    garden_monitor_1.GardenMonitor.announce(garden_monitor_1.LOG_TYPE.SHUTDOWN, ' ❗️  Gardener shutdown with error');
    accessoryManager.shutdownAll(function () {
        process.exit(1);
    });
    setTimeout(function () { process.exit(1); }, 1000);
});
process.on('exit', function () {
    garden_monitor_1.GardenMonitor.closeDatabase();
});
process.on('SIGINT', function () {
    garden_monitor_1.GardenMonitor.announce(garden_monitor_1.LOG_TYPE.STOP, ' 🛑  Gardener stopped', function () {
        garden_monitor_1.GardenMonitor.closeDatabase();
        accessoryManager.shutdownAll(function () {
            process.exit(0);
        });
    });
});
// Controllers
var greenhouses_controller_1 = require("./controllers/greenhouses.controller");
var lights_controller_1 = require("./controllers/lights.controller");
// Init accessory manager
var accessoryManager = new accessory_manager_1.AccessoryManager();
// Load all accessories from config
var accessories_1 = require("./config/accessories");
accessoryManager.loadFromConfig(accessories_1["default"]);
// Start Homekit bridge
var homekitBridge = new homekit_bridge_1.HomekitBridge(accessoryManager);
homekitBridge.publish();
garden_monitor_1.GardenMonitor.announce(garden_monitor_1.LOG_TYPE.START, ' 🚀  Gardener launched');
// Start controllers
var controllers = [
    new greenhouses_controller_1.GreenhousesController(accessoryManager),
    new lights_controller_1.LightsController(accessoryManager),
];
