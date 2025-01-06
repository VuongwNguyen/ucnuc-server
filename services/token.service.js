const jwt = require("jsonwebtoken");
require("dotenv").config();

class TokenService {
  async generateToken(payload) {
    console.log(payload);
    const refreshToken = jwt.sign(payload, process.env.REFRESH_JWT_SECRET, {
      expiresIn: "7d",
    });

    const accessToken = jwt.sign(payload, process.env.ACCESS_JWT_SECRET, {
      expiresIn: "15m",
    });

    console.log(accessToken, refreshToken);

    return { accessToken, refreshToken };
  }
}

module.exports = new TokenService();
