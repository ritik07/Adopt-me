require("dotenv").config();
const { Sequelize } = require("sequelize");

const sqlConnection = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT,
  }
);
// const sqlConnection = new Sequelize("sys", "root", "", {
//   host: '127.0.0.1',
//   port: 3306,
//   dialect: "mysql",
// });

const testCon = async () => {
  try {
    await sqlConnection.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};
testCon();

module.exports = {
  sqlConnection,
};
