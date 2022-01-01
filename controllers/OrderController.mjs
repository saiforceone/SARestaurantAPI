import BaseController from "./BaseController.mjs";
import Order from "../models/Order.mjs";

/**
 * @class OrderContrller
 * @extends BaseController
 * @description Implements an Order controller that extends BaseController
 */
class OrderController extends BaseController {
  
  constructor() {
    super();
    this.model = Order;
  }
}

export default OrderController;