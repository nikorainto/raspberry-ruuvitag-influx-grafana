/* eslint no-console: 0 */

// Imports
// eslint-disable-next-line import/no-unresolved
const ruuvi = require('node-ruuvitag');
const influxDriver = require('influx');

// RuuviTags UID's
// #1 - f3ba5c98ae5f
// #2 - ea1685a8eace
// #2 - e0a9e5a9e7ae

// My tags
const myTags = ['f3ba5c98ae5f', 'ea1685a8eace', 'e0a9e5a9e7ae'];

// Name of the database
const databaseName = 'ruuvit';

// Try to create the database once at start, if it does not exist
let firstRound = true;

// Make the connection to the database
const influx = new influxDriver.InfluxDB(
  `http://localhost:8086/${databaseName}`,
);

console.log('Collecting sensor data...');

// Collecting data from tags
ruuvi.on('found', tag => {
  console.log(`Found sensor with ID: ${tag.id}`);
  if (myTags.includes(tag.id)) {
    tag.on('updated', data => {
      if (data.accelerationX) {
        try {
          // Assemble the query
          const Query = [
            {
              measurement: tag.id,
              tags: { sensor: tag.id },
              fields: {
                rssi: data.rssi,
                humidity: data.humidity,
                temperature: data.temperature,
                pressure: data.pressure,
                accelerationX: data.accelerationX,
                accelerationY: data.accelerationY,
                accelerationZ: data.accelerationZ,
                battery: data.battery,
              },
            },
          ];

          if (firstRound) {
            // Only try to create the database once, on the first execution
            influx.getDatabaseNames().then(names => {
              if (names.indexOf(databaseName) === -1) {
                influx
                  .createDatabase(databaseName)
                  .then(() =>
                    influx.createRetentionPolicy('one_week', {
                      database: databaseName,
                      duration: '7d',
                      replication: 1,
                      isDefault: true,
                    }),
                  )
                  .then(() => {
                    influx.writePoints(Query).catch(err => err);
                  })
                  .catch(err => err);
              } else {
                influx.writePoints(Query).catch(err => err);
              }
            });
            firstRound = false;
          } else {
            // Else write the query to the database
            influx.writePoints(Query).catch(err => err);
          }
        } catch (e) {
          console.log(e);
        }
      } else {
        console.log(`Please turn RuuviTag ${tag.id} to B -mode`);
      }
    });
  }
});
