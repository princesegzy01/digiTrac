
var axios = require("axios");
let xmlParser = require('xml2json');

function ScannerUtil() {
  
    this.inventoryRefreshTime = 1000;   //ms
    this.inventoryLoop = null;
    this.isConnected = false;
}


/* 
    Pre: a string
    Post: returns true if the given string is an actual IPv4 or false otherwise
*/
ScannerUtil.prototype.isValidIP = function(IP) {    
    var regexp = /^(\d|[1-9]\d|1\d\d|2([0-4]\d|5[0-5]))\.(\d|[1-9]\d|1\d\d|2([0-4]\d|5[0-5]))\.(\d|[1-9]\d|1\d\d|2([0-4]\d|5[0-5]))\.(\d|[1-9]\d|1\d\d|2([0-4]\d|5[0-5]))$/;
    return regexp.test(IP);
}


/*
    Pre: the IP of the reader we want to start
    Post: sends a GET request and returns the status of the reader after performing the operation
*/
ScannerUtil.prototype.startReader = function(readerIP) {

    
    return new Promise(async (resolve, reject) => {
        try {
            var address = "http://" + readerIP + ":3161/devices/" + this.deviceID + "/start"; 
            var xml = await this.getRequest(address);

            var status = xml.response.status
           
            if (status == "OK") {
                console.log(" <<<>>>> ", "Reader started");
                resolve(status);
            }
            else {
                reject("Could not start the reader properly");
            }
        }
        catch(error) {
            reject(error);
        }
    });
}


/*
    Pre: the IP of the reader we want to stop
    Post: sends a GET request and returns the status of the reader after performing the operation
*/
ScannerUtil.prototype.stopReader = function(readerIP) {
    return new Promise(async (resolve, reject) => {
        try {
            var address = "http://" + readerIP + ":3161/devices/" + this.deviceID + "/stop"; 
            var xml = await this.getRequest(address);
            var status = xml.response.status
            if (status == "OK") 
                resolve(status);
            else
                reject("Could not stop the reader properly");
        }
        catch(error) {
            reject(error);
        }
    });
}


/* 
    Pre: the IP of the reader and the action to perform (start || stop)
    Post: returns a promise with the error if applies
*/
ScannerUtil.prototype.updateReaderStatus = function(readerIP, action) {
    return new Promise(async (resolve, reject) => {    
        try {
            if (action == "start") {
                await this.startReader(readerIP);
            }
            else if (action == "stop") {
                await this.stopReader(readerIP);
            }      
            else if (action == "update") {
                //update the status of the reader but don't display any special message
            }
            else
                reject("unknown operation");
            
            var status = await this.getReaderStatus(readerIP);
            resolve(status);
        }
        catch(error) {
            reject(error);
        }
    });
}


/* 
    Pre: the IP of the reader we want to get the status from
    Post: a promise with the status of the reader or the error
*/
ScannerUtil.prototype.getReaderStatus = function(readerIP) {
    return new Promise(async (resolve, reject) => {
        try {
            var deviceID = await this.getDeviceId(readerIP);
            var address = "http://" + readerIP + ":3161/devices/" + deviceID; 
            var xml = await this.getRequest(address);
            var status = xml.response.data.devices.device.status
            resolve(status);
        }
        catch(error) {
            reject(error);
        }
    });
}



/*
    Pre: the IP of the reader we want to get the RFData from 
    Post: returns a promise with the min power, max power... (RF features) from the reader
    It sends a GET request to: http://host_address:3161/devices/{device-id}/reader
*/
ScannerUtil.prototype.getRFData = function(readerIP) {

    // console.log(readerIP)
    return new Promise(async (resolve, reject) => {
        try {
            var deviceID = await this.getDeviceId(readerIP);
            var address = "http://" + readerIP + ":3161/devices/" + deviceID + "/reader";
            var XMLRFData = await this.getRequest(address);
            resolve(XMLRFData);
        }
        catch(error) {
            reject(error);
        }       
    });
}



