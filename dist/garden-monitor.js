"use strict";
exports.__esModule = true;
var sqlite3 = require("sqlite3");
var database_1 = require("./config/database");
var colors = require("colors");
var pad = require("pad");
var database = new sqlite3.Database(database_1["default"].file);
var LOG_TYPE;
(function (LOG_TYPE) {
    LOG_TYPE["START"] = "START";
    LOG_TYPE["STOP"] = "STOP";
    LOG_TYPE["TURN_ON"] = "TURN_ON";
    LOG_TYPE["TURN_OFF"] = "TURN_OFF";
    LOG_TYPE["OPEN"] = "OPEN";
    LOG_TYPE["CLOSE"] = "CLOSE";
    LOG_TYPE["OVERRIDE"] = "OVERRIDE";
    LOG_TYPE["READING"] = "READING";
    LOG_TYPE["HOMEKIT_START"] = "HOMEKIT_START";
    LOG_TYPE["READ_ERROR"] = "READ_ERROR";
    LOG_TYPE["WRITE_ERROR"] = "WRITE_ERROR";
    LOG_TYPE["DB_ERROR"] = "DB_ERROR";
    LOG_TYPE["SETUP_ERROR"] = "SETUP_ERROR";
    LOG_TYPE["SHUTDOWN"] = "SHUTDOWN";
    LOG_TYPE["EMERGENCY_SHUTDOWN"] = "SHUTDOWN";
})(LOG_TYPE = exports.LOG_TYPE || (exports.LOG_TYPE = {}));
;
var GardenMonitor = /** @class */ (function () {
    function GardenMonitor() {
    }
    GardenMonitor.info = function (type, value, accessory, message) {
        if (accessory === void 0) { accessory = null; }
        if (message === void 0) { message = null; }
        GardenMonitor.log(type, value, accessory);
        if (message)
            GardenMonitor.debug(message, accessory);
    };
    GardenMonitor.notice = function (message) {
        GardenMonitor.debug(colors.yellow(message));
    };
    GardenMonitor.announce = function (type, message, callback) {
        GardenMonitor.log(type, null, null, callback);
        var color = 'green';
        if (type === LOG_TYPE.STOP || type === LOG_TYPE.SHUTDOWN) {
            color = 'red';
        }
        GardenMonitor.debug(colors[color](message));
    };
    GardenMonitor.warning = function (type, message, accessory, value) {
        if (accessory === void 0) { accessory = null; }
        if (value === void 0) { value = null; }
        GardenMonitor.log(type, value, accessory);
        GardenMonitor.debug('⚠️  ' + message, accessory);
    };
    GardenMonitor.emergency = function (type, message, accessory, value) {
        if (accessory === void 0) { accessory = null; }
        if (value === void 0) { value = null; }
        GardenMonitor.log(type, value, accessory);
        GardenMonitor.debug('🚨  ' + message, accessory);
    };
    GardenMonitor.registerAccessory = function (alias, callback) {
        database.get('SELECT * FROM accessories WHERE alias = ?', alias, function (error, row) {
            if (row) {
                callback(error, row.id);
            }
            else {
                database.run('INSERT INTO accessories VALUES (null, ?)', [alias], function (error) {
                    if (error) {
                        GardenMonitor.warning(LOG_TYPE.DB_ERROR, "DB registration error for accessory " + alias + ": " + error);
                        callback(true);
                        return;
                    }
                    callback(false, this.lastID);
                });
            }
        });
    };
    GardenMonitor.log = function (type, value, accessory, callback) {
        if (value === void 0) { value = null; }
        if (accessory === void 0) { accessory = null; }
        if (type === LOG_TYPE.DB_ERROR)
            return;
        var date = new Date();
        var timestamp = Math.floor(Date.now() / 1000);
        var datetime = date.toLocaleString();
        database.run('INSERT INTO logs (id, accessory_id, type, value, timestamp, created_at) VALUES (null, ?, ?, ?, ?, ?)', [accessory ? accessory.id : null, type, value, timestamp, datetime], function (error) {
            if (error) {
                GardenMonitor.warning(LOG_TYPE.DB_ERROR, "DB save error: " + error, accessory);
            }
            if (callback)
                callback(error);
        });
    };
    GardenMonitor.closeDatabase = function () {
        try {
            database.close();
        }
        catch (err) {
            // Do nothing if database is already closed
        }
    };
    GardenMonitor.debug = function (message, accessory) {
        if (accessory === void 0) { accessory = null; }
        if (accessory) {
            console.log(pad("[" + accessory.name + "]", 32) + message);
        }
        else {
            console.log("" + message);
        }
    };
    return GardenMonitor;
}());
exports.GardenMonitor = GardenMonitor;
