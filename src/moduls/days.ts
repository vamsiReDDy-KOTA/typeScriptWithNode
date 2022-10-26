import Days from './daysInterface'
import mongoose, { model, Schema } from "mongoose";


const daysSchema : Schema = new Schema (
{
    TimeZone:{
        type:String,
        required : true
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    phoneNo:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    BookedDate:{
        type:String,
        required:true
    },
    Monday:[
        {   
       startTime:{
           type : Array,
           required : true
       },
       endTime:{
           type : Array,
           required : true
       },
       breakTime:{
        type:Array,
        required:true
       }
   }     
   ],
    Tuesday	:[
        {   
       startTime:{
           type : Array,
           required : true
       },
       endTime:{
           type : Array,
           required : true
       },
       breakTime:{
        type:Array,
        required:true
       }
   }     
   ],
    Wednesday:[
        {   
       startTime:{
           type : Array,
           required : true
       },
       endTime:{
           type : Array,
           required : true
       },
       breakTime:{
        type:Array,
        required:true
       }
   }     
   ],	
    Thursday:[
        {   
       startTime:{
           type : Array,
           required : true
       },
       endTime:{
           type : Array,
           required : true
       },
       breakTime:{
        type:Array,
        required:true
       }
   }     
   ],	
    Friday :[
        {   
       startTime:{
           type : Array,
           required : true
       },
       endTime:{
           type : Array,
           required : true
       },
       breakTime:{
        type:Array,
        required:true
       }
   }     
   ],
    Saturday : [
        {   
       startTime:{
           type : Array,
           required : true
       },
       endTime:{
           type : Array,
           required : true
       },
       breakTime:{
        type:Array,
        required:true
       }
   }     
   ],
    Sunday : [
        {   
       startTime:{
           type : Array,
           required : true
       },
       endTime:{
           type : Array,
           required : true
       },
       breakTime:{
        type:Array,
        required:true
       }
   }     
   ],
   isDeleted:{
    type:Boolean,
    //enum:[true,false],
    default:false
    //enum:[true,false]
   }
   
}
)

export default model<Days>("DaysModel", daysSchema);