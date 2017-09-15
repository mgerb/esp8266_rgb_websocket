#include <Arduino.h>
#include <ArduinoJson.h>
#include <ESP8266WebServer.h>
#include <ESP8266WiFi.h>
#include <FS.h>

#include "MyWifi.h"
#include "Storage.h"

ESP8266WebServer server(80);

String getContentType(String filename){
  if(server.hasArg("download")) return "application/octet-stream";
  else if(filename.endsWith(".htm")) return "text/html";
  else if(filename.endsWith(".html")) return "text/html";
  else if(filename.endsWith(".css")) return "text/css";
  else if(filename.endsWith(".js")) return "application/javascript";
  else if(filename.endsWith(".png")) return "image/png";
  else if(filename.endsWith(".gif")) return "image/gif";
  else if(filename.endsWith(".jpg")) return "image/jpeg";
  else if(filename.endsWith(".ico")) return "image/x-icon";
  else if(filename.endsWith(".xml")) return "text/xml";
  else if(filename.endsWith(".pdf")) return "application/x-pdf";
  else if(filename.endsWith(".zip")) return "application/x-zip";
  else if(filename.endsWith(".gz")) return "application/x-gzip";
  return "text/plain";
}

// serve files on not found
void handleNotFound() {
  String uri = server.uri();

  if (SPIFFS.exists(uri)) {
    File file = SPIFFS.open(uri, "r");
    server.streamFile(file, getContentType(uri));
    file.close();
  } else {
    // serve index.html if not exists
    File file = SPIFFS.open("/index.html", "r");
    server.streamFile(file, "text/html");
    file.close();
  }

  server.send(404, "text/html", "File not found.");
}

void handleSubmit() {
  StaticJsonBuffer<512> buffer;
  JsonObject& root = buffer.createObject();

  // create json object with query params
  for (int i = 0; i < server.args(); i++) {
    root[server.argName(i)] = server.arg(i);
  }

  String output;
  root.printTo(output);

  // store in EEPROM
  Storage::storeAll(output);

  server.send (200, "application/json", "Settings updated. Rebooting to connect to access point.");

  delay(1000);
  ESP.restart();
}

void MyWifi::startAccessPoint() {

  SPIFFS.begin();

  Serial.println("Starting access point.");

  WiFi.mode(WIFI_AP);

  WiFi.softAP("RGB Config", "esp12345");

  // register route handlers
  server.on("/submit", handleSubmit);
  server.onNotFound(handleNotFound);

  server.begin();

  int timer = 0;
  while (1) {
    server.handleClient();
    delay(1);
    timer++;

    // restart every 2 minutes and try to reconnect
    if (timer > 120000) {
      Serial.println("Restarting device.");
      ESP.restart();
    }
  }
}

void MyWifi::connect() {
  
  // remove wifi cache
  ESP.eraseConfig();

  StaticJsonBuffer<512> jsonBuffer;
  JsonObject& root = jsonBuffer.parseObject(Storage::getAll());

  if (!root.success() || (!root.containsKey("ssid") || !root.containsKey("password"))) {
    MyWifi::startAccessPoint();
  }

  // connect to access point
  const char* ssid = root["ssid"];
  const char* password = root["password"];

  WiFi.begin(ssid, password);

  while (
    WiFi.status() != WL_CONNECTED &&
    WiFi.status() != WL_CONNECT_FAILED &&
    WiFi.status() != WL_NO_SSID_AVAIL
  ) {
    delay(500);
    Serial.print(".");
  }

  if (WiFi.status() !=  WL_CONNECTED) {
    // start access point
    MyWifi::startAccessPoint();
  }

  WiFi.mode(WIFI_STA);

  Serial.println("Wifi connected.");
}
