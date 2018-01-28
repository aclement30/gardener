"use strict";
exports.__esModule = true;
var accessory_manager_1 = require("./accessory-manager");
var garden_monitor_1 = require("./garden-monitor");
// Register listeners for process shutdown
process.on('exit', function () {
    garden_monitor_1.GardenMonitor.closeDatabase();
});
process.on('SIGINT', function () {
    garden_monitor_1.GardenMonitor.closeDatabase();
});
var lights_controller_1 = require("./controllers/lights.controller");
// Init accessory manager
var accessoryManager = new accessory_manager_1.AccessoryManager();
// Load all accessories from config
var accessories_1 = require("./config/accessories");
accessoryManager.loadFromConfig(accessories_1["default"]);
// Start Homekit bridge
accessoryManager.publishAccessories();
garden_monitor_1.GardenMonitor.announce(garden_monitor_1.LOG_TYPE.START, ' 🚀  Gardener launched');
// Start controllers
var controllers = [
    //new GreenhousesController(accessoryManager),
    new lights_controller_1.LightsController(accessoryManager),
];
