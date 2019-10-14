module.exports = {

	add : async function(req, res){

		const data = req.body;

		let epc = data.epc
		let sku = data.sku
		let serial = data.serial
		let store = data.store

		// check if tag is scanned before
		Inventory.find({
			epc: epc,
			serial: serial,
			tag: sku,
		}).exec(function (err, result) {
	
			if(result.length > 0) {
				return res.status(200).json({ status : "Tag previously scanned"});
			}

			Inventory.create(data).exec(function (err, record) {
				if(err){
					return res.status(200).json({ status : err});
				}

				return res.status(200).json({status : "success" })
			})

		});
	},
	getFiltered: async function(req, res){

		let resObj = {};

		// product
		if(req.body.product !== "all"  && req.body.product !==""){
			resObj.tag = req.body.product
		}
		
		// store
		if(req.body.store !=="all"  && req.body.store !==""){
			resObj.store =  req.body.store
		}

		// from
		if(req.body.from !=="" && req.body.to !==""){
			resObj.createdAt = { '>=' : req.body.from, '<=' : req.body.to}
		}

		// console.log(resObj)
		result = await Inventory.find(resObj);
		// console.log(result)
		res.status(200).send(result)
	},
	getAll : async function(req, res){
		data = await Inventory.find({})
		res.send(data)
	}

}