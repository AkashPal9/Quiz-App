const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");
const errorHandler = require("../utils/errorObject");
const logger = require("../utils/logger");

const userAuth = async (req, res, next) => {
  logger.info("AUTH: USER AUTH MIDDLEWARE CALLED");
  try {
    let token;

    // Read JWT from the 'jwt' cookie
    token = req.cookies.jwt;

    //  console.log("token",req.get('Authorization'))
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    let userData = await User.findOne({
      _id: decoded.userId,
    });
    userData = JSON.parse(JSON.stringify(userData));

    if (!userData) throw errorHandler("Token expired!", "unAuthorized");
    req.user = userData;
    next();
  } catch (error) {
    logger.error(error);
    return next(error);
  }
};

const admin = async(req, res, next) => {
  logger.info("AUTH: ADMIN AUTH MIDDLEWARE CALLED");
  try {
    let token;
    // Read JWT from the 'jwt' cookie
    token = req.cookies.jwt;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    let userData = await User.findOne({
      _id: decoded.userId,
    });
    userData = JSON.parse(JSON.stringify(userData));

    if (!userData) throw errorHandler("Token expired!", "unAuthorized");
    req.user = userData;
    if (req.user && req.user.isAdmin) {
      next();
    } else {
      res.status(401).json({
        message:"Not authorized as an admin"
      });
      throw new Error("Not authorized as an admin");
    }
  } catch (error) {
    logger.error(error);
    return next(error);
  }

};

module.exports = {
  userAuth,
  admin,
};
