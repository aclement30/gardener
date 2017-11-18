import GPIO from '../gpio/gpio-manager';
import { GpioDevice } from './gpio.device';
import { GardenAccessory } from '../models/accessory';
import { GardenMonitor, GPIO_TAG } from '../garden-monitor';

export class OutputDevice extends GpioDevice {

  constructor(pinNumber: number, accessory: GardenAccessory) {
    super(pinNumber, accessory, GPIO.DIR_OUT);
  }

  setValue(value: boolean, callback?: Function): OutputDevice {
    this._gpio.write(this._pinNumber, value, (error) => {
      if (error) {
        GardenMonitor.warning(`Error on pin #${this._pinNumber}: ${error}`, this._accessory, [GPIO_TAG]);
      } else {
        GardenMonitor.info(`Value set on pin #${this._pinNumber}: ${value}`, this._accessory, [GPIO_TAG]);
      }

      if (callback) callback(error);
    });

    return this;
  }
}