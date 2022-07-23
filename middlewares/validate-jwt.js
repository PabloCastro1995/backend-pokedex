const jwt = require("jsonwebtoken");
const TOKEN_SECRET = "TresTristesTigresComenTrigoEnUnTrigal";

const verifyToken = (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) {
    return res.status(401).json({ error: "acceso denegado " });
  }
  try {
    const verified = jwt.verify(token, TOKEN_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).json({ error: "Token invalido" });
  }
};
module.exports = {
  verifyToken,
  TOKEN_SECRET,
};
