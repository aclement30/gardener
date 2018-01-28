import * as HAP from 'hap-nodejs';
const uuid = HAP.uuid;
import * as storage from 'node-persist';

import { GardenAccessory } from '../models/accessory';
import { GardenMonitor, LOG_TYPE } from '../garden-monitor';
import { GardenAccessoryMap } from '../accessory-manager';
import { HomekitConfig } from '../models/homekit.config';

export const namespace = 'gardener:accessory-group';

export class AccessoryGroup extends HAP.Bridge {

  public id: number;
  public name: string;
  private _accessories = new Map<string, GardenAccessory>();

  constructor(name: string, accessories: { [alias: string]: GardenAccessory }) {
    super(name, uuid.generate(`${namespace}:${name}`));

    this.name = name;

    Object.keys(accessories).forEach((alias) => {
      const accessory = accessories[alias];
      this._accessories.set(alias, accessory);
      super.addBridgedAccessory(accessory as any);
    });
  }

  getAccessories(): GardenAccessoryMap {
    return this._accessories;
  }

  publish(homekitConfig: HomekitConfig) {
    // Initialize storage system for HAP
    storage.initSync();

    // Publish the Bridge on the local network.
    super.publish({
      ...homekitConfig,
      category: HAP.Accessory.Categories.BRIDGE,
    });

    GardenMonitor.announce(LOG_TYPE.HOMEKIT_START, `[${this.name}] group is now public on local network (pin: ${homekitConfig.pincode})`);

    this._accessories.forEach((accessory: GardenAccessory, alias: string) => {
      GardenMonitor.notice(`+ ${accessory.name}`);
    });
  }
}
