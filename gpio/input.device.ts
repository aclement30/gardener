import { Subject } from 'rxjs/Subject';

import GPIO from '../gpio/gpio-manager';
import { GpioDevice } from './gpio.device';
import { GardenAccessory } from '../models/accessory';

export class InputDevice extends GpioDevice {

  value$ = new Subject<any>();

  constructor(pinNumber: number, accessory: GardenAccessory) {
    super(pinNumber, accessory, GPIO.DIR_IN);

    this._gpio.on('change', this._onGpioValueChange);
  }

  private _onGpioValueChange = (channel: number, value: any) => {
    if (channel !== this._pinNumber) return;

    this.value$.next(value);
  }
}