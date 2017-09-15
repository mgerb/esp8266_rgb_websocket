#include <Arduino.h>

#ifndef STORAGE_h
#define STORAGE_h

class Storage {

  public:
    Storage();
    static void storeAll(String input);
    static String getAll();
    static void clear();
};

#endif
