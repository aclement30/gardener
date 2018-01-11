import * as HAP from 'hap-nodejs';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { GardenAccessory } from '../models/accessory';
import { HumiditySensor } from './humidity-sensor.accessory';
import { TemperatureSensor } from './temperature-sensor.accessory';
import { GreenhouseServo } from './greenhouse-servo.accessory';
import { GardenMonitor, LOG_TYPE } from '../garden-monitor';

export const namespace = 'gardener:accessories:greenhouse';

export class Greenhouse extends HAP.Accessory implements GardenAccessory {

  public id: number;
  public name: string;
  public humidity$: BehaviorSubject<number>;
  public coverState$: BehaviorSubject<number>;

  private _humiditySensor: HumiditySensor;
  private _temperatureSensor: TemperatureSensor;
  private _servo: GreenhouseServo;
  private _childAccessories: { [alias: string]: GardenAccessory };

  constructor(name: string, childAccessories: { [alias: string]: GardenAccessory }) {
    super(name, HAP.uuid.generate(`${namespace}:${name}`));

    this.name = name;

    this._childAccessories = childAccessories;

    Object.keys(this._childAccessories).forEach((alias) => {
      const accessory = this._childAccessories[alias];

      if (accessory instanceof HumiditySensor) {
        this._humiditySensor = accessory;
        this.humidity$ = this._humiditySensor.currentHumidity$;
      } else if (accessory instanceof TemperatureSensor) {
        this._temperatureSensor = accessory;
      } else if (accessory instanceof GreenhouseServo) {
        this._servo = accessory;
        this.coverState$ = this._servo.currentPosition$;
      } else {
        GardenMonitor.warning(LOG_TYPE.SETUP_ERROR, `Wrong greenhouse config: unknown type for ${name + ' - ' + accessory.name}`, this);
      }
    });
  }

  shutdown = (callback?: Function): void => {
    // Bridge accessory: nothing to do
  }

  open(automated: true): void {
    this._servo.open(automated);
  }

  close(automated: true): void {
    this._servo.close(automated);
  }

  getChildAccessories(): { [alias: string]: GardenAccessory } {
    return this._childAccessories;
  }
}
