import express, { Request, Response } from "express";
import mongoose from "mongoose"
import cors from "cors"
import { itemsRouter } from "./items/router"
import morgan from "morgan";
import path from 'path';

const app = express();
app.use(express.json());
app.use(morgan("tiny"));
app.use(express.static("public"));
app.use(cors());
app.use("/", itemsRouter);

app.use(itemsRouter);

app.use(express.static(path.join(__dirname, 'public')));
app.use("/doc",express.static("./Docs"))

app.get("/", (req, res) => {
  return res.status(200).send(`<html><body><div style="text-align: center;margin-top: 200;"><p style="font-family: serif;font-size: 20px;font-weight: bold;">Welcome to cogsworth Application</p><button><a href="http://localhost:4001/doc">Api Docs</a></button></div></body></html>`);
});

// global.__basedir = __dirname;

app.use(express.static(path.join(__dirname, 'public')));

//mongodb+srv://vamsi:vamsi22@cluster0.auer7qa.mongodb.net/?retryWrites=true&w=majority
const uri: string = "mongodb+srv://vamsiReddyk:vamsi22@cluster0.auer7qa.mongodb.net/timezone?retryWrites=true&w=majority"
//`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@clustertodo.raz9g.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`
//const options: any = { useNewUrlParser: true, useUnifiedTopology: true }
//mongoose.set("useFindAndModify", false)
//let db
//let connectionString = `mongodb://localhost:27017/crud`


mongoose
  .connect(uri)
  .then(() =>
    app.listen(4001, () =>
      console.log(`Server running on http://localhost 4001`)

    )
  )
  .catch((error) => {
    throw error;
  });

// app.listen(4000,()=>{
//     console.log('it is running at 4000');
// })