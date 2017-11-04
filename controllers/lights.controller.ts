import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/combineLatest';

import { AccessoryManager } from '../accessory-manager';
import { Light } from '../accessories/light.accessory';

import LIGHTS_CONFIG from '../config/lights';

export class LightsController {

  private lights$: Observable<Map<string, Light>>;

  constructor(private accessoryManager: AccessoryManager) {
    this.lights$ = accessoryManager.getByType(Light) as Observable<Map<string, Light>>;

    // Check the status of the lights on every 3 seconds
    Observable.interval(3000).combineLatest(this.lights$, (time, lights) => (lights))
      .subscribe(this.handleLights);
  }

  handleLights = (lights: Map<string, Light>): void => {
    const currentTime = this._getCurrentTime();

    if (currentTime >= LIGHTS_CONFIG.lightingUpTime) {
      //console.log('TURNING LIGHTS ON');

      lights.forEach((light: Light) => {
        if (!light.isOn && !light.hasOverride) light.turnOn(true);
      });
    } else if (currentTime >= LIGHTS_CONFIG.lightingDownTime || currentTime < LIGHTS_CONFIG.lightingUpTime) {
      //console.log('TURNING LIGHTS OFF');

      lights.forEach((light: Light) => {
        if (light.isOn && !light.hasOverride) light.turnOff(false);
      });
    }
  }

  private _getCurrentTime(): string {
    const date = new Date();
    return date.toTimeString().substr(0, 5)
  }
}
