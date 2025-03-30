const { Account, BlackList } = require("../models");
const { errorResponse } = require("../util/responseHandle");
const TokenService = require("./token.service");
const StoreOTP = require("../util/storeOTP");
const { sendMail, emailTemplate } = require("../util/mailer");
const jwt = require("jsonwebtoken");
const keystoreService = require("./keystore.service");

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

  async login({ email, password, admin = false }) {
    const account = await Account.findOne({ where: { email } });

    if (admin && account.role !== "admin")
      throw new errorResponse({
        message: "Unauthorized",
        statusCode: 403,
      });

    if (!account)
      throw new errorResponse({
        message: "email or password is incorrect",
        statusCode: 400,
      });

    const checkPassword = await account.comparePassword(password);

    if (!account || !checkPassword)
      throw new errorResponse({
        message: "email or password is incorrect",
        statusCode: 400,
      });

    if (!account.verified)
      throw new errorResponse({
        message: "Please verify your email",
        statusCode: 403,
      });

    const token = TokenService.generateToken({ user_id: account.id });

    await keystoreService.upsertKeyStore({
      account_id: account.id,
      current_refresh_token: token.refreshToken,
    });

    return {
      id: account.id,
      fullname: account.fullname,
      email: account.email,
      role: account.role,
      token: token,
    };
  }

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

    return {
      message: "Email verified successfully",
    };
  }

  async renewToken({ refreshToken }) {
    try {
      const decoded = jwt.verify(refreshToken, process.env.REFRESH_JWT_SECRET);
      const user = await Account.findOne({ where: { id: decoded.user_id } });
      const blacklisted = await BlackList.findOne({
        where: { refresh_token: refreshToken },
      });
      if (!user)
        throw new errorResponse({
          message: "something went wrong, please login",
          statusCode: 403,
        });

      if (user.current_refresh_token !== refreshToken || blacklisted)
        // nếu token không khớp hoặc đã bị blacklist
        throw new errorResponse({
          message: "something went wrong, please login",
          statusCode: 403,
        });
      const token = TokenService.generateToken({ user_id: user.id });

      await keystoreService.addBlackList({
        account_id: user.id,
        new_refresh_token: token.refreshToken,
        old_refresh_token: refreshToken,
      });
      return {
        id: user.id,
        fullname: user.fullname,
        email: user.email,
        role: user.role,
        token: token,
      };
    } catch (error) {
      throw new errorResponse({
        message: "something went wrong, please login",
        statusCode: 403,
      });
    }
  }

  async logout({ user_id }) {

    const user = await Account.findOne({ where: { id: user_id } });
    

    if (!user)
      throw new errorResponse({
        message: "User not found",
        statusCode: 404,
      });

    return await keystoreService.removeBlackList({ account_id: user_id });
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
