#include "MyWifi.h"
#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <ArduinoJson.h>

MyWifi::MyWifi() {}

void MyWifi::establishConnection() {

  const char* data = "{\"ssid\":\"foo\",\"password\": \"bar\"}";

  StaticJsonBuffer<200> jsonBuffer;
  JsonObject& root = jsonBuffer.parseObject(data);

  if (!root.success()) {
    // TODO: start access point
    Serial.println("parseObject() failed");
    return;
  }

  // connect to access point
  const char* ssid = root["ssid"];
  const char* password = root["password"];

  // We start by connecting to a WiFi network
  Serial.print("Connecting to ");
  Serial.println(ssid);
  
  WiFi.begin(ssid, password);
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi connected");  
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}
