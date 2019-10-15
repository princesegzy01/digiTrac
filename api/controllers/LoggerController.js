var fs = require("fs");
module.exports = {

	postLog : async function(req, res){


       

        // delete existing log
        try {
            fs.unlinkSync("logger.json")
            console.log("log deleted")
        //file removed
        } catch(err) {
        console.error(err.message)
        }


        var data = req.body;

        console.log(data)
        data =  JSON.stringify(data)

        fs.writeFile("logger.json", data, (err) => {
        if (err) console.log(err);
            console.log("Successfully Written to File.");
            res.send("log written")
        });

    },
    getLog: async function(req, res){
      
        res.download('logger.json');        
    }
}