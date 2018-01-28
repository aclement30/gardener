import { AccessoryGroup } from '../accessories/accessory-group';

export interface GardenAccessory {
  id: number;
  name: string;
  group?: AccessoryGroup;
  shutdown(callback?: Function): void;
}