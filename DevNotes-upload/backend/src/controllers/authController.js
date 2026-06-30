import User from '../models/User.js';
import { verifyGoogleToken } from '../config/firebase.js';
import { generateToken } from '../utils/generateToken.js';

/**
 * POST /api/auth/google
 * Verify a Firebase Google ID token, upsert the user, and return an app JWT.
 */
export const googleAuth = async (req, res, next) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      res.status(400);
      throw new Error('idToken is required');
    }

    const decoded = await verifyGoogleToken(idToken);
    const { uid, email, name, picture } = decoded;

    if (!email) {
      res.status(400);
      throw new Error('Google account did not return an email');
    }

    let user = await User.findOne({ firebaseUid: uid });

    if (!user) {
      // Handle accounts that may exist by email (e.g. re-linking)
      user = await User.findOne({ email });
      if (user) {
        user.firebaseUid = uid;
        if (picture) user.avatar = picture;
        await user.save();
      } else {
        user = await User.create({
          firebaseUid: uid,
          email,
          name: name || email.split('@')[0],
          avatar: picture || '',
        });
      }
    }

    const token = generateToken(user._id);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        categories: user.categories,
      },
    });
  } catch (error) {
    if (res.statusCode === 200) res.status(401);
    next(error);
  }
};

/**
 * GET /api/auth/me
 * Return the currently authenticated user's profile.
 */
export const getMe = async (req, res) => {
  const user = req.user;
  res.json({
    id: user._id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    categories: user.categories,
    createdAt: user.createdAt,
  });
};

/**
 * PUT /api/auth/categories
 * Replace the authenticated user's category list.
 */
export const updateCategories = async (req, res, next) => {
  try {
    const { categories } = req.body;
    if (!Array.isArray(categories)) {
      res.status(400);
      throw new Error('categories must be an array of strings');
    }

    const cleaned = [...new Set(categories.map((c) => String(c).trim()).filter(Boolean))];
    req.user.categories = cleaned;
    await req.user.save();

    res.json({ categories: req.user.categories });
  } catch (error) {
    next(error);
  }
};
