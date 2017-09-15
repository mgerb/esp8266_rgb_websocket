#include "Storage.h"
#include <EEPROM.h>
#include <Arduino.h>

Storage::Storage() {}

void Storage::clear() {
  // erase all eeprom
  EEPROM.begin(512);
  for (int i = 0; i < 512; i++) {
    EEPROM.write(i, 0);
  }
  EEPROM.end();
}

void Storage::storeAll(String input) {

  clear();
  EEPROM.begin(512);

  for (int i = 0; i < input.length(); i++) {
    EEPROM.write(i, input[i]);
  }

  EEPROM.end();
}

String Storage::getAll() {

  EEPROM.begin(512);
  char info[512];

  for (int i = 0; i < 512; i++) {
    char newChar = EEPROM.read(i);
    info[i] = newChar;
  }

  EEPROM.end();

  return String(info);
}
