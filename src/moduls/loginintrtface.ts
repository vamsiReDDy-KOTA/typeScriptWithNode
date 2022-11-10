/* eslint-disable @typescript-eslint/ban-types */
import { Document} from "mongoose";

export interface Signin extends Document{
email:String,
image:string,
password:String,
token:string,
role:string
}