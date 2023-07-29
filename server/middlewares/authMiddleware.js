const jwt = require("jsonwebtoken");

module.exports = async function (req, res, next) {
  try {
    const token = req.header("authorization").replace("Bearer ", "");
    const decrypteddData = jwt.verify(token, process.env.jwt_secret);
    req.body.userId = decrypteddData.userId;
    next();
  } catch (error) {
    return res.send({
      success: false,
      message: error.message,
    });
  }
};
