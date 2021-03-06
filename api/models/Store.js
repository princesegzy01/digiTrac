/**
 * Store.js
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
		name: {
			type: 'string',
			required: true
		},
		location: {
			type: 'string',
			required: true
   	 	},
    	state: {
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

