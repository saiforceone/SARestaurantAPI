import BaseController from "./BaseController.mjs";
import RestaurantLocation from "../models/RestaurantLocation.mjs";

/**
 * @class RestaurantLocationController
 * @extends BaseController
 * @description Implements a restaurant location controller based on BaseController
 */
class RestaurantLocationController extends BaseController {
  constructor() {
    super();
    this.model = RestaurantLocation;
  }
}

export default RestaurantLocationController;