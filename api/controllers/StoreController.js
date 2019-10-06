/**
 * StoreControllerController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  
    add : async function(req, res){

        // console.log(req.body)

        // console.log(await sails.models.Product));

        // if(!){
        //     return res.status(400).json({})
        // }

        data = req.body;
        console.log(await Product.find({}));
        return res.send("hello")
    }
};

