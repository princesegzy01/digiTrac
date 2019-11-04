/**
 * Scan.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */


module.exports = {

	attributes: {
		id: { 
			type: 'number', 
			autoIncrement: true
		},
		product: {
			type: 'number',
			required: true
		},
		previous_stock: {
			type: 'number',
			required: true
		},
		current_stock: {
			type: 'number',
			required: true
		},
		status: {
			type: 'string',
			required: true
		},
		store: {
			type: 'string',
			defaultsTo: ''
		},
		createdAt: { 
			type: 'number', 
			autoCreatedAt: true 
		},
		updatedAt: { 
			type: 'number', 
			autoUpdatedAt: true 
		}
	}
};

