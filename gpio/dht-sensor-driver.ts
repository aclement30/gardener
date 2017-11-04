// Only import fake file to generate it during build process
import * as DHTSensorDriverFake from './dht-sensor-driver.fake';

const isRasberryPi: boolean = require('detect-rpi')();

let DHTSensorDriver;
if (isRasberryPi) {
  DHTSensorDriver = require('node-dht-sensor');
} else {
  DHTSensorDriver = require('./dht-sensor-driver.fake');
}

export default DHTSensorDriver;

