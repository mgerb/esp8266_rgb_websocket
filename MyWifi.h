#ifndef WIRELESS_h
#define WIRELESS_h

class MyWifi {

  public:
    MyWifi();
    static char* ssid;
    static char* password;
    static void establishConnection();
    void startAccessPoint();
    bool getCredentials();
    void storeCredentials();
};

#endif
