# Work in progress
This is a project to control RGB LED lights with the ESP8266.

It will connect to a server via web socket and listen to requests.

The server will serve a small web app, which the user can communicate
to their device and choose the color from a color picker.

Server is intended to be hosted publicly, therefore it's not required
to be on the same network as the ESP8266.

## TODO
- ESP8266
  - local storage
  - start access point for configuration
  - web socket client
  - connect to RGB LED strip

- server (in progress)

- web client
