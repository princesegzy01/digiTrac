var InventoryController = require("../controllers/InventoryController")

const Scanner = require('./scanner');
var scanner = new Scanner();
let IP = "154.120.64.178";

const scannerObject = {

    start(){
        //connect to reader
       
        scanner.connectToReader(IP).then(async (res) => {
            // console.log(" >>>>>>>> ",  res)

            if(res.status != "connected"){
                console.log("Scanner not connected at this time")
            }else{
                
                // console.log(" >>>>>>>> ",  res)
                console.log("Scanner is available")

                var scannerStatus = await scanner.getReaderStatus(IP);
                console.log(" Scanner Status : ", scannerStatus)
                if (scannerStatus == "RUNNING"){
                    var JSONinventory = await scanner.getInventory(IP);
                    
                    // console.log(" <<<< ", JSONinventory)
                    InventoryController.populateDatasets(JSONinventory);
                }

                if (scannerStatus == "STOPPED"){

                    setScanner = await scanner.updateReaderStatus(IP, "start");
                    console.log(" <<>>> ", setScanner)

                    if (scannerStatus == "RUNNING"){
                        var JSONinventory = await scanner.getInventory(IP);
                        // console.log(" >>>> ", JSONinventory)
                        InventoryController.populateDatasets(JSONinventory);
                    }else{
                        console.log("Cannot start scanner ")
                    }
                }
                
            }
        }).catch((err) => {
            console.log(" <<<<<<<< ",  err)
        })

    }
}
module.exports = scannerObject

