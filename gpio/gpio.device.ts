import GPIO from '../gpio/gpio-manager';
import { GardenAccessory } from '../models/accessory';
import { GardenMonitor, GPIO_TAG } from '../garden-monitor';

export class GpioDevice {

  protected _pinNumber: number;
  protected _accessory: GardenAccessory;

  constructor(pinNumber: number, accessory: GardenAccessory, direction: string) {
    this._pinNumber = pinNumber;
    this._accessory = accessory;

    GPIO.setup(this._pinNumber, direction, () => {
      GardenMonitor.warning(`Could not setup GPIO device on pin #${this._pinNumber}`, this._accessory, [GPIO_TAG]);
    });
  }
}