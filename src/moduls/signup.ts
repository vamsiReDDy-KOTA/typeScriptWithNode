import { Signup } from "./signupinterface";
import mongoose, { model, Schema } from "mongoose";

const SignupSchema : Schema = new Schema(
    {
        firstname:{
            type:String,
            required:true
        },
        lastname:{
            type:String,
            required:true
        },
        image:{
            krishna:String,
            contentType: String,
            //default:"none"
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
        // isAdmin: {
        //       type:Boolean,
        //       default: false,
        // },
        role: {
            type: String,
            enum : ['user','admin','staff'],
            default: 'staff'
        },   
        isDeleted:{
            type:Boolean,
            default:false
           }
    
    }
)

export default model<Signup>("SignupDt", SignupSchema);

