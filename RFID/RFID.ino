#include "SPI.h"
#include "MFRC522.h"
#include <EEPROM.h>
#include "ESP8266WiFi.h"
#include "Wire.h"
#define PCF8591 (0x48)
#include <ACROBOTIC_SSD1306.h>

#define SS_PIN 10
#define RST_PIN 9
#define SP_PIN 8
const char* MY_SSID = "";
const char* MY_PWD =  "";
const char WEBSITE[] = "192.168.1.75";


MFRC522 rfid(SS_PIN, RST_PIN);

MFRC522::MIFARE_Key key;

void setup() {
  Serial.print("Connecting to "+*MY_SSID);
  WiFi.begin(MY_SSID, MY_PWD);
  Serial.println("going into wl connect");
  Serial.begin(9600);
  SPI.begin();
  rfid.PCD_Init();
}

void loop() {
  if (!rfid.PICC_IsNewCardPresent() || !rfid.PICC_ReadCardSerial())
    return;

  // Serial.print(F("PICC type: "));
  MFRC522::PICC_Type piccType = rfid.PICC_GetType(rfid.uid.sak);
  // Serial.println(rfid.PICC_GetTypeName(piccType));

  // Check is the PICC of Classic MIFARE type
  if (piccType != MFRC522::PICC_TYPE_MIFARE_MINI &&
    piccType != MFRC522::PICC_TYPE_MIFARE_1K &&
    piccType != MFRC522::PICC_TYPE_MIFARE_4K) {
    Serial.println(F("Your tag is not of type MIFARE Classic."));
    return;
  }

  String strID = "";
  for (byte i = 0; i < 4; i++) {
    strID +=
    (rfid.uid.uidByte[i] < 0x10 ? "0" : "") +
    String(rfid.uid.uidByte[i], HEX) +
    (i!=3 ? ":" : "");
  }
  strID.toUpperCase();

  // เมื่อถึงส่วนนี้ ตัวแปร strID จะเก็บค่า UID ของแท็กไว้แล้ว
  // สามารถนำไปใช้งานได้เลย เช่น นำไปเข้า IF เพื่อให้หลอด
  // LED ติดสว่าง หรือดับได้
  Serial.print("Tap card key: ");
  Serial.println(strID);

  rfid.PICC_HaltA();
  rfid.PCD_StopCrypto1();

  if (client.connect(WEBSITE, 3000)){
    Serial.print("Temp = ");
  Serial.println(String_Temp);
  
  
  
  client.print("POST /User_Time_Stamp/Node3?Data=" + String_Data);
  client.println(" HTTP/1.1"); 
  client.print("Host: ");
  client.println(WEBSITE);
  client.println("User-Agent: ESP8266/1.0");
  client.println("Connection: close");
  client.println();
  } else  Serial.println(client.connect(WEBSITE, 80));

  if (client.connect(WEBSITE, 3000))
  {
}
}
