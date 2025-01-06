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

  async sendEmail(req, res, next) {
    const { email } = req.body;
    const sendEmail = await AccountService.sendEmail({ email });

    if (sendEmail)
      return new successfullyResponse({
        message: sendEmail.message,
      }).json(res);
  }

  async verifyEmail(req, res, next) {
    const { email, otp } = req.body;
    const verifyEmail = await AccountService.verifyEmail({ email, otp });

    if (verifyEmail)
      return new successfullyResponse({
        message: "Email verified successfully",
        meta: verifyEmail,
      }).json(res);
  }
}

module.exports = new AccountController();
