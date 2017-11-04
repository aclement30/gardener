import { AccessoryManager } from './accessory-manager';
import { HomekitBridge } from './homekit-bridge';
import { GardenMonitor } from './garden-monitor';
import GPIO from './gpio/gpio-manager';

// Register listeners for process shutdown

process.on('uncaughtException', (err) => {
  console.trace(err);

  accessoryManager.shutdownAll(() => {
    process.exit (1);
  });

  setTimeout(() => { process.exit(1); }, 1000);
});

process.on('exit', () => {
  GPIO.destroy();
});

process.on ('SIGINT', () => {
  accessoryManager.shutdownAll(() => {
    process.exit (0);
  });
});

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
