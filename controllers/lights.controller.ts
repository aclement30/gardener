import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/combineLatest';
import 'rxjs/add/operator/take';

import { AccessoryManager } from '../accessory-manager';
import { Light } from '../accessories/light.accessory';

import LIGHTS_CONFIG from '../config/lights';

export class LightsController {

  private lights$: Observable<Map<string, Light>>;

  constructor(private accessoryManager: AccessoryManager) {
    this.lights$ = accessoryManager.getByType(Light) as Observable<Map<string, Light>>;

    // Initial setup
    this.lights$.take(1).subscribe(this.handleLights);

    // Check the status of the lights on every minute
    Observable.interval(60000).combineLatest(this.lights$, (time, lights) => (lights))
      .subscribe(this.handleLights);
  }

  handleLights = (lights: Map<string, Light>): void => {
    const currentTime = new Date();
    const lightingUpTime = this._toDateTime(LIGHTS_CONFIG.lightingUpTime);
    const lightingDownTime = this._toDateTime(LIGHTS_CONFIG.lightingDownTime);

    if (currentTime >= lightingUpTime && currentTime < lightingDownTime) {
      lights.forEach((light: Light) => {
        if (!light.isOn && !light.hasOverride) light.turnOn(true);
      });
    } else {
      lights.forEach((light: Light) => {
        if (light.isOn && !light.hasOverride) light.turnOff(false);
      });
    }
  }

  private _toDateTime(time: string): Date {
    const today = new Date();
    const splitTime = time.split(':');

    return new Date(today.getFullYear(), today.getMonth(), today.getDate(), +splitTime[0], +splitTime[1]);
  }
}
