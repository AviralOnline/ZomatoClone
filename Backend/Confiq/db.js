const { Sequelize } = require('sequelize');

let db;
const isLocal = !process.env.RAILWAY_ENVIRONMENT;
const connectionString = (isLocal && process.env.MYSQL_PUBLIC_URL) || process.env.MYSQL_URL || process.env.DATABASE_URL;

if (connectionString) {
  db = new Sequelize(connectionString, {
    dialect: 'mysql',
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  });
} else {
  db = new Sequelize(
    process.env.DB_NAME || process.env.MYSQLDATABASE || 'railway',
    process.env.DB_USER || process.env.MYSQLUSER || 'root',
    process.env.DB_PASSWORD || process.env.MYSQLPASSWORD || 'DcVPlvdCMHyLuaCqeAIeGfEEWWtVkSPV',
    {
      host: process.env.DB_HOST || process.env.MYSQLHOST || 'hayabusa.proxy.rlwy.net',
      port: process.env.DB_PORT || process.env.MYSQLPORT || 27520,
      dialect: 'mysql',
      logging: false,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
    }
  );
}

module.exports = db;
