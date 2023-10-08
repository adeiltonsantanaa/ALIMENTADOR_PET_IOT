#include <WiFi.h>
#include <PubSubClient.h>
#include <ESP32Servo.h>

#define ssid "Wokwi-GUEST"
#define pass ""

#define BROKER "broker.mqttdashboard.com"
#define TOPICO_ESCRITA "tpc/ade"
#define TOPICO_LEITURA "tpc/adl"
#define PINO_SERVO 15

WiFiClient espClient;
PubSubClient client(espClient);

Servo servo;

void setup_wifi() {
  delay(10);
  Serial.begin(115200);
  Serial.print("Conectando a rede: ");
  Serial.println(ssid);

  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, pass);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi conectado");
  Serial.print("IP: ");
  Serial.println(WiFi.localIP());
}

void reconnect() {
  while (!client.connected()) {
    Serial.println("Conectando ao broker MQTT..");
    String clientId = "iot-aaam-";
    clientId += String(random(0xffff), HEX);
    if (client.connect(clientId.c_str())) {
      Serial.println("Conectado");
      client.subscribe(TOPICO_LEITURA);
    } else {
      delay(5000);
    }
  }
}

void controlarServo(byte *payload, unsigned int length) {
  if (!strncmp((char *)payload, "90", length)) {
    servo.write(90);
  } else if (!strncmp((char *)payload, "180", length)) {
    servo.write(180);
  } else if (!strncmp((char *)payload, "270", length)) {
    servo.write(270);
  } else if (!strncmp((char *)payload, "0", length)) {
    servo.write(0);
  }
}

void verificarPosicaoEPublicar() {
  int posicao = servo.read();
  boolean isAberto = false;

  if (posicao > 3 || posicao < -3) {
    isAberto = true;
  }

  client.publish(TOPICO_ESCRITA, isAberto ? "true" : "false");
}

void callback(char *topic, byte *payload, unsigned int length) {
  Serial.print("Tópico: ");
  Serial.println(topic);

  Serial.print("Mensagem ");
  Serial.println((char *)payload);

  if (!strcmp(topic, TOPICO_LEITURA)) {
    controlarServo(payload, length);
    verificarPosicaoEPublicar();
  }
}

void setup() {
  randomSeed(micros());

  servo.attach(PINO_SERVO, 500, 2400);

  servo.write(0);

  setup_wifi();
  client.setServer(BROKER, 1883);
  client.setCallback(callback);
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();
  delay(1000);
}