
void setup() {
  Serial.begin(9600);

  system("ifconfig eth0 down > /dev/ttyGS0");
  system("ifconfig eht0 up > /dev/ttyGS0");

  system("ifconfig eth0 192.168.0.18 eth0");
  
  //system("cat /etc/issue > /dev/ttyGS0");
  //system("/etc/init.d/sshd stop > /dev/ttyGS0");
  //system("/etc/init.d/sshd start > /dev/ttyGS0");
}

void loop() {
  system("ifconfig eth0 > /dev/ttyGS0");
  delay(5000);
}
