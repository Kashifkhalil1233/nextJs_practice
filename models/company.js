import { Model } from 'sequelize';

const CompanyFactory = (sequelize, DataTypes) => {
  class Company extends Model {
    static associate(models) {
      Company.belongsToMany(models.User, {
        through: 'UserCompanies',
        foreignKey: 'companyId',
        otherKey: 'userId'
      });
    }
  }
  Company.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    location: {
      type: DataTypes.STRING,
    }
  }, {
    sequelize,
    modelName: 'Company',
  });

  return Company;
};

export default CompanyFactory;