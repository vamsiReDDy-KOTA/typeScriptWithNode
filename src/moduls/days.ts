import Days from './daysInterface'
import mongoose, { model, Schema } from "mongoose";
import times from './times';

const daysSchema : Schema = new Schema (
{
    TimeZone:{
        type:String,
        required : true
    },
    Monday:[
        {   
       startTime:{
           type : String,
           required : true
       },
       endTime:{
           type : String,
           required : true
       }
   }     
   ],
    Tuesday	:[
        {   
       startTime:{
           type : String,
           required : true
       },
       endTime:{
           type : String,
           required : true
       }
   }     
   ],
    Wednesday:[
        {   
       startTime:{
           type : String,
           required : true
       },
       endTime:{
           type : String,
           required : true
       }
   }     
   ],	
    Thursday:[
        {   
       startTime:{
           type : String,
           required : true
       },
       endTime:{
           type : String,
           required : true
       }
   }     
   ],	
    Friday :[
        {   
       startTime:{
           type : String,
           required : true
       },
       endTime:{
           type : String,
           required : true
       }
   }     
   ],
    saturday : [
        {   
       startTime:{
           type : String,
           required : true
       },
       endTime:{
           type : String,
           required : true
       }
   }     
   ],
    sunday : [
        {   
       startTime:{
           type : String,
           required : true
       },
       endTime:{
           type : String,
           required : true
       }
   }     
   ]
    //sunday : {
  //          type: mongoose.Schema.Types.ObjectId,
    //        ref:times,
            //required:true
        
    //}
}
)

export default model<Days>("DaysModel", daysSchema);