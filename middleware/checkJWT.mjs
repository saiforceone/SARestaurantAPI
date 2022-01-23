import jwt from 'jsonwebtoken';
import config from "../config/index.mjs";
import UserProfile from '../models/UserProfile.mjs';

export default async (req, res, next) => {
  try {
    const tokenFromHeader = req.headers['authorization'];
    const decoded = jwt.decode(tokenFromHeader, config.secretKey);
    
    if (!decoded) {
      return res.status(401).json({error: 'invalid token'});
    }

    const userProfile = await UserProfile.findById(decoded.user._id);
    if (!userProfile) {
      return res.status(400).json({error: 'Oops, something went horribly wrong'});
    }

    req.user = {_id: userProfile._id, username: userProfile.username, lastLogin: userProfile.lastLogin};
    next();
  } catch (e) {
    return res.status(500).json({error: e.toString()});
  }
}