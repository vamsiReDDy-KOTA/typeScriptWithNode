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
    StartDate:{
        type:String,
        required:true
    },
    repect:{
        type:String,
        enum : ['day','week','month','year'],
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
       },
       available: { type: Boolean, default: false }
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
       },
       available: { type: Boolean, default: false }
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
       },
       available: { type: Boolean, default: false }
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
       },
       available: { type: Boolean, default: false }
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
       },
       available: { type: Boolean, default: false }
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
       },
       available: { type: Boolean, default: false }
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
       },
       available: { type: Boolean, default: false }
   }     
   ],
   isDeleted:{
    type:Boolean,
    default:false
   }
}
)
export default model<Days>("DaysModel", daysSchema);