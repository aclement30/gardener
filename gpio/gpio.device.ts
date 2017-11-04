import GPIO from '../gpio/gpio-manager';
import { GardenAccessory } from '../models/accessory';
import { GardenMonitor, GPIO_TAG } from '../garden-monitor';

export class GpioDevice {

  protected _gpio: any;
  protected _pinNumber: number;
  protected _accessory: GardenAccessory;

  constructor(pinNumber: number, accessory: GardenAccessory, direction: string) {
    this._gpio = GPIO;
    this._pinNumber = pinNumber;
    this._accessory = accessory;

    this._gpio.setup(this._pinNumber, direction, () => {
      GardenMonitor.warning(`Could not setup GPIO device on pin #${this._pinNumber}`, this._accessory, [GPIO_TAG]);
    });
  }
}