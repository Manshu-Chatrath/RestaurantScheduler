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
  const { id, type } = job.data;

  try {
    if (type === "removePromotion") {
      await Dish.update({ discount: false }, { where: { id: id } });
    }
  } catch (e: any) {
    console.error(e);
  }
});
dishQueue.on("failed", async (job: any, err: any) => {
  console.log(err);
  await job.retry();
});

sequelize
  .sync()
  .then((res) => {
    app.listen(process.env.port || 4003, () =>
      console.log(`Server is running on http://localhost:4003`)
    );
  })
  .catch((err) => console.log(err));