/*
    Pre: the IP of the reader we want to get the id from 
    Post: the device ID
    Performs a GET request to get the /devices XML and executes Xpath to find the ID
*/
ScannerUtil.prototype.getDeviceId =  function(readerIP) {
    return new Promise(async (resolve, reject) => {
        try {
            var address = "http://" + readerIP + ":3161/devices";
            var xml = await this.getRequest(address);

            var deviceID = xml.response.data.devices.device.id
            this.deviceID = deviceID;

            resolve(deviceID);
        }
        catch(error) {
            reject(error);
        }
    });
}



/*  
    Pre: the IP of the reader
    Post: an object containing:
        status of the connection: string (connected || notconnected || invalidIP)
        data obtained on the request: null if something went wrong, XML document if everything went OK
    Connect to Keonn reader and obtain the RF data
*/
ScannerUtil.prototype.connectToReader =  function(readerIP) {
    return new Promise(async (resolve, reject) => {
        var connectionResult = 
            { 
                status: null, 
                data: null
            };

        if (readerIP == "" || readerIP == null) {
            connectionResult.status = "emptyIP";
            return resolve(connectionResult);
        }
        if (!this.isValidIP(readerIP)) {
            connectionResult.status = "invalidIP";
            return resolve(connectionResult);
        }
        try {
            var XMLRFData = await this.getRFData(readerIP);
    
            if (typeof XMLRFData === 'string')  {   //something went wrong
                connectionResult.status = "notConnected";
                return resolve(connectionResult);
            }
    
            //at this point, we received the RFData successfully as an XML document
            connectionResult.data = XMLRFData;
            connectionResult.status = "connected";
    
            return resolve(connectionResult);
        }
        catch(error) {
            reject(error);
        }
    });
}

/*
    Pre: the IP of the reader we want to retrieve the inventory (tags being read) from
    Post: array of JSON objects, where each object is a TAG
*/
ScannerUtil.prototype.getInventory = function(readerIP) {
    return new Promise(async (resolve, reject) => {
        try {
            var url = "http://" + readerIP + ":3161/devices/" + this.deviceID + "/jsonMinLocation"; 
            var xml = await this.getRequest(url);

            var status = xml.response.status
           
            if (status == "ERROR") {
                var msg = xml.response.msg
                reject(msg);
            }
            var jsonItems = JSON.parse(xml.response.data.result)
            resolve(jsonItems);
        }
        catch(error) {
            reject(error);
        }
    });
}


/* 
    Pre: an XML and an Xpath expression
    Post: an array containing the values of the XML tags that match the Xpath expression
    Does not work with IE
*/
ScannerUtil.prototype.getXMLTagValue = function(xml, xpath) {

    if (xml.evaluate) {
        var node = xml.evaluate(xpath, xml, null, XPathResult.ANY_TYPE, null);

        if (node != null) {     //node matched the xpath expression
            switch (node.resultType) {
                case XPathResult.STRING_TYPE:
                    return node.stringValue;

                case XPathResult.NUMBER_TYPE:
                    return node.numberValue;

                case XPathResult.BOOLEAN_TYPE:
                    return node.booleanValue; 

                case XPathResult.UNORDERED_NODE_ITERATOR_TYPE:
                    var result = null;
                    var results = [];
                    result = node.iterateNext();
                    while (result) {
                        results.push(result.innerHTML);
                        result = node.iterateNext();
                    }                    
                    return results;
                default: 
                    throw Error("Error retrieving value from XML tag. The result type is unknown");
            }
        }
        return node;    //no nodes matched XPath expression
    }
}

/************ REST API  ************/

/* 
    Pre: an url we want to make the GET request to
    Post: a promise with the XML returned by the GET response or the status of the error
*/
ScannerUtil.prototype.getRequest = function(url) {
    return new Promise((resolve, reject) => {

        // // Make a request for a user with a given ID
        axios.get(url, {}, {
            headers: {
                'Content-Type': 'text/xml',
            }
        }).then(function (response) {
        //  // handle success

            if(response.status == 200){

                jsonResult = xmlParser.toJson(response.data)
                jsonResult = JSON.parse(jsonResult)
                resolve(jsonResult)
            }else{
                console.log(response.status)
                reject(response.status)
            }
        })
        .catch(function (error) {
        // handle error
            // console.log(error);
            // reject(error)
            reject("Network error: cannot perform GET request");
        })
     


    });
}

module.exports = ScannerUtil