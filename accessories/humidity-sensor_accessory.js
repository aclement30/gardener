var Accessory = require('hap-nodejs').Accessory;
var Service = require('hap-nodejs').Service;
var Characteristic = require('hap-nodejs').Characteristic;
var uuid = require('hap-nodejs').uuid;

// here's a fake humidity sensor device that we'll expose to HomeKit
var FAKE_SENSOR = {
  currentHumidity: 50,
  getHumidity: function() { 
    console.log("Getting the current humidity!");
    return FAKE_SENSOR.currentHumidity;
  },
  randomizeHumidity: function() {
    // randomize humidity to a value between 0 and 100
    FAKE_SENSOR.currentHumidity = Math.round(Math.random() * 100);
  }
}


// Generate a consistent UUID for our Temperature Sensor Accessory that will remain the same
// even when restarting our server. We use the `uuid.generate` helper function to create
// a deterministic UUID based on an arbitrary "namespace" and the string "humidity-sensor".
var sensorUUID = uuid.generate('hap-nodejs:accessories:humidity-sensor');

// This is the Accessory that we'll return to HAP-NodeJS that represents our fake lock.
var sensor = exports.accessory = new Accessory('Humidity Sensor', sensorUUID);

// Add properties for publishing (in case we're using Core.js and not BridgedCore.js)
sensor.username = "C1:5D:3A:AE:5E:FA";
sensor.pincode = "031-45-154";

// Add the actual TemperatureSensor Service.
// We can see the complete list of Services and Characteristics in `lib/gen/HomeKitTypes.js`
sensor
  .addService(Service.HumiditySensor)
  .getCharacteristic(Characteristic.CurrentRelativeHumidity)
  .on('get', function(callback) {
    
    // return our current value
    callback(null, FAKE_SENSOR.getHumidity());
  });

// randomize our humidity reading every 3 seconds
setInterval(function() {
  
  FAKE_SENSOR.randomizeHumidity();
  
  // update the characteristic value so interested iOS devices can get notified
  sensor
    .getService(Service.HumiditySensor)
    .setCharacteristic(Characteristic.CurrentRelativeHumidity, FAKE_SENSOR.currentHumidity);
  
}, 3000);
