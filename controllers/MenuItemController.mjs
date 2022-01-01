import BaseController from "./BaseController.mjs";
import MenuItem from "../models/MenuItem.mjs";

/**
 * @class MenuItemController
 * @extends BaseController
 * @description Defines a menu item controller based on the BaseController
 */
class MenuItemController extends BaseController {
  constructor() {
    super();
    this.model = MenuItem;
  }
}

export default MenuItemController;