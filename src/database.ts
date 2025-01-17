import { Sequelize } from "sequelize-typescript";
import Supervisors from "./models/supervisors";
import Categories from "./models/categories";
import Dishes from "./models/dishes";
import ExtraItems from "./models/extraItems";
import Extras from "./models/extras";
import Items_Has_Dishes from "./models/Items_has_dishes";
import Items from "./models/items";
const dotenv = require("dotenv");
dotenv.config();
const sequelize = new Sequelize({
  dialect: "mysql",
  host: process.env.MYSQL_HOST,
  timezone: "+00:00",
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  logging: console.log,
  models: [
    Supervisors,
    Categories,
    Items,
    Dishes,
    Items_Has_Dishes,
    Extras,
    ExtraItems,
  ],
});

export default sequelize;
