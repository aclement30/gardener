import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import * as async from 'async';

import { GardenAccessory } from './models/accessory';
import { GardenMonitor, LOG_TYPE } from './garden-monitor';
import { AccessoryGroup } from './accessories/accessory-group';
import HOMEKIT_CONFIG from './config/homekit';

export type GardenAccessoryMap = Map<string, GardenAccessory>;

export class AccessoryManager {
  public accessoryAdded$: ReplaySubject<GardenAccessory>;
  public accessories$: BehaviorSubject<GardenAccessoryMap>;

  private _accessories = new Map<string, GardenAccessory>();
  private _groups = new Map<string, AccessoryGroup>();

  constructor() {
    this.accessoryAdded$ = new ReplaySubject();
    this.accessories$ = new BehaviorSubject(this._accessories);
  }

  loadFromConfig(accessoryGroups) {
    GardenMonitor.notice(`Loading accessory groups from config`);

    Object.keys(accessoryGroups).forEach((groupAlias: string) => {
      const group: AccessoryGroup = accessoryGroups[groupAlias];
      this._groups.set(groupAlias, group);

      // Register child accessories from group
      group.getAccessories().forEach((accessory: GardenAccessory, alias: string) => {
        this.addAccessory(`${groupAlias}-${alias}`, accessory, group);
      });
    });
  }

  addAccessory(alias: string, accessory: GardenAccessory, group: AccessoryGroup) {
    if (this._accessories.has(alias)) return;

    accessory.group = group;
    this._accessories.set(alias, accessory);
    this.accessoryAdded$.next(accessory);

    GardenMonitor.registerAccessory(alias, (error, accessoryId) => {
      if (!error) {
        accessory.id = accessoryId;
      }
    });
  }

  removeAccessory(alias: string) {
    this._accessories.delete(alias);
  }

  getByName(alias: string): GardenAccessory {
    return this._accessories.get(alias);
  }

  getByType(type: any): Observable<GardenAccessoryMap> {
    return this.accessories$.asObservable().map((accessories: GardenAccessoryMap) => {
      const filteredAccessories = new Map<string, GardenAccessory>();
      accessories.forEach((accessory: GardenAccessory, alias: string) => {
        if (accessory instanceof type) {
          filteredAccessories.set(alias, accessory);
        }
      });
      return filteredAccessories;
    });
  }

  forEach(callback) {
    this._accessories.forEach(callback);
  }

  publishAccessories(): void {
    this._groups.forEach((group: AccessoryGroup, alias: string) => {
      if (HOMEKIT_CONFIG[alias]) {
        group.publish(HOMEKIT_CONFIG[alias]);
      } else {
        GardenMonitor.warning(LOG_TYPE.SETUP_ERROR, `No config for group ${group.name}`);
      }
    });
  }

  shutdownAll(callback?: Function): void {
    const accessories = Array.from(this._accessories.values());

    async.each(accessories, (accessory: GardenAccessory, callback: Function) => {
      accessory.shutdown(callback);
    }, callback);
  }

  get count() {
    return this._accessories.size;
  }
}