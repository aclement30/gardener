import * as storage from 'node-persist';
import * as HAP from 'hap-nodejs';
import { AccessoryManager } from './accessory-manager';
import { GardenMonitor, LOG_TYPE } from './garden-monitor';
import HOMEKIT_CONFIG from './config/homekit';

const Accessory = HAP.Accessory;
const Bridge = HAP.Bridge;
const uuid = HAP.uuid;

export class HomekitBridge extends Bridge {

  private _accessoryManager: AccessoryManager;

  constructor(accessoryManager) {
    super(HOMEKIT_CONFIG.name, uuid.generate(HOMEKIT_CONFIG.name));

    this._accessoryManager = accessoryManager;
    this._accessoryManager.accessoryAdded$.subscribe(this._onAccessoryAdded);
  }

  publish() {
    // Initialize storage system for HAP
    storage.initSync();

    // Publish the Bridge on the local network.
    super.publish({
      username: HOMEKIT_CONFIG.username,
      port: 51826,
      pincode: HOMEKIT_CONFIG.pincode,
      category: Accessory.Categories.BRIDGE,
    });

    GardenMonitor.announce(LOG_TYPE.HOMEKIT_START, `${HOMEKIT_CONFIG.name} accessory bridge is now public on local network`);
  }

  _onAccessoryAdded = (accessory) => {
    super.addBridgedAccessory(accessory);
  }
}
