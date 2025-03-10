var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var cors = require("cors");
var helmet = require("helmet");
var logger = require("morgan");
var app = express();
// const fs = require("fs");
var winston = require("winston");

// Connect to database
require("./bin/connection").connect();
require("./bin/connection").sync(false, true);

// logger setting
const Logger = winston.createLogger({
  level: "error",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [new winston.transports.File({ filename: "server-log.log" })],
});

// View engine setup
app.use(cors());
app.use(helmet());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/api", require("./routes"));

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function (err, req, res, next) {
  // Set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  if (err.status === 404) {
    return res.status(404).json({
      status: false,
      message: "Not found",
      statusCode: 404,
    });
  }
  // write error to log file
  if (err.statusCode === 500)
    Logger.error({
      message: err.message,
      status: err.statusCode,
      stack: err.stack,
      timestamp: new Date().toISOString(),
    });

  // Return the error
  res.status(err.statusCode || 500).json({
    statusResponse: err.statusResponse,
    message: err.message,
    statusCode: err.statusCode,
  });

  console.log("lỗi ", err.stack);
});

module.exports = app;
