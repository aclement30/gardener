import { EventEmitter } from 'events';

const channelValues = new Map<number, boolean>();
const eventEmitter = new EventEmitter();

export class GpioManagerFake {
  static setup(channel: number, direction?: string, edge?: string, onSetup?: Function) {
    if (onSetup) {
      onSetup();
    }
  }

  static write(channel: number, value: boolean, cb?: Function) {
    channelValues.set(channel, value);

    eventEmitter.emit('change', channel, value);

    if (cb) {
      cb();
    }
  }

  static read(channel: number, cb: Function) {
    const value = channelValues.get(channel);
    cb(false, value);
  }

  static on(event: string, listener: (...args: any[]) => void) {
    eventEmitter.addListener(event, listener);
  }

  static destroy(cb?: Function) {
    channelValues.clear();
    eventEmitter.removeAllListeners();

    if (cb) {
      cb();
    }
  }

  static DIR_IN   = 'in';
  static DIR_OUT  = 'out';
  static DIR_LOW  = 'low';
  static DIR_HIGH = 'high';

  static MODE_RPI = 'mode_rpi';
  static MODE_BCM = 'mode_bcm';

  static EDGE_NONE    = 'none';
  static EDGE_RISING  = 'rising';
  static EDGE_FALLING = 'falling';
  static EDGE_BOTH    = 'both';
}
module.exports = GpioManagerFake;