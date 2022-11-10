/* eslint-disable @typescript-eslint/no-unused-vars */
import { Token } from "./tokenInterface";
import mongoose, { model, Schema } from "mongoose";

const TokenSchema : Schema = new Schema({

token:{
    type:String,
    required:true
},
status:{
    type:String,
    enum : ['A','D'],
    default:'A'
},
userId:{
    type:String,
    required:true
},

})

export default model<Token>("TokenDt", TokenSchema);