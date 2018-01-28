import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { GardenAccessory } from '../models/accessory';
import { HumiditySensor } from './humidity-sensor.accessory';
import { TemperatureSensor } from './temperature-sensor.accessory';
import { GreenhouseServo } from './greenhouse-servo.accessory';
import { GardenMonitor, LOG_TYPE } from '../garden-monitor';
import { AccessoryGroup } from './accessory-group';

export class Greenhouse extends AccessoryGroup implements GardenAccessory {

  public humidity$: BehaviorSubject<number>;
  public coverState$: BehaviorSubject<number>;

  private _humiditySensor: HumiditySensor;
  private _temperatureSensor: TemperatureSensor;
  private _servo: GreenhouseServo;

  constructor(name: string, accessories: { [alias: string]: GardenAccessory }) {
    super(name, accessories);

    Object.keys(accessories).forEach((alias) => {
      const accessory = accessories[alias];

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
    if (!this._servo) return;
    this._servo.open(automated);
  }

  close(automated: true): void {
    if (!this._servo) return;
    this._servo.close(automated);
  }
}
