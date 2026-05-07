import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
  "nextapp",
  "postgres",
  "qwer1234",
  {
    host: "localhost",
    dialect: "postgres",
    logging: false,
  }
);

export default sequelize;