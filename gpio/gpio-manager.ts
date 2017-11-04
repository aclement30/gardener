// Only import fake file to generate it during build process
import * as GPIOManagerFake from './gpio-manager.fake';

const isRasberryPi: boolean = require('detect-rpi')();

let GPIOManager;
if (isRasberryPi) {
  GPIOManager = require('rpi-gpio');
} else {
  GPIOManager = require('./gpio-manager.fake');
}

export default GPIOManager;

