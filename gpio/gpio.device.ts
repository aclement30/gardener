import GPIO from '../gpio/gpio-manager';
import { GardenAccessory } from '../models/accessory';
import { GardenMonitor, GPIO_TAG } from '../garden-monitor';

export class GpioDevice {

  protected _gpio: any;
  protected _pinNumber: number;
  protected _accessory: GardenAccessory;
  protected _direction: string;

  constructor(pinNumber: number, accessory: GardenAccessory, direction: string) {
    this._gpio = GPIO;
    this._pinNumber = pinNumber;
    this._accessory = accessory;
    this._direction = direction;
  }

  setup(callback: Function): any {
    GPIO.setup(this._pinNumber, this._direction, (error) => {
      if (error) {
        GardenMonitor.warning(`Could not setup GPIO device on pin #${this._pinNumber}: ${error}`, this._accessory, [GPIO_TAG]);
      }

      callback(error);
    });

    return this;
  }
}