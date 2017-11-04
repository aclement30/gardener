import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import * as HAP from 'hap-nodejs';

import { GardenMonitor, ACCESSORY_TAG } from '../garden-monitor';
import { DHTSensorDevice, DHTSensorValue } from '../gpio/dht-sensor';

export const namespace = 'gardener:accessories:temperature-sensor';

export class TemperatureSensor extends HAP.Accessory {

  public name: string;
  public currentTemperature$: BehaviorSubject<number>;

  private _dhtSensorDevice: DHTSensorDevice;

  constructor(name: string, sensorDevice: DHTSensorDevice) {
    super(name, HAP.uuid.generate(`${namespace}:${name}`));

    this.name = name;
    this.currentTemperature$ = new BehaviorSubject(0);

    this._configureHomekit();

    // Init DHT sensor device
    this._dhtSensorDevice = sensorDevice;
    this._dhtSensorDevice.value$.subscribe(this._onValueChange);
  }

  getTemperature = (callback) => {
    const temperature = this.currentTemperature$.getValue();
    callback(null, temperature);
  }

  // Configure Homekit accessory
  _configureHomekit() {
    this
      .addService(HAP.Service.TemperatureSensor)
      .getCharacteristic(HAP.Characteristic.CurrentTemperature)
      .on('get', this.getTemperature);

    this.currentTemperature$.subscribe((temperature) => {
      GardenMonitor.info(`Temperature: ${temperature}°C`, this, [ACCESSORY_TAG]);

      // Update the characteristic value so interested iOS devices can get notified
      this
        .getService(HAP.Service.TemperatureSensor)
        .setCharacteristic(HAP.Characteristic.CurrentTemperature, temperature);
    })
  }

  private _onValueChange = (value: DHTSensorValue): void => {
    this.currentTemperature$.next(value.temperature);
  }
}
