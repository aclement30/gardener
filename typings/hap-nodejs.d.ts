declare module 'hap-nodejs' {
  interface CharacteristicConstructor {
    new (): Characteristic;
  }

  interface ServiceConstructor {
    new (displayName: string, UUID: string): Service;
  }

  export class Accessory {
    constructor(displayName: string, UUID: string);
    addService(service: string|Service|ServiceConstructor): Service;
    getService(name: string|Service|ServiceConstructor): Service;
    addBridgedAccessory(accessory: Accessory, deferUpdate?: boolean): Accessory;
    static Categories: any;
  }

  interface PublicationOptions {
    username: string;
    pincode: string;
    category: number;
    port: number;
  }

  export class Bridge extends Accessory {
    constructor(displayName, serialNumber);
    publish(info: PublicationOptions, allowInsecureRequest?: boolean);
  }

  export class Characteristic {
    on(event: string, listener: Function): any;
    updateValue(newValue: any, callback?: Function, context?: any): Characteristic;

    // Homekit Types
    static Active: CharacteristicConstructor;
    static CurrentPosition: CharacteristicConstructor;
    static CurrentRelativeHumidity: CharacteristicConstructor;
    static CurrentTemperature: CharacteristicConstructor;
    static On: CharacteristicConstructor;
    static PositionState: CharacteristicConstructor;
    static TargetPosition: CharacteristicConstructor;
    static WaterLevel: CharacteristicConstructor;
  }

  export class Service {
    getCharacteristic(name: string|Characteristic|CharacteristicConstructor): Characteristic;
    setCharacteristic(name: string|Characteristic|CharacteristicConstructor, value: any): Characteristic;

    // Homekit Types
    static HumidifierDehumidifier: ServiceConstructor;
    static HumiditySensor: ServiceConstructor;
    static Lightbulb: ServiceConstructor;
    static TemperatureSensor: ServiceConstructor;
    static Window: ServiceConstructor;
  }

  export class uuid {
    static generate(data: string): string;
  }
}