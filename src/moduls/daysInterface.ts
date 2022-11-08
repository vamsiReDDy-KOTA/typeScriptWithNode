import { Document} from "mongoose";

export interface Days extends Document{
TimeZone:string;
email:string;
phoneNo:string;
name:string;
StartDate:string;
repect:string;
Monday:Array<any>;
Tuesday	:Array<any>;
Wednesday:Array<any>;	
Thursday:Array<any>;	
Friday :Array<any>;
Saturday : Array<any>;
Sunday : Array<any>;
isDeleted:boolean;
}

export default Days