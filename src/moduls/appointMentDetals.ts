import { Detals } from "./appointMentDetalsInterFace";
import mongoose, { model, Schema } from "mongoose";

const DetalsSchema : Schema = new Schema(
    {
        UserDetals:[{
            type:mongoose.Types.ObjectId, 
            ref: 'AppointModel',
            //required:true
        }],
        name:{
            type : String,
            required:true
        }
    }
)

export default model<Detals>("userDt", DetalsSchema);

