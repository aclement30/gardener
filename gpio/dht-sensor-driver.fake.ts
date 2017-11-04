export class DHTSensorFake {
  static read(mode: 11 | 22, pinNumber: number, callback: Function) {
    const temperature = Math.round(Math.random() * 35);
    const humidity = Math.round(Math.random() * 100);

    callback(false, temperature, humidity);
  }
}
module.exports = DHTSensorFake;