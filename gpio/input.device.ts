import { Subject } from 'rxjs/Subject';

import GpioDevice, { IGpioDevice } from './gpio-device';

export class InputDevice extends (GpioDevice as IGpioDevice) {

  value$ = new Subject<any>();

  constructor(pinNumber: number) {
    super(pinNumber, { mode: GpioDevice.INPUT, alert: true });

    this.on('alert', this._onGpioValueChange);
  }

  private _onGpioValueChange = (value: 0|1) => {
    this.value$.next(value);
  }
}