import GpioDevice, { IGpioDevice } from './gpio-device';

export class OutputDevice extends (GpioDevice as IGpioDevice) {

  constructor(pinNumber: number) {
    super(pinNumber, { mode: GpioDevice.OUTPUT });
  }

  setValue(value: 0|1|boolean): OutputDevice {
    this.digitalWrite(value);
    return this;
  }
}