import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/combineLatest';

import { AccessoryManager } from '../accessory-manager';

import GREENHOUSES_CONFIG from '../config/greenhouses';
import { Greenhouse } from '../accessories/greenhouse.accessory';
import { SERVO_POSITION } from '../accessories/greenhouse-servo.accessory';

export class GreenhousesController {

  private greenhouses$: Observable<Map<string, Greenhouse>>;

  constructor(private accessoryManager: AccessoryManager) {
    this.greenhouses$ = accessoryManager.getByType(Greenhouse) as Observable<Map<string, Greenhouse>>;

    // Check the climate status on every 3 seconds
    // TODO: Augment the delay
    Observable.interval(3000).combineLatest(this.greenhouses$, (time, greenhouses) => (greenhouses))
      .subscribe(this.handleClimate);
  }

  handleClimate = (greenhouses: Map<string, Greenhouse>): void => {
    greenhouses.forEach((greenhouse: Greenhouse, alias: string) => {
      const humidity = greenhouse.humidity$.getValue();
      const coverState = greenhouse.coverState$.getValue();

      if (humidity > GREENHOUSES_CONFIG[alias].maxHumidity && coverState === SERVO_POSITION.CLOSED) {
        greenhouse.open(true);
      } else if (humidity < GREENHOUSES_CONFIG[alias].minHumidity && coverState === SERVO_POSITION.OPEN) {
        greenhouse.close(true);
      }
    });
  }
}
