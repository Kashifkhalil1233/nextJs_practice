import sequelize from "./db";
import User from "@/models/User";

const syncDB = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log("Database connected");
  } catch (err) {
    console.log(err);
  }
};

export default syncDB;