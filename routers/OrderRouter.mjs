import mongoose from 'mongoose';
import passport from 'passport';
import BaseRouter from './BaseRouter.mjs';
import OrderController from '../controllers/OrderController.mjs';
import MenuItem from '../models/MenuItem.mjs';
import RestaurantLocation from '../models/RestaurantLocation.mjs';
import UserProfile from '../models/UserProfile.mjs';

import checkActive from '../middleware/checkActive.mjs';
import checkAdmin from '../middleware/checkAdmin.mjs';

const standardMiddlewares = [passport.authenticate('jwt', {session: false}), checkActive, checkAdmin];

/**
 * @class OrderRouter
 * @description Defines an order router that extends the functionality of Base Router and handles all operations related orders
 */
class OrderRouter extends BaseRouter {
  constructor(basePath = '/orders') {
    super(basePath);
    this.controller = new OrderController();
  }

  createResource(middleware = []) {
    return [...middleware, async (req, res) => {
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
    }]
  }

  getRoutes() {
    this.router.route(`${this.basePath}`)
      .post(this.createResource(standardMiddlewares));

    return this.router;
  }
}

export default OrderRouter;