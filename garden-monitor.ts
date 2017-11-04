import * as colors from 'colors';
import * as pad from 'pad';

import { GardenAccessory } from './models/accessory';

export class GardenMonitor {
  static log(message: string, accessory?: GardenAccessory, tags?: [string]) {
    console.log(message);
  }

  static info(message: string, accessory?: GardenAccessory, tags?: [string]) {
    if (accessory) {
      console.log(pad(`[INFO] (${accessory.name})`, 32) + message);
    } else {
      console.log(`${message}`);
    }
  }

  static notice(message: string, accessory?: GardenAccessory, tags?: [string]) {
    GardenMonitor.log(colors.yellow(message), accessory, tags);
  }

  static announce(message: string, tags?: [string]) {
    GardenMonitor.log(colors.green(message));
  }

  static warning(message: string, accessory?: GardenAccessory, tags?: [string]) {
    GardenMonitor.log('⚠️  ' + message, accessory, tags);
  }

  static emergency(message: string, accessory?: GardenAccessory, tags?: [string]) {
    GardenMonitor.log('🚨  ' + message, accessory, tags);
  }
}

export const GPIO_TAG = 'GPIO';
export const ACCESSORY_TAG = 'ACCESSORY';