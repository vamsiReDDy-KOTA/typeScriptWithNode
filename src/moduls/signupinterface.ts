/* eslint-disable @typescript-eslint/ban-types */
import { Document} from "mongoose";

export interface Signup extends Document{

fullname:String,
lastname:String,
email:String,
password:String,
confirmPassword:String,
isAdmin: Boolean,
}
