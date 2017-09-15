# Work in progress

- Arduino
- Preact - Typescript
- GoLang

This is a project to control RGB LED lights with the ESP8266.

It will connect to a server via web socket and listen to requests.

The server will serve a small web app, which the user can communicate
to their device and choose the color from a color picker.

Server is intended to be hosted publicly, therefore it's not required
to be on the same network as the ESP8266.

## TODO
- ESP8266
  - ~~local storage~~
  - ~~start access point for configuration~~
  - ~~web socket client~~
  - ~~connect to RGB LED strip~~
  - ~~config web client~~

- server (in progress)
- web client (not started)

## Building
- make sure [yarn](https://yarnpkg.com/en/) is installed
- `make all`

The makefile installs client dependencies and then build it.
It then copies files into `esp8266/data` so they can
be uploaded to the esp8266.

## Flashing
Right now I use the Arduino IDE to flash the esp8266.

[arduino-esp8266fs-plugin](https://github.com/esp8266/arduino-esp8266fs-plugin)
is used to upload client files to flash memory.
