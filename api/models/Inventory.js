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
		tag: {
			type: 'string',
			required: true
		},
		serial: {
			type: 'string',
			required: true
		},
		store: {
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
		},
	}
};

