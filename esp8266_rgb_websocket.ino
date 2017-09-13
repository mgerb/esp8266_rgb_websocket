#include <ESP8266WiFi.h>
#include <ArduinoJson.h>
#include <WebSocketClient.h>

#include "Storage.h"
#include "MyWifi.h"

char path[] = "/ws/channel/1";
char host[] = "192.168.1.4";

#define REDPIN 13
#define GREENPIN 12
#define BLUEPIN 14

WebSocketClient webSocketClient;
WiFiClient client;

void connectToWebServer() {
  while (!client.connect(host, 5000)) {
    delay(5000);
    Serial.println("Attempting to reconnect...");
  }
}

void handshakeToWebServer() {
  // Handshake with the server
  webSocketClient.path = path;
  webSocketClient.host = host;

  while (!webSocketClient.handshake(client)) {
    Serial.println("Handshake failed.");

    // try to reconnect if disconnect
    if (!client.connected()) {
      connectToWebServer();
    }

    delay(5000);
  }

  Serial.println("Handshake successful");
}

void setup() {

  pinMode(REDPIN, OUTPUT);
  pinMode(GREENPIN, OUTPUT);
  pinMode(BLUEPIN, OUTPUT);

  Serial.begin(115200);
  delay(10);

  MyWifi::establishConnection();

  delay(1000);
  
  connectToWebServer();
  handshakeToWebServer();

}

// TODO: wifi reconnect
void loop() {
  String data;

  if (client.connected()) {
    
    webSocketClient.getData(data);

    if (data.length() > 0) {
      Serial.println(data);
      StaticJsonBuffer<200> jsonBuffer;
      JsonObject& root = jsonBuffer.parseObject(data);
      
      if (!root.success()) {
        Serial.println("parseObject() failed");
      } else {
        //reset pins
        analogWrite(REDPIN, root["red"]);
        analogWrite(BLUEPIN, root["green"]);
        analogWrite(GREENPIN, root["blue"]);
      }
      
    }
    
  } else {
    Serial.println("Client disconnected.");

    // reconnect and handshake
    connectToWebServer();
    handshakeToWebServer();
    delay(1000);
  }
  
}
