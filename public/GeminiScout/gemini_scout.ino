#include "esp_camera.h"
#include <WiFi.h>
#include "esp_timer.h"
#include "img_converters.h"
#include "Arduino.h"
#include "soc/soc.h"           // Disable brownout problems
#include "soc/rtc_cntl_reg.h"  // Disable brownout problems

// --- CONFIGURATION ---
const char* ssid = "YOUR_WIFI_NAME";
const char* password = "YOUR_WIFI_PASSWORD";

// --- PIN DEFINITIONS (AI-Thinker ESP32-CAM) ---
#define PWDN_GPIO_NUM     32
#define RESET_GPIO_NUM    -1
#define XCLK_GPIO_NUM      0
#define SIOD_GPIO_NUM     26
#define SIOC_GPIO_NUM     27
#define Y9_GPIO_NUM       35
#define Y8_GPIO_NUM       34
#define Y7_GPIO_NUM       39
#define Y6_GPIO_NUM       36
#define Y5_GPIO_NUM       21
#define Y4_GPIO_NUM       19
#define Y3_GPIO_NUM       18
#define Y2_GPIO_NUM        5
#define VSYNC_GPIO_NUM    25
#define HREF_GPIO_NUM     23
#define PCLK_GPIO_NUM     22

// --- MOTOR PINS (Connect to L298N) ---
// Note: We use available GPIOs. GPIO 12/13/14/15 are common but check your board.
#define MOTOR_A_1 12 
#define MOTOR_A_2 13
#define MOTOR_B_1 14
#define MOTOR_B_2 15

WiFiServer server(80);

void setup() {
  WRITE_PERI_REG(RTC_CNTL_BROWN_OUT_REG, 0); // Disable brownout detector
  Serial.begin(115200);

  // Motor Setup
  pinMode(MOTOR_A_1, OUTPUT);
  pinMode(MOTOR_A_2, OUTPUT);
  pinMode(MOTOR_B_1, OUTPUT);
  pinMode(MOTOR_B_2, OUTPUT);
  stopMotors();

  // Camera Config
  camera_config_t config;
  config.ledc_channel = LEDC_CHANNEL_0;
  config.ledc_timer = LEDC_TIMER_0;
  config.pin_d0 = Y2_GPIO_NUM;
  config.pin_d1 = Y3_GPIO_NUM;
  config.pin_d2 = Y4_GPIO_NUM;
  config.pin_d3 = Y5_GPIO_NUM;
  config.pin_d4 = Y6_GPIO_NUM;
  config.pin_d5 = Y7_GPIO_NUM;
  config.pin_d6 = Y8_GPIO_NUM;
  config.pin_d7 = Y9_GPIO_NUM;
  config.pin_xclk = XCLK_GPIO_NUM;
  config.pin_pclk = PCLK_GPIO_NUM;
  config.pin_vsync = VSYNC_GPIO_NUM;
  config.pin_href = HREF_GPIO_NUM;
  config.pin_sscb_sda = SIOD_GPIO_NUM;
  config.pin_sscb_scl = SIOC_GPIO_NUM;
  config.pin_pwdn = PWDN_GPIO_NUM;
  config.pin_reset = RESET_GPIO_NUM;
  config.xclk_freq_hz = 20000000;
  config.pixel_format = PIXFORMAT_JPEG;
  config.frame_size = FRAMESIZE_QVGA; // Lower res for faster streaming
  config.jpeg_quality = 12;
  config.fb_count = 1;

  if (esp_camera_init(&config) != ESP_OK) {
    Serial.println("Camera init failed");
    return;
  }

  // WiFi Connect
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.print("Stream Ready! Go to: http://");
  Serial.println(WiFi.localIP());

  server.begin();
}

void loop() {
  WiFiClient client = server.available();
  if (client) {
    String req = client.readStringUntil('\r');
    client.flush();

    // 1. Handle Video Stream
    if (req.indexOf("GET /stream") != -1) {
       client.println("HTTP/1.1 200 OK");
       client.println("Content-Type: multipart/x-mixed-replace; boundary=frame");
       client.println("");
       while (client.connected()) {
         camera_fb_t * fb = esp_camera_fb_get();
         if (!fb) continue;
         client.println("--frame");
         client.println("Content-Type: image/jpeg");
         client.println("");
         client.write(fb->buf, fb->len);
         client.println("");
         esp_camera_fb_return(fb);
       }
    } 
    // 2. Handle Motor Commands
    else if (req.indexOf("GET /action") != -1) {
      // Parse command: /action?go=FORWARD
      if (req.indexOf("go=FORWARD") != -1) moveForward();
      else if (req.indexOf("go=LEFT") != -1) turnLeft();
      else if (req.indexOf("go=RIGHT") != -1) turnRight();
      else if (req.indexOf("go=BACK") != -1) moveBack();
      else if (req.indexOf("go=STOP") != -1) stopMotors();
      
      client.println("HTTP/1.1 200 OK");
      client.println("Content-Type: text/plain");
      client.println("");
      client.println("OK");
    }
    client.stop();
  }
}

// --- MOVEMENT FUNCTIONS ---
void moveForward() {
  digitalWrite(MOTOR_A_1, HIGH); digitalWrite(MOTOR_A_2, LOW);
  digitalWrite(MOTOR_B_1, HIGH); digitalWrite(MOTOR_B_2, LOW);
}
void moveBack() {
  digitalWrite(MOTOR_A_1, LOW); digitalWrite(MOTOR_A_2, HIGH);
  digitalWrite(MOTOR_B_1, LOW); digitalWrite(MOTOR_B_2, HIGH);
}
void turnLeft() {
  digitalWrite(MOTOR_A_1, LOW); digitalWrite(MOTOR_A_2, HIGH); // Reverse A
  digitalWrite(MOTOR_B_1, HIGH); digitalWrite(MOTOR_B_2, LOW); // Forward B
}
void turnRight() {
  digitalWrite(MOTOR_A_1, HIGH); digitalWrite(MOTOR_A_2, LOW); // Forward A
  digitalWrite(MOTOR_B_1, LOW); digitalWrite(MOTOR_B_2, HIGH); // Reverse B
}
void stopMotors() {
  digitalWrite(MOTOR_A_1, LOW); digitalWrite(MOTOR_A_2, LOW);
  digitalWrite(MOTOR_B_1, LOW); digitalWrite(MOTOR_B_2, LOW);
}