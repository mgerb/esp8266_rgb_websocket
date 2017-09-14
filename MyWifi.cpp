#include <Arduino.h>
#include <ArduinoJson.h>
#include <ESP8266WebServer.h>
#include <ESP8266WiFi.h>

#include "MyWifi.h"
#include "Storage.h"

ESP8266WebServer server(80);

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

MyWifi::MyWifi() {}

void MyWifi::startAccessPoint() {

  Serial.println("Starting access point.");

  WiFi.mode(WIFI_AP);

  WiFi.softAP("RGB Config", "esp12345");

  // register route handlers
  server.on("/submit", handleSubmit);

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
