import mongoose from 'mongoose';
import passport from 'passport';
import BaseRouter from './BaseRouter.mjs';
import OrderController from '../controllers/OrderController.mjs';
import MenuItem from '../models/MenuItem.mjs';
import RestaurantLocation from '../models/RestaurantLocation.mjs';
import UserProfile from '../models/UserProfile.mjs';

import checkActive from '../middleware/checkActive.mjs';
import checkAdmin from '../middleware/checkAdmin.mjs';
import checkJWT from '../middleware/checkJWT.mjs';

const standardMiddlewares = [checkJWT, checkActive, checkAdmin];

/**
 * @function getUserById
 * @param {*} userId
 * @returns {*}
 * @description Helper function to retrieve a user profile
 */
const getUserById = async ({userId}) => {
  try {
    return await UserProfile.findById(userId);
  } catch (e) {
    return undefined
  }
};

/**
 * @function getLocationById
 * @param {*} locationId
 * @returns {*}
 * @description Helper function to retrieve a restaurant location
 */
const getLocationById = async ({locationId}) => {
  try {
    return await RestaurantLocation.findById(locationId);
  } catch (e) {
    return undefined;
  }
};

/**
 * @class OrderRouter
 * @description Defines an order router that extends the functionality of Base Router and handles all operations related orders
 */
class OrderRouter extends BaseRouter {
  constructor(basePath = '/orders') {
    super(basePath);
    this.controller = new OrderController();
    this.cachedLocations = {};
    this.cachedUsers = {};
  }

  getOrdersForCurrentUser() {
    return [checkJWT, checkActive, async (req, res) => {
      const response = this.constructResponse();
      try {
        const orders = await this.controller.getItems({
          relatedUser: mongoose.Types.ObjectId(req.user._id),
          ignorePagination: true,
        });

        console.log('orders?: ', orders);

        response.httpCode = 200;
        response.data = orders;
        response.success = true;
        return res.json(response);
      } catch (e) {
        response.error = e.toString();
        response.httpCode = 500;
        return res.status(response.httpCode).json(response);
      }
    }];
  }

  getResources(middleware) {
    return [...middleware, async (req, res) => {
      const response = this.constructResponse();

      try {
        let query = req.query.filter ? String(req.query.filter).trim() : {};
        const queryResults = await this.controller.getItems(query);

        let processedResults = [];
        for (const result of queryResults) {
          // Related Users
          let relatedUser = this.cachedUsers[result.relatedUser];
          if (!relatedUser) {
            const fetchedUser = await getUserById({
              userId: mongoose.Types.ObjectId(result.relatedUser)
            });
            if (fetchedUser) {
              this.cachedUsers[String(fetchedUser._id)] = fetchedUser;
              relatedUser = fetchedUser;
            }
          }

          // Related Locations
          let relatedLocation = this.cachedLocations[result.relatedLocation];
          if (!relatedLocation) {
            const fetchedLocation = await getLocationById({
              locationId: mongoose.Types.ObjectId(result.relatedLocation)
            });
            if (fetchedLocation) {
              this.cachedLocations[String(fetchedLocation._id)] = fetchedLocation;
              relatedLocation = fetchedLocation;
            }
          }
          
          const processedOrderObj = Object.assign(
            {}, result.toJSON(),
            {relatedUser: relatedUser.toJSON()},
            {relatedLocation: relatedLocation.toJSON()}
          );
          processedResults.push(processedOrderObj);
        }

        response.data = processedResults;
        response.httpCode = queryResults.length ? 200 : 404;
        response.success = queryResults.length > 0;
        return res.status(response.httpCode).json(response);

      } catch (e) {
        response.error = e.toString();
        response.httpCode = 500;
        return res.status(response.httpCode).json(response);
      }
      

    }]
  }

  createResource(middleware = []) {
    return [checkJWT, checkActive, async (req, res) => {
      const response = this.constructResponse();

      try {
        const {orderData} = req.body;
        // validate relatedLocation
        const relatedLocation = await RestaurantLocation.findById(orderData['relatedLocation']);

        if (!relatedLocation) {
          response.error = 'invalid order data - location';
          return res.status(response.httpCode).json(response);
        }

        const relatedUser = mongoose.Types.ObjectId(req.user._id);
        
        // validate menu items
        if (!Array.isArray(orderData['orderItems']) || !orderData['orderItems'].length) {
          response.error = 'invalid order data - items';
          return res.status(response.httpCode).json(response);
        }

        // calculate order total
        let orderTotal = 0;
        const orderItems = [];
        const warnings = [];
        for (const itemData of orderData['orderItems']) {
          const item = await MenuItem.findById(itemData['itemRef']);
          console.log('found item: ', item);
          if (!item) {
            warnings.push(`item with reference: ${itemData['itemRef']} does not exist`);
          } else {
            orderTotal += item['baseCost'];
            orderItems.push({
              itemRef: item['_id'],
              itemCost: item['baseCost'],
              itemName: item['itemName']
            });
          }
        }

        const data = Object.assign({}, orderData, {orderItems, orderTotal, orderStatus: 'received', relatedUser});

        response.data = this.controller.create(data);
        response.httpCode = response.data ? 201 : 400;
        response.success = !!response.data;
        return res.status(response.httpCode).json(response);
      } catch(e) {
        console.log(e);
        response.error = e.toString();
        response.httpCode = 500;
        return res.status(response.httpCode).json(response);
      }
    }];
  }

  getRoutes() {

    this.router.route(`${this.basePath}/current-user`)
      .get(this.getOrdersForCurrentUser());

    this.router.route(`${this.basePath}`)
      .get(this.getResources(standardMiddlewares))
      .post(this.createResource(standardMiddlewares));

    this.router.route(`${this.basePath}/:id`)
      .put(this.updateResource(standardMiddlewares));

    return this.router;
  }
}

export default OrderRouter;