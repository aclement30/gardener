import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import * as HAP from 'hap-nodejs';

import { GardenAccessory } from '../models/accessory';
import { GardenMonitor, LOG_TYPE } from '../garden-monitor';
import { DHTSensorDevice, DHTSensorValue } from '../gpio/dht-sensor';
import { AccessoryGroup } from './accessory-group';

export const namespace = 'gardener:accessories:humidity-sensor';

export class HumiditySensor extends HAP.Accessory implements GardenAccessory {

  public id: number;
  public name: string;
  public group: AccessoryGroup;
  public currentHumidity$: BehaviorSubject<number>;

  private _dhtSensorDevice: DHTSensorDevice;

  constructor(name: string, sensorDevice: DHTSensorDevice) {
    super(name, HAP.uuid.generate(`${namespace}:${name}`));

    this.name = name;
    this.currentHumidity$ = new BehaviorSubject(0);

    this._configureHomekit();

    // Init DHT sensor device
    this._dhtSensorDevice = sensorDevice;
    this._dhtSensorDevice.value$.subscribe(this._onValueChange);
  }

  getHumidity = (callback) => {
    const humidity = this.currentHumidity$.getValue();
    callback(null, humidity);
  }

  shutdown = (callback?: Function): void => {
    // Input sensor: nothing to shutdown
    if (callback) callback();
  }

  // Configure Homekit accessory
  private _configureHomekit() {
    this
      .addService(HAP.Service.HumiditySensor)
      .getCharacteristic(HAP.Characteristic.CurrentRelativeHumidity)
      .on('get', this.getHumidity);

    this.currentHumidity$.subscribe((currentHumidity) => {

      // Update the characteristic value so interested iOS devices can get notified
      this
        .getService(HAP.Service.HumiditySensor)
        .setCharacteristic(HAP.Characteristic.CurrentRelativeHumidity, currentHumidity);
    })
  }

  private _onValueChange = (value: DHTSensorValue): void => {
    this.currentHumidity$.next(value.humidity);
    if (this.id) GardenMonitor.info(LOG_TYPE.READING, value.humidity, this, `Humidity: ${value.humidity}%`);
  }
}
