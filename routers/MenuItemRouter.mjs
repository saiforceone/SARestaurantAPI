import BaseRouter from './BaseRouter.mjs';
import MenuItemController from '../controllers/MenuItemController.mjs';

/**
 * @class MenuItemRouter
 * @description Defines a menu item router that extends the functionality of BaseRouter
 */
class MenuItemRouter extends BaseRouter {
  constructor(basePath = '/menu-items') {
    super(basePath);
    this.controller = new MenuItemController();
  }
}

export default MenuItemRouter;