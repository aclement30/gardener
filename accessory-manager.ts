import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import * as async from 'async';

import { GardenAccessory } from './models/accessory';
import { GardenMonitor, LOG_TYPE } from './garden-monitor';
import { Greenhouse } from './accessories/greenhouse.accessory';
import GREENHOUSES_CONFIG from './config/greenhouses';

type GardenAccessoryMap = Map<string, GardenAccessory>;

export class AccessoryManager {
  public accessoryAdded$: ReplaySubject<GardenAccessory>;
  public accessories$: BehaviorSubject<GardenAccessoryMap>;

  private _accessories = new Map<string, GardenAccessory>();

  constructor() {
    this.accessoryAdded$ = new ReplaySubject();
    this.accessories$ = new BehaviorSubject(this._accessories);
  }

  loadFromConfig(accessoriesList) {
    GardenMonitor.notice(`Loading ${Object.keys(accessoriesList).length} accessories from config:`);

    Object.keys(accessoriesList).forEach((alias) => {
      const accessory = accessoriesList[alias];
      this.addAccessory(alias, accessory);
    });
  }

  addAccessory(alias: string, accessory: GardenAccessory) {
    if (this._accessories.has(alias)) return;

    this._accessories.set(alias, accessory);
    this.accessoryAdded$.next(accessory);

    if (accessory instanceof Greenhouse) {
      // Register child accessories from greenhouse
      const childAccessories = accessory.getChildAccessories();
      Object.keys(childAccessories).forEach((childAlias) => {
        const childAccessory = childAccessories[childAlias];
        this.addAccessory(`${alias}-${childAlias}`, childAccessory);
      });

      if (!GREENHOUSES_CONFIG[alias]) {
        GardenMonitor.warning(LOG_TYPE.SETUP_ERROR, `No greenhouse config for ${accessory.name}`);
      }
    }

    GardenMonitor.registerAccessory(alias, (error, accessoryId) => {
      if (!error) {
        accessory.id = accessoryId;
        GardenMonitor.notice(`+ ${accessory.name}`);
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