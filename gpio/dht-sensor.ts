import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/interval';

import DHTSensorDriver from '../gpio/dht-sensor-driver';
import { GardenMonitor, GPIO_TAG } from '../garden-monitor';

export interface DHTSensorValue {
  temperature: number;
  humidity: number;
}

export class DHTSensorDevice {

  value$ = new Subject<DHTSensorValue>();

  protected _pinNumber: number;
  protected _type: 11 | 22;

  constructor(pinNumber: number, readingInterval: number = 60, type: 11 | 22 = 11) {
    this._pinNumber = pinNumber;
    this._type = type;

    // Read sensor value every 60 seconds
    Observable.interval(readingInterval * 1000).subscribe(this._getSensorValue);

    // Initial reading
    this._getSensorValue();
  }

  private _getSensorValue = () => {
    DHTSensorDriver.read(this._type, this._pinNumber, (error, temperature, humidity) => {
      if (error) {
        GardenMonitor.log(`⚠️  Cannot read DHT sensor value on pin #${this._pinNumber}`, null, [GPIO_TAG]);
        return;
      }

      this.value$.next({
        temperature,
        humidity,
      });
    });
  }
}