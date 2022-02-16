import passport from 'passport';
import jwt from 'jsonwebtoken';
const {sign: jwtSign, verify: jwtVerify} = jwt;

import config from '../config/index.mjs';
import BaseRouter from './BaseRouter.mjs';
import UserProfileController from '../controllers/UserProfileController.mjs';
import checkActive from '../middleware/checkActive.mjs';
import checkAdmin from '../middleware/checkAdmin.mjs';
import checkJWT from '../middleware/checkJWT.mjs';

const standardMiddlewares = [passport.authenticate('jwt', {session: false}), checkActive, checkAdmin];

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

  /**
   * @method authenticateUserLocal
   * @returns [function]
   * @description Handles user login using PassportJS and JWT
   */
  authenticateUserLocal() {
    return [async (req, res, next) => {
      passport.authenticate(
        'login',
        async (err, user, info) => {
          try {
            if (err || !user) {
              console.log('authenticateUserLocal erorr: ', err);
              const error = new Error('An error occurred.');
  
              return next(error);
            }
  
            req.login(
              user,
              { session: false },
              async (error) => {
                if (error) return next(error);
  
                const body = { _id: user._id, username: user.username };
                const token = jwtSign({ user: body }, config.secretKey);
  
                return res.json({ token });
              }
            );
          } catch (error) {
            return next(error);
          }
        }
      )(req, res, next);
    }];
  }

  /**
   * @method registerUserLocal
   * @returns [function]
   * @description Handles user registration using PassportJS
   */
  registerUserLocal() {
    return [passport.authenticate('signup', {session: false}), async (req, res) => {
      const response = this.constructResponse();
      try {
        console.log('signup user with details: ', req.user);
        const body = { _id: req.user._id, username: req.user.username };
        const token = jwtSign({ user: body }, config.secretKey);
        response.data = {token};
        response.httpCode = 201;
        response.success = true;
        return res.status(response.httpCode).json(response);
      } catch (e) {
        response.error = e.toString();
        response.httpCode = 500;
        return res.status(response.httpCode).json(response);
      }
    }];
  }

  /**
   * @method currentUser
   * @description Returns user specific details for the current user account
   * @returns [function]
   */
  currentUser() {
    return [checkJWT, async (req, res) => {
      const response = this.constructResponse();
      try {
        response.data = {profile: req.user};
        response.httpCode = 200;
        response.success = true;
        return res.status(response.httpCode).json(response);
      } catch(e) {
        response.error = e.toString();
        response.httpCode = 500;
        return res.status(response.httpCode).json(response);
      }
    }];
  }

  currentUserAsAdmin() {
    return [checkJWT, checkAdmin, async(req, res) => {
      const response = this.constructResponse();
      response.data = req.user;
      console.log('current user as admin userObj: ', req.user);
      response.httpCode = 200;
      response.success = true;
      return res.status(response.httpCode).json(response);
    }];
  }

  getRoutes() {

    this.router.route(`${this.basePath}/me`)
      .get(this.currentUser());

    this.router.route(`${this.basePath}/adm-check`)
      .get(this.currentUserAsAdmin());

    this.router.route(`${this.basePath}`)
      .get(this.getResources(standardMiddlewares));

    this.router.route(`${this.basePath}/:id`)
      .get(this.getResource(standardMiddlewares))
      .delete(this.deleteResource(standardMiddlewares));

    this.router.route('/auth-local/register')
      .post(this.registerUserLocal());

    this.router.route('/auth-local/login')
      .post(this.authenticateUserLocal());
    
    return this.router;
  }
}

export default UserProfileRouter;