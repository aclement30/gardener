import { HumiditySensor } from '../accessories/humidity-sensor.accessory';
import { Light } from '../accessories/light.accessory';
import { TemperatureSensor } from '../accessories/temperature-sensor.accessory';
import { DHTSensorDevice } from "../gpio/dht-sensor";

const dhtSensorDevice = new DHTSensorDevice(4, {
  readingInterval: 30,
  calibration: {
    humidity: 0,
    temperature: +2,
  }
});

export default {
  'humidity': new HumiditySensor('Humidité globale', dhtSensorDevice),
  'light-top': new Light('Lumière haut', 11),
  'light-bottom': new Light('Lumière bas', 13),
  'temperature': new TemperatureSensor('Température', dhtSensorDevice),
  //'moisture-1': new MoistureSensor('Hum. plante 1'),
};
