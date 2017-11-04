import { Subject } from 'rxjs/Subject';

import GPIO from '../gpio/gpio-manager';
import { GpioDevice } from './gpio.device';
import { GardenAccessory } from '../models/accessory';
import { GardenMonitor, GPIO_TAG } from '../garden-monitor';

export class InputDevice extends GpioDevice {

  value$ = new Subject<any>();

  constructor(pinNumber: number, accessory: GardenAccessory) {
    super(pinNumber, accessory, GPIO.DIR_IN);

    GPIO.on('change', this._onGpioValueChange);
  }

  private _onGpioValueChange = (channel: number, value: any) => {
    if (channel !== this._pinNumber) return;

    GardenMonitor.info(`Value received from pin #${this._pinNumber}: ${value}`, this._accessory, [GPIO_TAG]);

    this.value$.next(value);
  }
}