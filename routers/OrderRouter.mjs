import BaseRouter from './BaseRouter.mjs';
import OrderController from '../controllers/OrderController.mjs';

/**
 * @class OrderRouter
 * @description Defines an order router that extends the functionality of Base Router and handles all operations related orders
 */
class OrderRouter extends BaseRouter {
  constructor(basePath = '/orders') {
    super(basePath);
    this.controller = new OrderController();
  }
}

export default OrderRouter;