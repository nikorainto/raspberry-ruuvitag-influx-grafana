# Raspberry-ruuvitag-influx-grafana

This app is ment to be run on a Raspberry Pi 3. Tested with the full version of Raspbian Stretch.

## Requirements

**Nodejs & NPM =>**
<br />
$ ```update-nodejs-and-nodered```

**Bluetooth enabled and allowed =>**
<br />
$ ```sudo apt-get install libbluetooth-dev```
<br />
$ sudo setcap cap_net_raw+eip \$(eval readlink -f `` `which node` ``)

**Influx and grafana installed and running =>**
<br />
http://blog.centurio.net/2018/10/28/howto-install-influxdb-and-grafana-on-a-raspberry-pi-3/

**Reboot Pi!**

## How to start:

```
npm install
node index.js
```
