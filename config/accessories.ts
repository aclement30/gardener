import { HumiditySensor } from '../accessories/humidity-sensor.accessory';
import { Light } from '../accessories/light.accessory';
import { TemperatureSensor } from '../accessories/temperature-sensor.accessory';
import { MoistureSensor } from '../accessories/moisture-sensor.accessory';
import { DHTSensorDevice } from "../gpio/dht-sensor";

const dhtSensorDevice = new DHTSensorDevice(4, 30);

export default {
  'humidity': new HumiditySensor('Humidité globale', dhtSensorDevice),
  'light-top': new Light('Lumière haut', 11),
  'light-middle': new Light('Lumière milieu', 13),
  'light-nursery': new Light('Lumière pouponnière', 15),
  'temperature': new TemperatureSensor('Température', dhtSensorDevice),
  //'moisture-1': new MoistureSensor('Hum. plante 1'),
};
