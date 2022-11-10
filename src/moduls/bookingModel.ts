/* eslint-disable @typescript-eslint/no-unused-vars */
import Booking from "./bookingModelInterface";
import mongoose, { model, Schema } from "mongoose";

const bookingmodels : Schema = new Schema(
    {
        TimeZone:{
            type:String,
            required:true
        },
    SlotsTime:{
        type:Array,
        required:true
    },
    Service:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    Name:{
        type:String,
        required:true
    },
    Duerication:{
        type:String,
        required:true
    },
    AppointmentDate:{
        type:String,
        required:true
    },
    isDeleted:{
        type:Boolean,
        default:false
       }
    }
)

export default model<Booking>("BookingModel", bookingmodels);