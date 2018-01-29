import { HumiditySensor } from '../accessories/humidity-sensor.accessory';
import { Light } from '../accessories/light.accessory';
import { TemperatureSensor } from '../accessories/temperature-sensor.accessory';
import { DHTSensorDevice } from "../gpio/dht-sensor";
import { AccessoryGroup } from '../accessories/accessory-group';
import { Greenhouse } from '../accessories/greenhouse';

const globalDHTSensorDevice = new DHTSensorDevice(4, {
  readingInterval: 30,
  calibration: {
    humidity: -3,
    temperature: +2,
  }
});

const greenhouseDHTSensorDevice = new DHTSensorDevice(23, {
  readingInterval: 30,
  calibration: {
    humidity: +20,
    temperature: +2,
  }
});

export default {
  'garden': new AccessoryGroup('Jardin', {
    'humidity': new HumiditySensor('Humidité globale', globalDHTSensorDevice),
    'light-top': new Light('Lumière haut', 17),
    'light-bottom': new Light('Lumière bas', 27),
    'temperature': new TemperatureSensor('Température', globalDHTSensorDevice),
  }),
  'greenhouse': new Greenhouse('Miniserre', {
    'humidity': new HumiditySensor('Humidité', greenhouseDHTSensorDevice),
    'temperature': new TemperatureSensor('Température', greenhouseDHTSensorDevice),
    //'moisture-1': new MoistureSensor('Hum. plante 1'),
  }),
};
