// Only import fake file to generate it during build process
import * as GPIODeviceFake from './gpio-device.fake';

const isRasberryPi: boolean = require('detect-rpi')();

let GpioDevice;
if (isRasberryPi) {
  GpioDevice = require('pigpio').Gpio;
} else {
  GpioDevice = require('./gpio-device.fake');
}

export default GpioDevice;

export interface IGpioDevice {
  new (pin: number, options: any): IGpioDevice;
  digitalRead(): number;
  digitalWrite(level: 0|1|boolean): IGpioDevice;
  servoWrite(pulseWidth: number): IGpioDevice;
  on(eventName: string, callback: Function);
}