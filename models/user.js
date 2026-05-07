import { Model } from 'sequelize';

const UserFactory = (sequelize, DataTypes) => {
  class User extends Model {
    static associate() {
      // define association here
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
    }
  }, {
    sequelize,
    modelName: 'User',
  });

  return User;
};

export default UserFactory;