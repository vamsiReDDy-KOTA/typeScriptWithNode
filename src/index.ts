import express, { Request, Response } from "express";
import mongoose from "mongoose"
import cors from "cors"
import { itemsRouter } from "./items/router"

const app = express();
app.use(express.json())
app.use(cors())
app.use("/", itemsRouter);

app.get('/',(req,res)=>{
    res.status(201).send("it is working")
})


//mongodb+srv://vamsi:vamsi22@cluster0.auer7qa.mongodb.net/?retryWrites=true&w=majority
const uri: string = "mongodb+srv://vamsiReddyk:vamsi22@cluster0.auer7qa.mongodb.net/timezone?retryWrites=true&w=majority"
//`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@clustertodo.raz9g.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`
const options: any = { useNewUrlParser: true, useUnifiedTopology: true }
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