import passport from 'passport';
import passportLocal from 'passport-local';
import passportJwt from 'passport-jwt';
const {Strategy: JWTstrategy, ExtractJwt: ExtractJWT} = passportJwt;
import jwt from 'jsonwebtoken';
const {sign: jwtSign, verify: jwtVerify} = jwt;

import UserProfile from '../models/UserProfile.mjs';
import config from '../config/index.mjs';

const localStrategy = passportLocal.Strategy;

passport.use(
  'signup',
  new localStrategy(
    {
      usernameField: 'username',
      passwordField: 'password'
    },
    async (username, password, done) => {
      try {
        const user = await UserProfile.create({ username, password });

        return done(null, user);
      } catch (error) {
        done(error);
      }
    }
  )
);

passport.use(
  'login',
  new localStrategy(
    {
      usernameField: 'username',
      passwordField: 'password'
    },
    async (username, password, done) => {
      try {
        const user = await UserProfile.findOne({ username });

        if (!user) {
          return done(null, false, { message: 'Incorrect login credentials' });
        }

        const validate = await user.isValidPassword(password);

        if (!validate) {
          return done(null, false, { message: 'Incorrect login credentials' });
        }

        return done(null, user, { message: 'Logged in Successfully' });
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.use(
  new JWTstrategy(
    {
      secretOrKey: config.secretKey,
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken()
    },
    async (token, done) => {
      try {
        return done(null, token.user);
      } catch (error) {
        done(error);
      }
    }
  )
);