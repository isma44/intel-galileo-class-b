// Networking Setup for Galileo : Class B

void setup() {
  Serial.begin(9600);

  system("ifconfig eth0 down > /dev/ttyGS0");
  system("ifconfig eht0 up > /dev/ttyGS0");

  system("ifconfig eth0 192.168.0.IP設定 eth0");
  system("route add default gw 192.168.0.1");
  
  // SSHアクセス出来たら、/etc/resolv.confも設定
  // nameserver 192.168.0.1
  
  // Time Setup by NTP (未来には出来ない可能性高い)
  system("rdate -s time.bora.net");
  
  //system("cat /etc/issue > /dev/ttyGS0");
  //system("/etc/init.d/sshd stop > /dev/ttyGS0");
  //system("/etc/init.d/sshd start > /dev/ttyGS0");
}

void loop() {
  system("ifconfig eth0 > /dev/ttyGS0");
  delay(5000);
}
