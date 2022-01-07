import BaseRouter from './BaseRouter.mjs';
import UserProfileController from '../controllers/UserProfileController.mjs';

/**
 * @class UserProfileRouter
 * @extends BaseRouter
 * @description Defines a user profile router that provides user profile related api functions
 */
class UserProfileRouter extends BaseRouter {
  constructor(basePath = '/users') {
    super(basePath);
    this.controller = new UserProfileController();
  }
}

export default UserProfileRouter;