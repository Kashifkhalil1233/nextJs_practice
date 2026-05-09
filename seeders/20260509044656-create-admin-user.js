'use strict';
const bcrypt = require('bcryptjs');
const db = require('../models/index.js').default;
const { User } = db;

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const adminEmail = 'admin@example.com';
    
   
    const existingAdmin = await User.findOne({ where: { email: adminEmail } });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
     
      await User.create({
        name: 'Admin',
        email: adminEmail,
        password: hashedPassword,
        role: 'admin'
      });
      
      console.log('Admin user created successfully.');
    } else {
      console.log('Admin user already exists. Skipping...');
    }
  },

  async down(queryInterface, Sequelize) {
   
    return User.destroy({ where: { email: 'admin@example.com' } });
  }
};
