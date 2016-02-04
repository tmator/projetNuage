//la lib qui permet de faire du serie sur des ports classiques
#include <SoftwareSerial.h>
//les ports que l'on va utiliser pour la connexion serie entre l'arduino et le module BT
SoftwareSerial mySerial(4, 2); // RX, TX

//si debug = true on est en mode debug sur le serial
boolean debug=true;

//variable qui recevra les commande du module BT
String command = ""; 

//un string qui dit quelle qualité de l'air on a
String etatAir="";

void setup() {
  //on init le serial pour afficher le debug
  Serial.begin(9600);
  
  //on init le softserial pour la connexion avec le modul bt
  mySerial.begin(9600);

  if (debug)
    Serial.println("Appli air ok");  
    
}

void loop() {

  //on lit sur le port soft serie si il y a qq chose
  if (mySerial.available()) {
    while(mySerial.available()) { // tant qu'il y en a, on lit
      command += (char)mySerial.read();
    }
    


    if (debug)
    {
      //on affiche la commande recu sur le serie pour debug
      Serial.print("cmd : ");
      Serial.println(command);
    }

    //si c'est la commande blink, on met le boola true
    if (command=="bon")
    {
      etatAir="bon";
      
    }
    else if (command=="moyen")
    {
      etatAir="moyen";
    }      
    else if (command=="mauvais")
    {
      etatAir="mauvais";
    }
    command = ""; 
    
    if (debug)
    {
      Serial.print("Variable etatAir : ");   
      Serial.println(etatAir);
     }
   
  }
 

 
}
