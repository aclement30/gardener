export interface GardenAccessory {
  id: number;
  name: string;
  shutdown(callback?: Function): void;
}