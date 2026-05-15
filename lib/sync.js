import db from "@/models";

const syncDB = async () => {
  try {
    await db.sequelize.authenticate();
    await db.sequelize.sync({ alter: true });
    console.log("Database connected");
  } catch (err) {
    console.log(err);
  }
};

export default syncDB;