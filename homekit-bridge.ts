import * as storage from 'node-persist';
import * as HAP from 'hap-nodejs';
import { AccessoryManager } from './accessory-manager';
import { GardenMonitor } from './garden-monitor';

const Accessory = HAP.Accessory;
const Bridge = HAP.Bridge;
const uuid = HAP.uuid;

export class HomekitBridge extends Bridge {

  private _accessoryManager: AccessoryManager;

  constructor(accessoryManager) {
    super('Gardener', uuid.generate("Gardener"));

    this._accessoryManager = accessoryManager;
    this._accessoryManager.accessoryAdded$.subscribe(this._onAccessoryAdded);
  }

  publish() {
    // Initialize storage system for HAP
    storage.initSync();

    // Publish the Bridge on the local network.
    super.publish({
      username: "CC:22:3D:E3:CE:F6",
      port: 51826,
      pincode: "031-45-154",
      category: Accessory.Categories.BRIDGE,
    })

    GardenMonitor.announce('Garden accessory bridge is now public on local network')
  }

  _onAccessoryAdded = (accessory) => {
    super.addBridgedAccessory(accessory);
  }
}
