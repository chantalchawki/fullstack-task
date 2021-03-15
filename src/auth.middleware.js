const jwt = require("jsonwebtoken");

function authenticate(req, res, next) {
  const header = req.headers["authorization"];
  if (!header) {
    res.status(401);
    return;
  }
  const token = header.split(" ")[1];
  try {
    const decodedToken = jwt.verify(token, "secret");
    req.user = decodedToken;
    next();
  } catch {
    res.status(401);
  }
}

module.exports = authenticate;
