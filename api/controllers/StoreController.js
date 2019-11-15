/**
 * StoreControllerController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  
    add : async function(req, res){

        data = req.body;
        console.log(await Product.find({}));
        return res.send("hello")
    }
};

