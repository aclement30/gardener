import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/interval';

import DHTSensorDriver from '../gpio/dht-sensor-driver';
import { GardenMonitor, GPIO_TAG } from '../garden-monitor';

export interface DHTSensorOptions {
  calibration?: { temperature?: number, humidity?: number };
  readingInterval?: number;
  type?: 11 | 22;
}

export interface DHTSensorValue {
  temperature: number;
  humidity: number;
}

export class DHTSensorDevice {

  value$ = new Subject<DHTSensorValue>();

  protected _pinNumber: number;
  protected _type: 11 | 22;
  protected _calibration: { temperature?: number, humidity?: number };

  constructor(pinNumber: number, options: DHTSensorOptions = {}) {
    const sensorOptions = Object.assign({}, {
      calibration: { temperature: 0, humidity: 0 },
      readingInterval: 60,
      type: 11,
    }, options);

    this._pinNumber = pinNumber;
    this._type = sensorOptions.type;
    this._calibration = sensorOptions.calibration;

    // Read sensor value every 60 seconds
    Observable.interval(sensorOptions.readingInterval * 1000).subscribe(this._getSensorValue);

    // Initial reading (wait for next tick so accessory will be subscribed when initial value is pushed)
    setTimeout(() => { this._getSensorValue(); }, 0);
  }

  private _getSensorValue = () => {
    DHTSensorDriver.read(this._type, this._pinNumber, (error, temperature, humidity) => {
      if (error) {
        GardenMonitor.log(`⚠️  Cannot read DHT sensor value on pin #${this._pinNumber}`, null, [GPIO_TAG]);
        return;
      }

      this.value$.next({
        temperature: temperature + this._calibration.temperature,
        humidity: humidity + this._calibration.humidity,
      });
    });
  }
}