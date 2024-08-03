"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dishes_1 = __importDefault(require("./models/dishes"));
const database_1 = __importDefault(require("./database"));
const dotenv = require("dotenv");
const app = (0, express_1.default)();
const cors = require("cors");
const Bull = require("bull");
dotenv.config();
app.use(cors());
app.use(express_1.default.json());
const dishQueue = new Bull("dishQueue", process.env.REDIS_URL);
dishQueue.process((job) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, type } = job.data;
    try {
        if (type === "removePromotion") {
            yield dishes_1.default.update({ discount: false }, { where: { id: id } });
        }
    }
    catch (e) {
        console.error(e);
    }
}));
dishQueue.on("failed", (job, err) => __awaiter(void 0, void 0, void 0, function* () {
    yield job.retry();
}));
database_1.default
    .sync()
    .then((res) => {
    app.listen(4003, () => console.log(`Server is running on http://localhost:4003`));
})
    .catch((err) => console.log(err));
