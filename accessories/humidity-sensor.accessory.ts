import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import * as HAP from 'hap-nodejs';

import { GardenAccessory } from '../models/accessory';
import { GardenMonitor, ACCESSORY_TAG } from '../garden-monitor';
import { DHTSensorDevice, DHTSensorValue } from '../gpio/dht-sensor';

export const namespace = 'gardener:accessories:humidity-sensor';

export class HumiditySensor extends HAP.Accessory implements GardenAccessory {

  public name: string;
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

  shutdown = (): void => {}

  // Configure Homekit accessory
  private _configureHomekit() {
    this
      .addService(HAP.Service.HumiditySensor)
      .getCharacteristic(HAP.Characteristic.CurrentRelativeHumidity)
      .on('get', this.getHumidity);

    this.currentHumidity$.subscribe((currentHumidity) => {
      GardenMonitor.info(`Humidity: ${currentHumidity}%`, this, [ACCESSORY_TAG]);

      // Update the characteristic value so interested iOS devices can get notified
      this
        .getService(HAP.Service.HumiditySensor)
        .setCharacteristic(HAP.Characteristic.CurrentRelativeHumidity, currentHumidity);
    })
  }

  private _onValueChange = (value: DHTSensorValue): void => {
    this.currentHumidity$.next(value.humidity);
  }
}
