const { Account } = require("../models");
const { errorResponse } = require("../util/responseHandle");
const TokenService = require("./token.service");
const StoreOTP = require("../util/storeOTP");
const { sendMail, emailTemplate } = require("../util/mailer");

const verifyEmail = new StoreOTP();
const resetPassword = new StoreOTP();

class AccountService {
  async create({ email, password, fullname, phone }) {
    if (!email || !password || !fullname)
      throw new errorResponse({
        message: "Please provide email, password and fullname",
        statusCode: 400,
      });

    // Check if email is already in use
    const emailExist = await Account.findOne({ where: { email } });

    if (emailExist)
      throw new errorResponse({
        message: "Email already in use",
        statusCode: 400,
      });

    if (phone) {
      const phoneExist = await Account.findOne({ where: { phone } });

      if (phoneExist) {
        throw new errorResponse({
          message: "Phone already in use",
          statusCode: 400,
        });
      }
    }

    // Check if phone is already in use

    const account = await Account.create({
      email,
      password,
      fullname,
      phone,
    });

    if (!account) {
      throw new errorResponse({
        message: "Account not created",
        statusCode: 400,
      });
    }

    return {
      message: "Account created successfully",
      account,
    };
  }

  async login({ id, password }) {}

  async sendEmail({ email }) {
    const account = await Account.findOne({ where: { email } });

    if (!account) {
      throw new errorResponse({
        message: "Email not found",
        statusCode: 404,
      });
    }

    const otp = Math.floor(1000 + Math.random() * 9999);
    verifyEmail.storeOTP(account.id, otp);

    try {
      await sendMail({
        to: email,
        ...emailTemplate.sendOTP(otp, account.fullname),
      });
    } catch (err) {
      throw new errorResponse({
        message: "Error sending email",
        statusCode: 500,
      });
    }

    return {
      message: "OTP sent to email, please check your email",
    };
  }

  async verifyEmail({ email, otp }) {
    const account = await Account.findOne({ where: { email } });

    if (!account) {
      throw new errorResponse({
        message: "Email not found",
        statusCode: 404,
      });
    }

    const isVerified = verifyEmail.verifyOTP(account.id, otp);

    if (!isVerified)
      throw new errorResponse({
        message: "OTP is not valid",
        statusCode: 400,
      });

    account.verified = true;
    await account.save();
    const token = TokenService.generateToken({ user_id: account.id });

    return token;
  }

  async changePassword({ email, password }) {}

  async verifyOTP({ user_id, otp }) {}

  async resetPassword({ email, password }) {}

  async updateProfile({ account }) {}

  async getProfile({ account }) {}

  async getProfileById({ id }) {}

  async deleteProfile({ account }) {}
}

module.exports = new AccountService();
