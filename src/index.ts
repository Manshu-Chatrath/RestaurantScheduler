import express from "express";
import Dish from "./models/dishes";
import sequelize from "./database";
const dotenv = require("dotenv");
const app = express();
const cors = require("cors");
const Bull = require("bull");
dotenv.config();
app.use(cors());
app.use(express.json());
const dishQueue = new Bull("dishQueue", process.env.REDIS_URL);
dishQueue.process(async (job: any) => {
  const { id, type, startTime = null, endTime = null } = job.data;
  const transaction = await sequelize.transaction();
  try {
    if (type === "removePromotion") {
      await Dish.update(
        { discount: false },
        { where: { id: id }, transaction }
      );
      await transaction.commit();
    } else if (type === "initiateRemoval") {
      if (startTime !== null && endTime !== null) {
        dishQueue.add(
          { id: id, type: "removePromotion" },
          {
            delay: endTime - startTime,
            attempts: 5,
          }
        );
      } else {
        throw new Error(
          "startTime and endTime must be provided for initiateRemoval"
        );
      }
    }
  } catch (e: any) {
    await transaction.rollback();
    console.error(e);
  }
});
dishQueue.on("failed", async (job: any, err: any) => {
  await job.retry();
});

sequelize
  .sync()
  .then((res) => {
    app.listen(4003, () =>
      console.log(`Server is running on http://localhost:4003`)
    );
  })
  .catch((err) => console.log(err));
