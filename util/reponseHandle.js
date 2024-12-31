class successfullyResponse {
  constructor({ meta, message, status = true, statusCode = 200 }) {
    this.meta = meta;
    this.message = message;
    this.status = status;
    this.statusCode = statusCode;
  }
  json(res) {
    res.json({
      status: this.status,
      message: this.message,
      data: this.data,
    });
  }
}

class errorResponse extends Error {
  constructor({ message = "", status = false, statusCode = 500 }) {
    super(message);
    this.status = status;
    this.code = statusCode;
  }
}

module.exports = {
  successfullyResponse,
  errorResponse,
};
