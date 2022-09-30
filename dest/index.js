"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const router_1 = require("./items/router");
const server_1 = require("./items/server");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use("/api/menu/item", router_1.itemsRouter);
app.get('/', (req, res) => {
    res.status(201).send("it is worjking");
});
app.post("/appointment", server_1.addModel);
app.get("/appointment", server_1.getApp);
app.post("/det", server_1.send);
app.get('/pro/:id', server_1.getSE);
app.post("/da", server_1.ondays);
//mongodb+srv://vamsi:vamsi22@cluster0.auer7qa.mongodb.net/?retryWrites=true&w=majority
const uri = "mongodb+srv://vamsiReddyk:vamsi22@cluster0.auer7qa.mongodb.net/timezone?retryWrites=true&w=majority";
//`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@clustertodo.raz9g.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`
const options = { useNewUrlParser: true, useUnifiedTopology: true };
//mongoose.set("useFindAndModify", false)
//let db
//let connectionString = `mongodb://localhost:27017/crud`
mongoose_1.default
    .connect(uri)
    .then(() => app.listen(4001, () => console.log(`Server running on http://localhost 4001`)))
    .catch((error) => {
    throw error;
});
// app.listen(4000,()=>{
//     console.log('it is running at 4000');
// })
