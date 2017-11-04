import { AccessoryManager } from './accessory-manager';
import { HomekitBridge } from './homekit-bridge';
import { GardenMonitor } from './garden-monitor';
import GPIO from './gpio/gpio-manager';

// Controllers
import { LightsController } from './controllers/lights.controller';

// Init accessory manager
const accessoryManager = new AccessoryManager();

// Load all accessories from config
import accessoriesList from './config/accessories';
accessoryManager.loadFromConfig(accessoriesList);

// Start Homekit bridge
const homekitBridge = new HomekitBridge(accessoryManager);
homekitBridge.publish();

GardenMonitor.announce(' 🚀  Gardener launched');

// Start controllers
const controllers = [
  new LightsController(accessoryManager),
];

process.on('exit', () => {
  GPIO.destroy();
});