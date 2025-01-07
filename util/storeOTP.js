class StoreOTP {
  #store;
  constructor() {
    this.#store = new Map();
  }

  storeOTP(user_id, otp) {
    this.#store.set(user_id, {
      otp,
      expiresAt: Date.now() + 15 * 6 * 1000, // 15 minutes
    });
  }

  verifyOTP(user_id, otp) {
    otp = parseInt(otp);
    if (!this.#store.has(user_id)) return false; // user_id not found
    if (this.#store.get(user_id).expiresAt < Date.now()) return false; // OTP expired

    if (this.#store.get(user_id).otp === otp) {
      this.#store.delete(user_id);
      return true; // OTP matched
    }
  }

  verifyEmailResetPassword(user_id) {}
}

module.exports = StoreOTP;
