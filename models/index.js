import Sequelize from 'sequelize';
import pg from 'pg';
import process from 'process';
import configFile from '../config/config.json' with { type: 'json' };
import UserFactory from './User.js';
import CompanyFactory from './Company.js';

const env = process.env.NODE_ENV || 'development';
const config = configFile[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], { ...config, dialectModule: pg });
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, { ...config, dialectModule: pg });
}

const User = UserFactory(sequelize, Sequelize.DataTypes);
const Company = CompanyFactory(sequelize, Sequelize.DataTypes);

db[User.name] = User;
db[Company.name] = Company;

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
