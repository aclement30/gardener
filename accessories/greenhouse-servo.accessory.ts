import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import * as HAP from 'hap-nodejs';

import { GardenAccessory } from '../models/accessory';
import { GardenMonitor, LOG_TYPE } from '../garden-monitor';
import { ServoDevice } from '../gpio/servo.device';

export const namespace = 'gardener:accessories:greenhouse-servo';

export const SERVO_POSITION = {
  OPEN: 100,
  CLOSED: 0,
};

export const SERVO_POSITION_STATE = {
  DECREASING: 0,
  INCREASING: 1,
  STOPPED: 2,
};

function getPositionLabel(position: number): string {
  if (position === 100) return 'OPEN';
  if (position === 0) return 'CLOSED';
}

export class GreenhouseServo extends HAP.Accessory implements GardenAccessory {

  public id: number;
  public name: string;
  public currentPosition$: BehaviorSubject<number>;
  public targetPosition$: BehaviorSubject<number>;
  public positionState$: BehaviorSubject<number>;

  private _gpioDevice: ServoDevice;
  // Manual override to disable automatic management
  private _manualOverride = false;
  // Override to keep the servo motor OFF (has priority over manual override)
  private _emergencyOverride = false;

  constructor(name: string, pinNumber: number) {
    super(name, HAP.uuid.generate(`${namespace}:${name}`));

    this.name = name;
    this.currentPosition$ = new BehaviorSubject(SERVO_POSITION.CLOSED);
    this.targetPosition$ = new BehaviorSubject(SERVO_POSITION.CLOSED);
    this.positionState$ = new BehaviorSubject(SERVO_POSITION_STATE.STOPPED);

    this._configureHomekit();

    // Init GPIO device
    this._gpioDevice = new ServoDevice(pinNumber);
    this.targetPosition$.subscribe((position) => {
      this._gpioDevice.setPosition(position === SERVO_POSITION.OPEN ? 90 : 180);

      if (position === SERVO_POSITION.OPEN) {
        this.positionState$.next(SERVO_POSITION_STATE.INCREASING);
      } else {
        this.positionState$.next(SERVO_POSITION_STATE.DECREASING);
      }

      this.positionState$.next(SERVO_POSITION_STATE.STOPPED);
      this.currentPosition$.next(position);
    });
  }

  setPosition(position: number, automated: boolean = true, callback?: Function): void {
    // Skip if emergency override is activated
    if (this._emergencyOverride) {
      GardenMonitor.warning(LOG_TYPE.OVERRIDE, `Emergency override preventing change of servo position to ${getPositionLabel(position)}`, this);

      if (callback) callback(true);
      return;
    }

    // Skip automated change when manual override is activated
    if (automated && this._manualOverride) {
      GardenMonitor.warning(LOG_TYPE.OVERRIDE, `Manual override preventing change of servo position to ${getPositionLabel(position)}`, this);

      if (callback) callback(true);
      return;
    }

    if (this.id) GardenMonitor.info(position === SERVO_POSITION.OPEN ? LOG_TYPE.OPEN : LOG_TYPE.CLOSE, position, this, `Changing servo position to ${getPositionLabel(position)} (${automated ? 'auto' : 'manual'})`);

    this.targetPosition$.next(position);

    if (callback) callback();
  }

  // Automated function shortcuts

  open(automated: boolean = false) {
    this.setPosition(SERVO_POSITION.OPEN, automated);
  }

  close(automated: boolean = false) {
    this.setPosition(SERVO_POSITION.CLOSED, automated);
  }

  get isOpen(): boolean {
    return this.targetPosition$.getValue() === SERVO_POSITION.OPEN;
  }

  get hasOverride(): boolean {
    return this._manualOverride || this._emergencyOverride;
  }

  // Immediately sets the servo in closed position and prevent it from moving again
  // until the emergency override is disabled
  emergencyShutdown() {
    GardenMonitor.emergency(LOG_TYPE.EMERGENCY_SHUTDOWN, 'Emergency shutdown', this);

    this.targetPosition$.next(SERVO_POSITION.CLOSED);
    this._emergencyOverride = true;
  }

  // Disable the emergency override and allow the servo motor to move again
  disableEmergencyOverride() {
    this._emergencyOverride = false;
  }

  shutdown = (callback?: Function): void => {
    this._gpioDevice.setPosition(90);
    this.targetPosition$.next(SERVO_POSITION.CLOSED);
    callback();
  }

  // Configure Homekit accessory
  private _configureHomekit() {
    this
      .addService(HAP.Service.Window)
      .getCharacteristic(HAP.Characteristic.TargetPosition)
      .on('set', this._setAccessoryTargetPosition);

    this
      .getService(HAP.Service.Window)
      .getCharacteristic(HAP.Characteristic.TargetPosition)
      .on('get', this._getAccessoryTargetPosition);

    this
      .getService(HAP.Service.Window)
      .getCharacteristic(HAP.Characteristic.CurrentPosition)
      .on('get', this._getAccessoryCurrentPosition);

    this
      .getService(HAP.Service.Window)
      .getCharacteristic(HAP.Characteristic.PositionState)
      .on('get', this._getAccessoryPositionState);

    this.currentPosition$.subscribe((position) => {
      // Update the characteristic value so interested iOS devices can get notified
      this
        .getService(HAP.Service.Window)
        .getCharacteristic(HAP.Characteristic.CurrentPosition)
        .updateValue(position);
    });

    this.targetPosition$.subscribe((position) => {
      // Update the characteristic value so interested iOS devices can get notified
      this
        .getService(HAP.Service.Window)
        .getCharacteristic(HAP.Characteristic.TargetPosition)
        .updateValue(position);
    });

    this.positionState$.subscribe((positionState) => {
      // Update the characteristic value so interested iOS devices can get notified
      this
        .getService(HAP.Service.Window)
        .getCharacteristic(HAP.Characteristic.PositionState)
        .updateValue(positionState);
    });
  }

  // Homekit characteristics get/set
  private _getAccessoryCurrentPosition = (callback) => {
    callback(null, this.currentPosition$.getValue());
  }

  private _getAccessoryTargetPosition = (callback) => {
    callback(null, this.targetPosition$.getValue());
  }

  private _getAccessoryPositionState = (callback) => {
    callback(null, this.positionState$.getValue());
  }

  private _setAccessoryTargetPosition = (position: number, callback?) => {
    // Toggle manual override
    this._manualOverride = !this._manualOverride;

    this.setPosition(position > 0 ? SERVO_POSITION.OPEN : SERVO_POSITION.CLOSED, false, callback);
  }
}
