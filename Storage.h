#ifndef STORAGE_h
#define STORAGE_h

class Storage {

  public:
    Storage();
    static void writeInfo(char input[]);
    static char* getInfo();
  
  private:
    static void clear();
};

#endif
