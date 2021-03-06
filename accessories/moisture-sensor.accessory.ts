import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import * as HAP from 'hap-nodejs';

import { GardenAccessory } from '../models/accessory';
import { GardenMonitor, LOG_TYPE } from '../garden-monitor';
import { InputDevice } from '../gpio/input.device';
import { AccessoryGroup } from './accessory-group';

export const namespace = 'gardener:accessories:moisture-sensor';

export class MoistureSensor extends HAP.Accessory implements GardenAccessory {

  public id: number;
  public name: string;
  public group: AccessoryGroup;
  public currentMoisture$: BehaviorSubject<number>;

  private _gpioDevice: InputDevice;

  constructor(name: string, pinNumber?: number) {
    super(name, HAP.uuid.generate(`${namespace}:${name}`));

    this.name = name;
    this.currentMoisture$ = new BehaviorSubject(0);

    this._configureHomekit();

    // Init GPIO device
    this._gpioDevice = new InputDevice(pinNumber);
    this._gpioDevice.value$.subscribe(this._onValueChange);

    setInterval(() => {
      this._randomizeMoisture();
    }, 3000);
  }

  getMoisture = (callback) => {
    const moisture = this.currentMoisture$.getValue();
    callback(null, moisture);
  }

  shutdown = (callback?: Function): void => {
    // Input sensor: nothing to shutdown
    if (callback) callback();
  }

  // Configure Homekit accessory
  _configureHomekit() {
    this
      .addService(HAP.Service.HumiditySensor)
      .getCharacteristic(HAP.Characteristic.CurrentRelativeHumidity)
      .on('get', this.getMoisture);

    this.currentMoisture$.subscribe((currentMoisture) => {
      // Update the characteristic value so interested iOS devices can get notified
      this
        .getService(HAP.Service.HumiditySensor)
        .setCharacteristic(HAP.Characteristic.CurrentRelativeHumidity, currentMoisture);
    })
  }

  _randomizeMoisture = () => {
    // randomize moisture to a value between 0 and 100
    const value = Math.round(Math.random() * 100);
    this.currentMoisture$.next(value);
  }

  private _onValueChange = (value: number): void => {
    this.currentMoisture$.next(value);
    if (this.id) GardenMonitor.info(LOG_TYPE.READING, value, this, `Moisture: ${value}%`);
  }
}
