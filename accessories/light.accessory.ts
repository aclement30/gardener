import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import * as HAP from 'hap-nodejs';

import { GardenAccessory } from '../models/accessory';
import { GardenMonitor, ACCESSORY_TAG } from '../garden-monitor';
import { OutputDevice } from '../gpio/output.device';

export const namespace = 'gardener:accessories:light';

export class Light extends HAP.Accessory implements GardenAccessory {

  public name: string;
  public power$: BehaviorSubject<boolean>;

  private _gpioDevice: OutputDevice;
  // Manual override to disable automatic light management
  private _manualOverride = false;
  // Override to keep the light turned OFF (has priority over manual override)
  private _emergencyOverride = false;

  constructor(name: string, pinNumber?: number) {
    super(name, HAP.uuid.generate(`${namespace}:${name}`));

    this.name = name;
    this.power$ = new BehaviorSubject(false);

    this._configureHomekit();

    // Init GPIO device
    this._gpioDevice = new OutputDevice(pinNumber, this).setup((error) => {
      if (error) return;

      this.power$.subscribe((power) => {
        this._gpioDevice.setValue(power);
      });
    });
  }

  setPower(status: boolean, automated: boolean = true, callback?: Function): void {
    // Skip if emergency override is activated
    if (this._emergencyOverride) {
      GardenMonitor.warning(`Emergency override preventing light to be turned ${status ? 'on' : 'off'}`, this, [ACCESSORY_TAG]);

      if (callback) callback(true);
      return;
    }

    // Skip automated change when manual override is activated
    if (automated && this._manualOverride) {
      GardenMonitor.warning(`Manual override preventing light to be turned ${status ? 'on' : 'off'}`, this, [ACCESSORY_TAG]);

      if (callback) callback(true);
      return;
    }

    GardenMonitor.info(`Turning the light ${status ? 'on' : 'off'} (${automated ? 'auto' : 'manual'})`, this, [ACCESSORY_TAG]);

    this.power$.next(status);

    if (callback) callback();
  }

  // Automated function shortcuts

  turnOn(automated: boolean = false) {
    this.setPower(true, automated);
  }

  turnOff(automated: boolean = false) {
    this.setPower(false, automated);
  }

  get isOn(): boolean {
    return this.power$.getValue();
  }

  get hasOverride(): boolean {
    return this._manualOverride || this._emergencyOverride;
  }

  // Immediately shutdown the light and prevent it from turning ON again
  // until the emergency override is disabled
  emergencyShutdown() {
    GardenMonitor.emergency('Emergency shutdown', this);

    this.power$.next(false);
    this._emergencyOverride = true;
  }

  // Disable the emergency override and allow the light to be turned ON again
  disableEmergencyOverride() {
    this._emergencyOverride = false;
  }

  // Configure Homekit accessory
  private _configureHomekit() {
    this
      .addService(HAP.Service.Lightbulb)
      .getCharacteristic(HAP.Characteristic.On)
      .on('set', this._setAccessoryPower);

    this
      .getService(HAP.Service.Lightbulb)
      .getCharacteristic(HAP.Characteristic.On)
      .on('get', this._getAccessoryPower);

    this.power$.subscribe((power) => {
      // Update the characteristic value so interested iOS devices can get notified
      this
        .getService(HAP.Service.Lightbulb)
        .getCharacteristic(HAP.Characteristic.On)
        .updateValue(power);
    });
  }

  // Homekit characteristics get/set
  private _getAccessoryPower = (callback) => {
    callback(null, this.power$.getValue());
  }

  private _setAccessoryPower = (status: boolean, callback?) => {
    // Toggle manual override
    this._manualOverride = !this._manualOverride;

    this.setPower(status, false, callback);
  }
}
