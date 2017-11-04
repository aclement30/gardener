const isRasberryPi: boolean = require('detect-rpi')();

let GPIOManager;
if (isRasberryPi) {
  GPIOManager = require('rpi-gpio');
} else {
  GPIOManager = require('./gpio-manager.fake');
}

export default GPIOManager;

