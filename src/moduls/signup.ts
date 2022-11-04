import { Signup } from "./signupinterface";
import mongoose, { model, Schema } from "mongoose";

const SignupSchema : Schema = new Schema(
    {
        fullname:{
            type:String,
            required:true
        },
        lastname:{
            type:String,
            required:true
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
        confirmPassword:{
            type:String,
            required:true
        },
        isAdmin: {
              type:Boolean,
              default: false,
        },
        isDeleted:{
            type:Boolean,
            default:false
           }
    
    }
)

export default model<Signup>("SignupDt", SignupSchema);

