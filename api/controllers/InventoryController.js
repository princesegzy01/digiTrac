var _ = require('lodash');

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
	},
	populateDatasets:  async function(JSONinventory){

		if(JSONinventory.length == 0){
			console.log(">> nothing to scan at the moment")
			return
		}

		// retrieve only epc and timestamp
		filteredData = _.map(JSONinventory, function(object) {
			return _.pick(object, ['epc', 'ts']);
		});

		// order the data by timestamp ascending
		orderdData = _.orderBy(filteredData, ['ts'],['asc']); 
		

		console.log(orderdData)
		// Inventory.find({}).sort('ts DESC')
		// .limit(1)
		// .exec(async function(err, result){
		
		// 	// check if it return empty response
		// 	// then add all the record
		// 	if (result.length == 0){
		// 		await Inventory.createEach(orderdData);
		// 		console.log(">>>>>>>>>> Cron Services Successfully Added")

		// 	}else{
				
		// 		// filter the inventory response and return only tags
		// 		// scanned after the last imestamp stored in the databse
		// 		var sortedData = _.filter(orderdData, function(tag) {	
		// 			// return only tags with timestamp 
		// 			// greater than the last in the database
		// 			return Number(tag.ts) > Number(result[0].ts);
		// 		});
				
		// 		await Inventory.createEach(sortedData);
		// 		console.log(">>>>>>>>>>> Cron service Successfully Updated")
		// 	}
		// });
	},
	inventoryProcessor: async function(req, res){
		res.send("cool")
	}

}