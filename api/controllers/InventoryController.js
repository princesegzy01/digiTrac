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
		

		// console.log(orderdData)

		this.inventoryProcessor(orderdData)
	},
	inventoryProcessor: async function(data){
		
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
	
		product_name_epc = product_epc.reduce((b,c)=>((b[b.findIndex(d=>d.product===c)]||b[b.push({product:c,count:0})-1]).count++,b),[]);
		invalid_product_epc = invalid_epc.reduce((b,c)=>((b[b.findIndex(d=>d.product===c)]||b[b.push({product:c,count:0})-1]).count++,b),[]);
		
		inventoryCount = await Inventory.count();


		console.log(">>>>  Valid Epc : ", product_name_epc.length, "  >>  Invalid Epc : ", invalid_epc.length )

		// check if inventory count is empty
		// add all the scaned prodcut with the count 
		if(inventoryCount === 0){
			console.log("Inventory count is empty")

			// start adding new inventory
			product_name_epc.forEach(function(product) {

				product.previous_stock = 0;
				product.current_stock = product.count;
				product.difference = product.count;
				product.status = 'addition';
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
						newStock.difference = Math.abs(inventoryFinder.current_stock - product.count)
						newStock.status = inventoryFinder.current_stock > product.count ? 'subtraction' : 'addition';

						newProduct.push(newStock)
					}
					// console.log(product)
				}
			});


			console.log(newProduct)
			// add the processed inventory to the database
			await Inventory.createEach(newProduct);

		}	
	}
}