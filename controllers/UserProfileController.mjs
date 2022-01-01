import BaseController from "./BaseController.mjs";
import UserProfile from "../models/UserProfile.mjs";

/**
 * @class UserProfileController
 * @extends BaseController
 * @description Implements a user profile controller based on BaseController
 */
class UserProfileController extends BaseController {
  constructor() {
    super()
    this.model = UserProfile;
  }
}

export default UserProfileController;