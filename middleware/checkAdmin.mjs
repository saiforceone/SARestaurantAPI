import UserProfile from "../models/UserProfile.mjs"

export default async (req, res, next) => {
  try {
    const user = await UserProfile.findOne({username: req.user.username});
    if (!user) {
      return res.status(400).json({error: 'invalid session'});
    }

    const userHasRole = user.userRoles.includes('admin');
    if (!userHasRole) return res.status(401).json({error: 'unauthorized'});

    next();
  } catch (e) {
    return res.status(500).json({error: e.toString()});
  }
}