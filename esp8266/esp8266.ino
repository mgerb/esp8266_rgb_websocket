#include <ESP8266WiFi.h>
#include <ArduinoJson.h>
#include <WebSocketClient.h>

#include "Storage.h"
#include "MyWifi.h"

char host[50];
char path[50] = "/ws/channel/";
int port;

#define REDPIN 13 // pin 7
#define GREENPIN 12 // pin 6
#define BLUEPIN 14 // pin 5

WebSocketClient webSocketClient;
WiFiClient client;

void getDetailsFromStorage() {

  StaticJsonBuffer<512> jsonBuffer;
  JsonObject& root = jsonBuffer.parseObject(Storage::getAll());
  
  if (
    !root.success() ||
    (!root.containsKey("host") ||
    !root.containsKey("deviceId") ||
    !root.containsKey("port"))
  ) {
    Serial.println("Bad json or unknown keys.");
    MyWifi::startAccessPoint();
    return;
  }

  const char* newDeviceId = root["deviceId"];
  const char* newHost = root["host"];
  int newPort = root["port"];

  strcat(path, newDeviceId);
  memcpy(host, newHost, strlen(newHost));
  port = newPort;
}

// connect to web server
void connectToWebServer() {
  client.connect(host, port);
}

// Handshake with the web server
void handshakeWebServer() {
  webSocketClient.path = path;
  webSocketClient.host = host;
  webSocketClient.handshake(client);
  Serial.println("Handshake successful.");
}

void setup() {
  pinMode(REDPIN, OUTPUT);
  pinMode(GREENPIN, OUTPUT);
  pinMode(BLUEPIN, OUTPUT);

  Serial.begin(115200);
  delay(10);

  MyWifi::connect();
  getDetailsFromStorage();
}

void loop() {

  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("Wifi connection lost. Attempting to reconnect.");
    MyWifi::connect();
  }
  
  else if (!client.connected()) {
    Serial.println("Attempting to reconnect to server.");
    // attempt to connect
    connectToWebServer();

    // handshake if connection is valid
    if (client.connected()) {
      handshakeWebServer();
    }
  }
  
  else {

    String data;
    webSocketClient.getData(data);

    if (data.length() > 0) {
      Serial.println(data);
      StaticJsonBuffer<200> jsonBuffer;
      JsonObject& root = jsonBuffer.parseObject(data);
      
      if (!root.success()) {
        Serial.println("Object parse failed.");
      } else {
        //reset pins
        analogWrite(REDPIN, root["red"]);
        analogWrite(BLUEPIN, root["blue"]);
        analogWrite(GREENPIN, root["green"]);
      }
    }
  }  

}
