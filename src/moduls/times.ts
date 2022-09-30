import Times from './timesInterface'
import { model, Schema } from "mongoose";

const timesSchema : Schema = new Schema (
    {
        startTime: {
            type:String,
            required : true
        },
        endTime:{
            type:String,
            required: true
        }
    }
)

export default model<Times>("TimesModel", timesSchema);