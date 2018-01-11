import { HumiditySensor } from '../accessories/humidity-sensor.accessory';
import { Light } from '../accessories/light.accessory';
import { TemperatureSensor } from '../accessories/temperature-sensor.accessory';
import { DHTSensorDevice } from "../gpio/dht-sensor";
import { Greenhouse } from '../accessories/greenhouse.accessory';
import { GreenhouseServo } from '../accessories/greenhouse-servo.accessory';

const globalDHTSensorDevice = new DHTSensorDevice(4, {
  readingInterval: 30,
  calibration: {
    humidity: 0,
    temperature: +2,
  }
});

const greenhouseDHTSensorDevice = new DHTSensorDevice(4, {
  readingInterval: 30,
  calibration: {
    humidity: 0,
    temperature: +2,
  }
});

export default {
  'humidity': new HumiditySensor('Humidité globale', globalDHTSensorDevice),
  'light-top': new Light('Lumière haut', 11),
  'light-bottom': new Light('Lumière bas', 13),
  'temperature': new TemperatureSensor('Température', globalDHTSensorDevice),
  'greenhouse-right': new Greenhouse('Miniserre - Droite', {
    'humidity': new HumiditySensor('Miniserre - Humidité', greenhouseDHTSensorDevice),
    'temperature': new TemperatureSensor('Miniserre - Température', greenhouseDHTSensorDevice),
    'servo': new GreenhouseServo('Miniserre - Servo', null),
  }),
  //'moisture-1': new MoistureSensor('Hum. plante 1'),
};
