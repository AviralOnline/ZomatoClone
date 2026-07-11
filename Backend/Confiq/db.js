const { Sequelize } = require('sequelize');

const DATABASE_URL = process.env.DATABASE_URL || 'mysql://root:DcVPlvdCMHyLuaCqeAIeGfEEWWtVkSPV@hayabusa.proxy.rlwy.net:27520/railway';

const db = new Sequelize(DATABASE_URL, {
  dialect: 'mysql',
  logging: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

module.exports = db;
