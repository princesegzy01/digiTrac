/**
 * Tags.js
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
		product_serial: {
			type: 'string',
			required: true
		},
		tag_number: {
			type: 'string',
			required: true
		},
		product_name: {
			type: 'string',
			required: true
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

