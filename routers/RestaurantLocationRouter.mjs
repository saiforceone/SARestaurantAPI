import BaseRouter from './BaseRouter.mjs';
import RestaurantLocationController from '../controllers/RestaurantLocationController.mjs';

/**
 * @class RestaurantLocationRouter
 * @extends BaseRouter
 * @description Defines a restaurant location router that extends BaseRouter
 */
class RestaurantLocationRouter extends BaseRouter {
  constructor(basePath = '/restaurant-locations') {
    super(basePath);
    this.controller = new RestaurantLocationController();
  }
}

export default RestaurantLocationRouter;