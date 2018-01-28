import { AccessoryManager } from './accessory-manager';
import { GardenMonitor, LOG_TYPE } from './garden-monitor';

// Register listeners for process shutdown

process.on('exit', () => {
  GardenMonitor.closeDatabase();
});

process.on ('SIGINT', () => {
  GardenMonitor.closeDatabase();
});

// Controllers
import { GreenhousesController } from './controllers/greenhouses.controller';
import { LightsController } from './controllers/lights.controller';

// Init accessory manager
const accessoryManager = new AccessoryManager();

// Load all accessories from config
import accessoriesList from './config/accessories';
accessoryManager.loadFromConfig(accessoriesList);

// Start Homekit bridge
accessoryManager.publishAccessories();

GardenMonitor.announce(LOG_TYPE.START, ' 🚀  Gardener launched');

// Start controllers
const controllers = [
  //new GreenhousesController(accessoryManager),
  new LightsController(accessoryManager),
];
