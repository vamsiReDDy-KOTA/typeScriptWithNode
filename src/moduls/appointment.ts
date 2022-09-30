import { Appoint } from "./appointmentIntrerFace";
import mongoose, { model, Schema } from "mongoose";
import days from "./days";
//import { string } from "joi";
//const {} = mongoose.Schema;

const menuSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    
      //type : Schema.Types.ObjectId,
      references: { type: [Schema.Types.ObjectId], refPath: 'days' },
      model_type: {  type: String, enum: ['days' ] }
      //ref:days
    ,
    description: {
      type: String,
      required: true,
    },
    
    dateOfAppointment:{
        type:String,
        required:true
    },
    DateYouBooked:{
        type:Date,
        required:true
    },
    conformBooking:{
      type:String,
      required : true
    }
  },
  { timestamps: true }
);

export default model<Appoint>("AppointModel", menuSchema);