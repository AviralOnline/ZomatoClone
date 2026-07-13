const db = require('../Confiq/db');
const { DataTypes } = require('sequelize');
const User = require('./UserModel');
const Vendor = require('./VendorModel');

const Order = db.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  orderNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  orderId: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'Order Placed',
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  subtotal: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  totalPrice: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  deliveryFee: {
    type: DataTypes.FLOAT,
    defaultValue: 40,
  },
  platformFee: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  taxes: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  gst: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  discount: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  tip: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  total: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  grandTotal: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  paymentMode: {
    type: DataTypes.STRING,
    defaultValue: 'COD',
  },
  paymentMethod: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  restaurantName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  items: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  timestamps: true,
  tableName: 'Orders',
});

User.hasMany(Order, { foreignKey: 'userId', as: 'orders' });
Order.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Vendor.hasMany(Order, { foreignKey: 'vendorId', as: 'orders' });
Order.belongsTo(Vendor, { foreignKey: 'vendorId', as: 'vendor' });

module.exports = Order;
