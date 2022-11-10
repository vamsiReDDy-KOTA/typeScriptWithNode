/* eslint-disable @typescript-eslint/ban-types */
import { Document} from "mongoose";

export interface Token extends Document{
token:String,
status:String,
userId:String,

}
