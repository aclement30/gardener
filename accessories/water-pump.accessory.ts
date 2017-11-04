import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import * as HAP from 'hap-nodejs';
//import * as GPIO from 'pi-gpio';

export const namespace = 'gardener:accessories:water-pump';

export class WaterPump extends HAP.Accessory {

  public name: string;
  public pinNumber: number;
  public power$: BehaviorSubject<boolean>;
  // Override to keep the light turned OFF
  private emergencyOverride = false;

  constructor(name: string, pinNumber?: number) {
    super(name, HAP.uuid.generate(`${namespace}:${name}`));

    this.name = name;
    this.pinNumber = pinNumber;
    this.power$ = new BehaviorSubject(false);

    this._configureAccessory();
  }

  setActive = (status: boolean, callback?) => {
    // Skip if emergency override is activated
    if (this.emergencyOverride) {
      if (callback) callback(true);
    }

    console.log(`[${this.name}] Turning the pump ${status ? 'on' : 'off'}`);

    this.power$.next(status);

    if (callback) callback();
  }

  getActive = (callback) => {
    const active = this.power$.getValue();
    console.log(`[${this.name}] Current status: ${active ? 'on' : 'off'}`);

    callback(null, active);
  }

  turnOn() {
    this.setActive(true);
  }

  turnOff() {
    this.setActive(false);
  }

  // Immediately shutdown the light and prevent it from turning ON again
  // until the emergency override is disabled
  emergencyShutdown() {
    this.turnOff();
    this.emergencyOverride = true;
  }

  // Disable the emergency override and allow the light to be turned ON again
  disableEmergencyOverride() {
    this.emergencyOverride = false;
  }

  get isOn(): boolean {
    return this.power$.getValue();
  }

  // Configure Homekit accessory
  _configureAccessory() {
    this
      .addService(HAP.Service.HumidifierDehumidifier)
      .getCharacteristic(HAP.Characteristic.Active)
      .on('set', this.setActive);

    this
      .getService(HAP.Service.HumidifierDehumidifier)
      .getCharacteristic(HAP.Characteristic.Active)
      .on('get', this.getActive);
  }
}
