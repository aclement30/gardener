export class GpioDeviceFake {
  constructor(pin: number, options) {}

  digitalRead(): number {
    return 1;
  }

  digitalWrite(level: number): GpioDeviceFake {
    return this;
  }

  servoWrite(pulseWidth: number): GpioDeviceFake {
    return this;
  }

  on(eventName: string, callback: Function) {
    callback(1);
  }

  static INPUT   = 'INPUT';
  static OUTPUT  = 'OUTPUT';
}
module.exports = GpioDeviceFake;