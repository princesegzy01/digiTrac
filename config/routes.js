/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` your home page.            *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  //All views

  '/': { view: 'pages/index',  locals: { layout: 'layouts/account' } },
  '/app/dashboard': { view: 'pages/dashboard' },
  'get /app/tags/add': { view: 'pages/tags/add' },
  'get /app/tags/': { view: 'pages/tags/index' },
  'get /app/report/': { view: 'pages/report/index' },
  
  'post /api/logger/add': 'LoggerController.postLog',
  'get /api/logger/': 'LoggerController.getLog',

  'post /api/tags/add': 'TagController.add',
  'get /api/tags/': 'TagController.getAll',

  'post /api/inventory/add': 'InventoryController.add',
  'post /api/inventory/filter': 'InventoryController.getFiltered',

  'get /api/inventory': 'InventoryController.getAll',


  // test logger
  'get /api/testlogger': 'InventoryController.inventoryProcessor',


  
  // 'get /rfid/index': 'ProductController.add',

  //scan product from RFID
  // 'post /scan/add' : '',

  //map tag to a product
  // 'post /tag/add' : '',


  // Get product betweent date
  // 'get /report/' : '',


  //store
  'post /store/add': 'StoreController.add',


  /***************************************************************************
  *                                                                          *
  * More custom routes here...                                               *
  '/': { view: 'pages/homepage' },'/': { view: 'pages/homepage' },* (See https://sailsjs.com/config/routes for examples.)                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the routes in this file, it   *
  * is matched against "shadow routes" (e.g. blueprint routes).  If it does  *
  * not match any of those, it is matched against static assets.             *
  *                                                                          *
  ***************************************************************************/


};
