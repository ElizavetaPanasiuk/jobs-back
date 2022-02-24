const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    dialect: 'postgres',
    host: process.env.DB_HOST,
    dialectOptions: {
      ssl: {
        rejectUnauthorized: false, // very important
      }
    },
    define: {
      timestamps: false,
    }
  }
);

module.exports = sequelize;