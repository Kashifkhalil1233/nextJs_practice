import { Model } from "sequelize";

const CompanyFactory = (sequelize, DataTypes) => {
  class Company extends Model {
    static associate(models) {
      Company.belongsToMany(models.User, {
        through: "UserCompanies",
        foreignKey: "companyId",
        otherKey: "userId",
        as: "Users",
      });

      Company.belongsTo(models.User, {
        foreignKey: "createdBy",
        as: "owner",
      });
    }
  }

  Company.init(
    {
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
      },

      createdBy: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: "Company",
    },
  );

  return Company;
};

export default CompanyFactory;
