const sqlite3 = require('sqlite3');
const moment = require('moment');
const async = require("async");
const path = require('path');

class DashbordController {
  constructor(app) {
    this.database = new sqlite3.Database(path.resolve(__dirname + '/../db.sqlite3'), sqlite3.OPEN_READONLY);

    app.get('/', this.dashboard.bind(this));
  }

  dashboard(req, res) {
    const range = req.query.range || '24h';

    this.fetchLogs(range, (error, logs) => {
      res.render('dashboard', {
        range,
        logs,
      });
    });
  }

  fetchLogs(range, callback) {
    const period = this.getPeriodForRange(range);

    async.series({
      humidity: (callback) => {
        this.fetchHumidityLogs(period, range, callback);
      },
      temperature: (callback) => {
        this.fetchTemperatureLogs(period, range, callback);
      },
      errors: (callback) => {
        this.fetchErrorLogs(period, callback);
      },
    }, callback);
  }

  fetchHumidityLogs(period, range, callback) {
    this.database.get('SELECT * FROM accessories WHERE alias = ?', 'humidity', (error, row) => {
      this.database.all(
        'SELECT * FROM logs WHERE accessory_id = ? AND timestamp BETWEEN ? AND ?',
        [row.id, period.start.unix(), period.end.unix()],
        (error, rows) => {
          if (error) {
            callback(error);
            return;
          }

          const logs = rows.map((row) => ({
            value: row.value,
            timestamp: row.timestamp,
          }));

          callback(false, this.calculateAverageValues(logs, range));
        }
      );
    });
  }

  fetchTemperatureLogs(period, range, callback) {
    this.database.get('SELECT * FROM accessories WHERE alias = ?', 'temperature', (error, row) => {
      this.database.all(
        'SELECT * FROM logs WHERE accessory_id = ? AND timestamp BETWEEN ? AND ?',
        [row.id, period.start.unix(), period.end.unix()],
        (error, rows) => {
          if (error) {
            callback(error);
            return;
          }

          const logs = rows.map((row) => ({
            value: row.value,
            timestamp: row.timestamp,
          }));

          callback(false, this.calculateAverageValues(logs, range));
        }
      );
    });
  }

  fetchErrorLogs(period, callback) {
    this.database.all(
      'SELECT * FROM logs WHERE (type LIKE \'%_ERROR\' OR type LIKE \'%SHUTDOWN\') AND timestamp BETWEEN ? AND ?',
      [period.start.unix(), period.end.unix()],
      (error, rows) => {
        if (error) {
          callback(error);
          return;
        }

        const logs = rows.map((row) => ({
          type: row.type,
          value: this.getErrorValueForType(row.type),
          description: row.type,
          timestamp: row.timestamp,
        }));

        callback(false, logs);
      }
    );
  }

  getPeriodForRange(range) {
    const today = moment();

    switch(range) {
      case '24h':
        return { start: moment(today).subtract(24, 'hours'), end: today };
      case '7d':
        return { start: moment(today).subtract(1, 'week'), end: today };
      case '30d':
        return { start: moment(today).subtract(1, 'month'), end: today };
      case '3m':
        return { start: moment(today).subtract(3, 'months'), end: today };
      case '6m':
        return { start: moment(today).subtract(6, 'months'), end: today };
    }
  }

  getErrorValueForType(type) {
    switch(type) {
      case 'SETUP_ERROR':
        return 'Initialisation';
      case 'READ_ERROR':
        return 'Lecture';
      case 'WRITE_ERROR':
        return 'Écriture';
      case 'SHUTDOWN':
        return 'Arrêt auto.';
      case 'EMERGENCY_SHUTDOWN':
        return 'Arrêt urgence';
    }
  }

  calculateAverageValues(logs, range) {
    const averageValues = [];
    let currentTime = moment();

    let unitOfTime;
    let intervalCount;

    switch(range) {
      case '24h':
        intervalCount = 24;
        unitOfTime = 'hours';
        break;
      case '7d':
        intervalCount = 7;
        unitOfTime = 'days';
        break;
      case '30d':
        intervalCount = 30;
        unitOfTime = 'days';
        break;
      case '3m':
        intervalCount = 3;
        unitOfTime = 'months';
        break;
      case '6m':
        intervalCount = 6;
        unitOfTime = 'months';
        break;
    }

    for (let i = 1; i <= intervalCount; i++) {
      const periodStart = moment().subtract(i, unitOfTime);
      const values = logs.filter((log) => (log.timestamp >= periodStart.unix() && log.timestamp < currentTime.unix()));
      const average = Math.round(values.reduce((total, current) => (total + current.value), 0) / values.length);

      averageValues.push({
        value: average,
        timestamp: periodStart.unix(),
      });

      currentTime = moment(periodStart);
    }

    return averageValues;
  }
}

module.exports = (app) => { return new DashbordController(app); }