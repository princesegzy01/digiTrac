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

  '/': { view: 'pages/index',  locals: { layout: 'layouts/account' } },

  '/dashboard': { view: 'pages/dashboard' },

  
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
