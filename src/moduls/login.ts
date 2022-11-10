/* eslint-disable @typescript-eslint/no-unused-vars */
import { Signin } from "./loginintrtface";
import mongoose, { model, Schema } from "mongoose";

const SigninSchema : Schema = new Schema(
    {
        image:{
            type:String,
            default:'null'  
        },    
        email:{
            type:String,
            required:true,
            unique:true
        },
        password:{
            type:String,
            required:true
        },
        role: {
            type: String,
            enum : ['user','admin','staff'],
            default: 'staff'
        }, 
        tokens: [{
            accessToken: {
                type: String,
                required: false
            },
            refreshToken: {
                type: String,
                required: false
            }
    }]
    
    }
)

export default model<Signin>("SigninDt", SigninSchema);