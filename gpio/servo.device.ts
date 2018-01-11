import { OutputDevice } from './output.device';

export class ServoDevice extends OutputDevice {

  // Position: servo orientation (0-180 deg.)
  setPosition(position: number): ServoDevice {
    const pulseWidth = (position * 2000 / 180) + 500;
    this.servoWrite(pulseWidth);
    return this;
  }

  setValue(value: 0|1): ServoDevice {
    throw new Error('ServoDevice.setValue() is not implemented!');
  }
}