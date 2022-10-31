"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const router_1 = require("./items/router");
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const morgan_1 = __importDefault(require("morgan"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, morgan_1.default)("tiny"));
app.use(express_1.default.static("public"));
app.use((0, cors_1.default)());
app.use("/", router_1.itemsRouter);
// app.use(
//   "/docs",
//   swaggerUi.serve,
//   swaggerUi.setup(undefined, {
//     swaggerOptions: {
//       url: "/swagger.json",
//     },
//   })
// );
const swaggerDefinition = {
    openapi: "3.0.0",
    info: {
        title: "Homework APP",
        version: "0.1.0",
        description: "This is a simple CRUD API application made with Express and documented with Swagger",
    },
    servers: [
        {
            "url": "/swagger.json",
            "description": "Local Dev"
        },
    ],
};
const options = {
    swaggerDefinition,
    apis: ["./items/router/itemsRouter*.ts"],
};
const specs = (0, swagger_jsdoc_1.default)(options);
app.use((0, morgan_1.default)(":status :method :url :response-time ms"));
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(specs));
app.use(router_1.itemsRouter);
app.get('/', (req, res) => {
    res.status(201).send("it is working");
});
//mongodb+srv://vamsi:vamsi22@cluster0.auer7qa.mongodb.net/?retryWrites=true&w=majority
const uri = "mongodb+srv://vamsiReddyk:vamsi22@cluster0.auer7qa.mongodb.net/timezone?retryWrites=true&w=majority";
//`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@clustertodo.raz9g.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`
//const options: any = { useNewUrlParser: true, useUnifiedTopology: true }
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
