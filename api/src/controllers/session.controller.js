const Session = require("../lib/models/session.model");
const { parse } = require("cookie");


module.exports.cookie = async (req, res, next) => {
  try {
    const cookieHeader = req.headers.cookie;

    if (!cookieHeader) return next();

    const cookies = parse(cookieHeader);

    const { sessionId } = cookies;

    if (!sessionId) return next();

    const session = await Session.findOne({
      _id: sessionId,
      expiresAt: { $gt: new Date() },
    }).populate("user");

    if (!session) return next();

    req.user = session.user;

    next();
  } catch (error) {
    next(error);
  }
};

module.exports.requireAuth = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      message: "Not authenticated"
    });
  }

  next();
};
