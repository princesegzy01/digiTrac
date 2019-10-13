/**
 * TagController
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

        const data = req.body;
 
        // check if tag is used before
        Tags.find({
            tag_name: data.tag_name,
            tag_number: data.tag_number,
            tag_name: data.tag_name,
        }).exec(function (err, result) {
		  
		  if(result.length > 0) {
			return res.status(200).json({ status : "Tag previously registered"});
          }

          Tags.create(data).exec(function (err, record) {
			  if(err){
				return res.status(200).json({ status : err});
			  }

			  return res.status(200).json({status : "success" })
          })

        });
        // console.log(await Product.find({}));
        // return res.send("hello")
	},
	getAll : async function(req, res){
		data = await Tags.find({})
		// console.log(data)
		res.send(data)
	}
};

