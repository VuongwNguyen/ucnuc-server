const AccountService = require("../services/account.service");
const { successfullyResponse } = require("../util/responseHandle");

class AccountController {
  async create(req, res, next) {
    const { email, password, fullname, phone } = req.body;
    await AccountService.create({
      email,
      password,
      fullname,
      phone,
    });

    next();
  }

  async login(req, res, next) {
    const { email, password } = req.body;
    const login = await AccountService.login({ email, password });

    return new successfullyResponse({
      message: "Login successfully",
      meta: login,
    }).json(res);
  }

  async sendEmail(req, res, next) {
    const { email } = req.body;
    const sendEmail = await AccountService.sendEmail({ email });

    return new successfullyResponse({
      message: sendEmail.message,
    }).json(res);
  }

  async verifyEmail(req, res, next) {
    const { email, otp } = req.body;
    const verifyEmail = await AccountService.verifyEmail({ email, otp });

    return new successfullyResponse({
      message: verifyEmail.message,
    }).json(res);
  }

  async renewToken(req, res, next) {
    const { refreshToken } = req.body;
    const token = await AccountService.renewToken({ refreshToken });

    return new successfullyResponse({
      message: "Token refreshed",
      meta: token,
    }).json(res);
  }
}

module.exports = new AccountController();
