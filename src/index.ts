import express, { Response, Request } from "express";
import Dish from "./models/dishes";
import sequelize from "./database";
import dotenv from "dotenv";

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

app.get("/", (req: Request, res: Response) => {
  return res.send("Hello World");
});

sequelize
  .authenticate()
  .then(() => console.log("Database connected..."))
  .catch((err) => console.error("Database connection error:", err));
const PORT = process.env.PORT || 4003;
console.log(PORT);
sequelize
  .sync()
  .then((res) => {
    app.listen(PORT, () =>
      console.log(`Server is running on http://localhost:4003`)
    );
  })
  .catch((err) => console.log(err));
