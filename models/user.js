import { Model } from 'sequelize';

const UserFactory = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.belongsToMany(models.Company, {
        through: 'UserCompanies',
        foreignKey: 'userId',
        otherKey: 'companyId'
      });
    }
  }
  User.init({
    name: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('user', 'admin'),
      allowNull: false,
      defaultValue: 'user',
    }
  }, {
    sequelize,
    modelName: 'User',
  });

  return User;
};

export default UserFactory;