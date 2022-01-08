import UserProfile from "../models/UserProfile.mjs";

export default async (req, res, next) => {
  try {
    const user = await UserProfile.findOne({ username: req.user.username });
    if (!user) return res.status(500).json({error: 'invalid session'});

    if (!user.isEnabled) return res.status(400).json({error: 'invalid account status'});

    next();
  } catch (e) {
    return res.status(500).json({error: e.toString()});
  }
}