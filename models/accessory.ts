export interface GardenAccessory {
  name: string;
  shutdown(callback?: Function): void;
}