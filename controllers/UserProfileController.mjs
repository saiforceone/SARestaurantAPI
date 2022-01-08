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

  async remove(resourceId) {
    const result = await this.update(resourceId, {isEnabled: false});
    return result['modifiedCount'] > 0;
  }
}

export default UserProfileController;