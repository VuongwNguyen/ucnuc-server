const { Sequelize } = require("sequelize");
require("dotenv").config();

const DATABASE_URI = process.env.DATABASE_URI;

if (!DATABASE_URI) {
  throw new Error("DATABASE_URI is not defined in the .env file");
}

class Connection {
  constructor() {
    if (!Connection._instance) {
      this._instance = new Sequelize(DATABASE_URI, {
        dialect: "mysql",
        logging: false,
        dialectOptions: {
          charset: "utf8mb4",
        },
        define: {
          charset: "utf8mb4",
          collate: "utf8mb4_unicode_ci",
          timestamps: true, // Bật timestamps
        },
      });
      Connection._instance = this;
    }
    return Connection._instance;
  }

  getInstance() {
    return this._instance;
  }

  async sync(force = false, alter = false) {
    try {
      if (force || alter) {
        await this._instance.sync({ force, alter });
        console.log(
          `all models were synchronized successfully! ${
            force ? "(force: true)" : ""
          } ${alter ? "(alter: true)" : ""}`
        );
      }
    } catch (error) {
      console.error("Error during database sync:", error);
    }
  }

  async connect() {
    try {
      await this._instance.authenticate();
      console.log("Connection established successfully!");
    } catch (error) {
      console.error("Unable to connect to the database:", error);
    }
  }
}

const connection = new Connection();
Object.freeze(connection);

module.exports = connection;
