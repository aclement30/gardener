import GPIO from '../gpio/gpio-manager';
import { GpioDevice } from './gpio.device';
import { GardenAccessory } from '../models/accessory';
import { GardenMonitor, GPIO_TAG } from '../garden-monitor';

export class OutputDevice extends GpioDevice {

  constructor(pinNumber: number, accessory: GardenAccessory) {
    super(pinNumber, accessory, GPIO.DIR_OUT);
  }

  setValue(value: boolean, callback?: Function): void {
    GPIO.write(this._pinNumber, value, callback);

    GardenMonitor.info(`Value set on pin #${this._pinNumber}: ${value}`, this._accessory, [GPIO_TAG]);
  }
}