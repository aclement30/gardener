import { HumiditySensor } from '../accessories/humidity-sensor.accessory';
import { Light } from '../accessories/light.accessory';
import { TemperatureSensor } from '../accessories/temperature-sensor.accessory';
import { DHTSensorDevice } from "../gpio/dht-sensor";
import { Greenhouse } from '../accessories/greenhouse.accessory';
import { GreenhouseServo } from '../accessories/greenhouse-servo.accessory';

// const globalDHTSensorDevice = new DHTSensorDevice(4, {
//   readingInterval: 30,
//   calibration: {
//     humidity: 0,
//     temperature: +2,
//   }
// });

const greenhouseRightDHTSensorDevice = new DHTSensorDevice(4, {
  readingInterval: 30,
  calibration: {
    humidity: 0,
    temperature: +2,
  }
});

const greenhouseCenterDHTSensorDevice = new DHTSensorDevice(14, {
  readingInterval: 30,
  calibration: {
    humidity: 0,
    temperature: +2,
  }
});

export default {
  //'humidity': new HumiditySensor('Humidité globale', globalDHTSensorDevice),
  'light-top': new Light('Lumière haut', 11),
  'light-bottom': new Light('Lumière bas', 13),
  //'temperature': new TemperatureSensor('Température', globalDHTSensorDevice),
  'greenhouse-right': new Greenhouse('Miniserre - Droite', {
    'humidity': new HumiditySensor('MS. D. - Humidité', greenhouseRightDHTSensorDevice),
    'temperature': new TemperatureSensor('MS. D. - Température', greenhouseRightDHTSensorDevice),
    //'servo': new GreenhouseServo('Miniserre - Servo', null),
  }),
  'greenhouse-center': new Greenhouse('Miniserre - Centre', {
    'humidity': new HumiditySensor('MS. C. - Humidité', greenhouseCenterDHTSensorDevice),
    'temperature': new TemperatureSensor('MS. C. - Température', greenhouseCenterDHTSensorDevice),
    //'servo': new GreenhouseServo('Miniserre - Servo', null),
  }),
  //'moisture-1': new MoistureSensor('Hum. plante 1'),
};
