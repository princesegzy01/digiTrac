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
			resObj.product = req.body.product
		}
		
		// // store
		// if(req.body.store !=="all"  && req.body.store !==""){
		// 	resObj.store =  req.body.store
		// }

		// from
		if(req.body.from !=="" && req.body.to !==""){
			resObj.createdAt = { '>=' : req.body.from, '<=' : req.body.to}
		}

		// // console.log(resObj)
		result = await Inventory.find(resObj).sort('createdAt DESC');
		res.status(200).send(result)

	},
	getAll : async function(req, res){
		data = await Inventory.find({}).sort('createdAt DESC')
		res.send(data)
	},
	getDetail : async function(req, res){
		data = await Inventory.find({ product : req.query.product}).sort('createdAt DESC')
		console.log(data)
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

		this.inventoryProcessor(orderdData)
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
	inventoryProcessor: async function(data){
		// data = [
		// 	{
		// 		epc : "4567",
		// 		ts : 1
		// 	},
		// 	{
		// 		epc : "555525",
		// 		ts : 1
		// 	},
		// 	{
		// 		epc : "255654",
		// 		ts : 1
		// 	},
		// 	{
		// 		epc : "588",
		// 		ts : 1
		// 	},
		// 	{
		// 		epc : "456546464647",
		// 		ts : 1
		// 	},
		// ];

		// data = [
		// 	{
		// 		epc : "4567",
		// 		ts : 1
		// 	},
		// 	// {
		// 	// 	epc : "555525",
		// 	// 	ts : 1
		// 	// },
		// 	{
		// 		epc : "255654",
		// 		ts : 1
		// 	},
		// 	{
		// 		epc : "588",
		// 		ts : 1
		// 	},
		// 	{
		// 		epc : "54646464",
		// 		ts : 1
		// 	},
		// 	{
		// 		epc : "846543256",
		// 		ts : 1
		// 	},
		// ];

	
		// return all tags in datbase
		allTags = await Tags.find({
			select: ['product_name', 'tag_number']
		})

		// return only tag number from scanner
		product_epc = [];
		invalid_epc = []
		data.forEach(function (item, index) {
			tagFinder = _.find(allTags, function(o) { return o.tag_number == item.epc; });
			if(!tagFinder){
				// console.log("x is undefined >> ", item.epc)
				invalid_epc.push(item.epc)
			}else{
				
				product_epc.push(tagFinder.product_name)
				// console.log(product_epc)
			}


		})
	

			
		
		// console.log(product_epc)
		// console.log(">>>>>>>>>>")
		// console.log(invalid_epc)
		// console.log(">>>>>>>>>>")

		product_name_epc = product_epc.reduce((b,c)=>((b[b.findIndex(d=>d.product===c)]||b[b.push({product:c,count:0})-1]).count++,b),[]);
		invalid_product_epc = invalid_epc.reduce((b,c)=>((b[b.findIndex(d=>d.product===c)]||b[b.push({product:c,count:0})-1]).count++,b),[]);
		
		// console.log(" << ", product_name_epc)

		// console.log(" << ", invalid_product_epc)

	
		inventoryCount = await Inventory.count();


		console.log(">>>>  Valid Epc : ", product_name_epc.length, "  >>  Invalid Epc : ", invalid_epc.length )

		// check if inventory count is empty
		// add all the scaned prodcut with the count 
		if(inventoryCount === 0){
			console.log("Inventory count is empty")


			// var array = [{ 'a': '12', 'b': '10' }, { 'a': '20', 'b': '22' }];

			// start adding new inventory
			product_name_epc.forEach(function(product) {

				product.previous_stock = 0;
				product.current_stock = product.count;
				product.difference = product.count;
				product.status = 'addition';
				// product.status = 2 - 5 > 0 ? 'subtraction' : 'addition';
			});

			// add the processed inventory to the database
			await Inventory.createEach(product_name_epc);
			console.log(" >>> Done ")

		}else{
			
			inventoryRecord = await Inventory.find({}).sort('createdAt DESC');
			// console.log(inventoryRecord)
			distinct_inventory = inventoryRecord.filter((v,i,a)=>a.findIndex(t=>(t.product === v.product))===i)
			// console.log(distinct_inventory)

			// create New product Array
			newProduct = [];

			// start adding and updating inventory
			product_name_epc.forEach(function(product) {

				// get maching product in inventory
				inventoryFinder = _.find(distinct_inventory, function(inv) { return inv.product == product.product; });
				if(!inventoryFinder){
					// console.log("x is undefined >> ", item.epc)
					// invalid_epc.push(item.epc)


					newProductObject = {}
					newProductObject.product = product.product
					newProductObject.previous_stock = 0;
					newProductObject.current_stock = product.count;
					newProductObject.difference = product.count;
					newProductObject.status = 'addition';
					// console.log(newProductObject)
					newProduct.push(newProductObject)
				}else{
					
					if(product.count !== inventoryFinder.current_stock){

						newStock = {};
						newStock.product = product.product
						newStock.previous_stock = inventoryFinder.current_stock
						newStock.current_stock = product.count
						newStock.difference = inventoryFinder.current_stock - product.count
						newStock.status = inventoryFinder.current_stock > product.count ? 'subtraction' : 'addition';

						newProduct.push(newStock)
					}
					// console.log(product)
				}


				// console.log(inventoryFinder)

				// console.log(" >> ", product.product,  product.count)
				// product.previous_stock = 0;
				// product.current_stock = product.count;
				// product.difference = product.count;
				// product.status = 'addition';
			});


			console.log(newProduct)
			// add the processed inventory to the database
			await Inventory.createEach(newProduct);

		}	

		console.log(inventoryCount)
		// res.send("cool")
		console.log("cool")

	},

	getProductName: function(tag_number, ){

	}
}