'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tableInfoUsers = await queryInterface.describeTable('Users');
    
    // Add otp and otpExpiry to Users if they don't exist
    if (!tableInfoUsers.otp) {
      await queryInterface.addColumn('Users', 'otp', {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
    if (!tableInfoUsers.otpExpiry) {
      await queryInterface.addColumn('Users', 'otpExpiry', {
        type: Sequelize.DATE,
        allowNull: true,
      });
    }

    const tableInfoCompanies = await queryInterface.describeTable('Companies');
    
    // Add createdBy to Companies if it doesn't exist
    if (!tableInfoCompanies.createdBy) {
      // Add as nullable first
      await queryInterface.addColumn('Companies', 'createdBy', {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      });

      // Update existing rows to use admin ID (6)
      await queryInterface.bulkUpdate('Companies', { createdBy: 6 }, { createdBy: null });

      // Change to non-nullable
      await queryInterface.changeColumn('Companies', 'createdBy', {
        type: Sequelize.INTEGER,
        allowNull: false,
      });
    }

    const tables = await queryInterface.showAllTables();
    
    // Create UserCompanies join table if it doesn't exist
    if (!tables.includes('UserCompanies')) {
      await queryInterface.createTable('UserCompanies', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        userId: {
          type: Sequelize.INTEGER,
          references: {
            model: 'Users',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },
        companyId: {
          type: Sequelize.INTEGER,
          references: {
            model: 'Companies',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE
        }
      });
    }
  },

  async down(queryInterface, Sequelize) {
    // Basic down migration (optional since this is a fix-up)
    await queryInterface.dropTable('UserCompanies').catch(() => {});
    await queryInterface.removeColumn('Companies', 'createdBy').catch(() => {});
    await queryInterface.removeColumn('Users', 'otpExpiry').catch(() => {});
    await queryInterface.removeColumn('Users', 'otp').catch(() => {});
  }
};
