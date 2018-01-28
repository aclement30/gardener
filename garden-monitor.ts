import * as sqlite3 from 'sqlite3';

import DB_CONFIG from './config/database';
import * as colors from 'colors';
import * as pad from 'pad';
import { GardenAccessory } from './models/accessory';

const database = new sqlite3.Database(DB_CONFIG.file);

export enum LOG_TYPE {
  START = 'START',
  STOP = 'STOP',
  TURN_ON = 'TURN_ON',
  TURN_OFF = 'TURN_OFF',
  OPEN = 'OPEN',
  CLOSE = 'CLOSE',
  OVERRIDE = 'OVERRIDE',
  READING = 'READING',
  HOMEKIT_START = 'HOMEKIT_START',
  READ_ERROR = 'READ_ERROR',
  WRITE_ERROR = 'WRITE_ERROR',
  DB_ERROR = 'DB_ERROR',
  SETUP_ERROR = 'SETUP_ERROR',
  SHUTDOWN = 'SHUTDOWN',
  EMERGENCY_SHUTDOWN = 'SHUTDOWN',
};

export class GardenMonitor {
  static info(type: LOG_TYPE, value: any, accessory: GardenAccessory = null, message: string = null) {
    GardenMonitor.log(type, value, accessory);

    if (message) GardenMonitor.debug(message, accessory);
  }

  static notice(message: string) {
    GardenMonitor.debug(colors.yellow(message));
  }

  static announce(type: LOG_TYPE, message: string, callback?: (error: any) => void) {
    GardenMonitor.log(type, null, null, callback);

    let color = 'green';
    if (type === LOG_TYPE.STOP || type === LOG_TYPE.SHUTDOWN) {
      color = 'red';
    }

    GardenMonitor.debug(colors[color](message));
  }

  static warning(type: LOG_TYPE, message: string, accessory: GardenAccessory = null, value: any = null) {
    GardenMonitor.log(type, value, accessory);
    GardenMonitor.debug('⚠️  ' + message, accessory);
  }

  static emergency(type: LOG_TYPE, message: string, accessory: GardenAccessory = null, value: any = null) {
    GardenMonitor.log(type, value, accessory);
    GardenMonitor.debug('🚨  ' + message, accessory);
  }

  static registerAccessory(alias: string, callback: (error: boolean, id?: number) => void) {
    database.get('SELECT * FROM accessories WHERE alias = ?', alias, (error, row) => {
      if (row) {
        callback(error, row.id);
      } else {
        database.run('INSERT INTO accessories VALUES (null, ?)', [alias], function(error) {
          if (error) {
            GardenMonitor.warning(LOG_TYPE.DB_ERROR, `DB registration error for accessory ${alias}: ${error}`);
            callback(true);
            return;
          }

          callback(false, this.lastID);
        });
      }
    });
  }

  static log(type: LOG_TYPE, value: number = null, accessory: GardenAccessory = null, callback?: (error: any) => void) {
    if (type === LOG_TYPE.DB_ERROR) return;

    const date = new Date();
    const timestamp = Math.floor(Date.now() / 1000);
    const datetime = date.toLocaleString();

    database.run('INSERT INTO logs (id, accessory_id, type, value, timestamp, created_at) VALUES (null, ?, ?, ?, ?, ?)', [accessory ? accessory.id : null, type, value, timestamp, datetime], function(error) {
      if (error) {
        GardenMonitor.warning(LOG_TYPE.DB_ERROR, `DB save error: ${error}`, accessory);
      }

      if (callback) callback(error);
    });
  }

  static closeDatabase() {
    try {
      database.close();
    }
    catch(err) {
      // Do nothing if database is already closed
    }
  }

  static debug(message: string, accessory: GardenAccessory = null) {
    if (accessory) {
      console.log(pad(`[${accessory.name}]`, 32) + message);
    } else {
      console.log(`${message}`);
    }
  }
}