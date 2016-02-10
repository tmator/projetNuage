var app = {
    //constructeur de l'application 
    initialize: function() {
        this.bindEvents();
        deviceListScreen.hidden = true;                      
        airScreen.hidden = true;              
    },
    //quand l'appication est prete, on appele la fonction onDeviceReady
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        
    },
    // fonction appellée quand l'application est prete
    onDeviceReady: function() {
	//on definie les evenements associes aux differentes parties de l'application

	//si on appui sur un periphérique de la liste on apelle la fonction conenct
        deviceList.ontouchstart = app.connect; 

	//si on appuie sur rafraichir on liste les appareil bluetooth
        refreshButton.ontouchstart = app.list;

	//si on appuie sur deconnecter ca appelle la fonction disconnect
        disconnectButton.onclick = app.disconnect;

	//quand on touche le bouton qui correspond on appelle la fonction correspondante
        bon.ontouchstart = app.bon;
        moyen.ontouchstart = app.moyen;
        mauvais.ontouchstart = app.mauvais;


	//on apelle la fonction list qui affiche la liste des periphérique
        app.list();
    },

    //quand on appuie sur bon cette fonction est appelée
    bon: function() {
        app.showProgressIndicator();      
                    
        function success() {
            app.hideProgressIndicator();                          
        }
        
        function failure (reason) {
            alert("Error sending code " + reason);
            app.hideProgressIndicator();                          
        }
              
        //on envoie la commande "bon" via bluetooth" 
        var command = "g\n";
        bluetoothSerial.write(command, success, failure); 
    },  
    moyen: function() {
        app.showProgressIndicator();      
                    
        function success() {
            app.hideProgressIndicator();                          
        }
        
        function failure (reason) {
            alert("Error sending code " + reason);
            app.hideProgressIndicator();                          
        }
              
        //on envoie la commande "moyen" via bluetooth" 
        var command = "m\n";
        bluetoothSerial.write(command, success, failure); 
    },  

    mauvais: function() {
        app.showProgressIndicator();      
                    
        function success() {
            app.hideProgressIndicator();                          
        }
        
        function failure (reason) {
            alert("Error sending code " + reason);
            app.hideProgressIndicator();                          
        }
              
        //on envoie la commande "mauvais" via bluetooth" 
        var command = "b\n";
        bluetoothSerial.write(command, success, failure); 
    },  

    //affiche la liste des peripheriques bluetooth
    list: function(e) { 
        deviceList.innerHTML = ""; //vide la liste
        app.showProgressIndicator("Scan des appareils bluetooth...");        
        bluetoothSerial.list(app.onDeviceList, function() { alert("Listing Bluetooth Devices Failed"); });        
    },

    //connection au périphérique selectionné
    connect: function (e) {        
        var device = e.target.dataset.deviceId;
        app.showProgressIndicator("Connexion à " + device);
        bluetoothSerial.connect(device, app.onConnect, app.onDisconnect);                                    
    },

    //deconnection
    disconnect: function (e) {
        if (e) {
            e.preventDefault();
        }

        app.setStatus("Deconnexion...");
        bluetoothSerial.disconnect(function() {
            app.setStatus("Deconnecté");
            setTimeout(app.list, 800);
        });        
    },

    //que faire quand on est conecté ?, on affiche connecté
    onConnect: function() {        
        app.showUnlockScreen();                
        app.setStatus("Connecté");
        bluetoothSerial.subscribe("\n", app.onData);        
    },

    //que faire quand on est deconnecté ?
    onDisconnect: function(reason) {
        if (!reason) { 
            reason = "Connexion perdue"; 
        } 
        app.setStatus(reason);
        
        app.hideProgressIndicator();        
    },

    //que faire quand des data arrivent via le bt ? (ce ne sera jamais le cas dans cette application)
    onData: function(data) {
        app.setStatus(data);
        app.hideProgressIndicator();        
    },

    //que faire quand on liste les devices ?
    onDeviceList: function(devices) {
        var listItem, rssi;

	//on affiche le "div" de la liste
        app.showDeviceListPage();
       
        //pour chaque peripherique one recupere le nom et l'adresse 
        devices.forEach(function(device) {
            console.log(JSON.stringify(device));
            listItem = document.createElement('li');
            listItem.dataset.deviceId = device.id;
            if (device.rssi) {
                rssi = "RSSI: " + device.rssi + "<br/>";
            } else {
                rssi = "";
            }
            listItem.innerHTML = device.name + "<br/>" + rssi + device.id;
            deviceList.appendChild(listItem);
        });

        if (devices.length === 0) {
            
            if (cordova.platformId === "ios") { // BLE
                app.setStatus("Pas de périphérique.");
            } else { // Android
                app.setStatus("Appairez le périphérique.");
            }

        } else {
            app.setStatus(devices.length + " périphérique trouvé" + (devices.length === 1 ? "." : "s."));
        }
    },

    //message de progression
    showProgressIndicator: function(message) {
        if (!message) { message = "En cours"; }
        scrim.firstElementChild.innerHTML = message;        
        scrim.hidden = false;
        statusDiv.innerHTML = "";        
    },

    //on chache le "div" de progression 
    hideProgressIndicator: function() {
        scrim.hidden = true;        
    },    
    
    showUnlockScreen: function() {
        airScreen.hidden = false;
        deviceListScreen.hidden = true;
        app.hideProgressIndicator();
        statusDiv.innerHTML = "";
    },
    showDeviceListPage: function() {
        airScreen.hidden = true;
        deviceListScreen.hidden = false;
        app.hideProgressIndicator();
        statusDiv.innerHTML = "";
    },
    setStatus: function(message){
        console.log(message);
        statusDiv.innerHTML = message;
    }
    
};
