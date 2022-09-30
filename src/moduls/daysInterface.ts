import { Document} from "mongoose";

export interface Days extends Document{
TimeZone:string;
Monday:Array<any>;
Tuesday	:Array<any>;
Wednesday:Array<any>;	
Thursday:Array<any>;	
Friday :Array<any>;
saturday : Array<any>;
sunday : Array<any>;
}

export default Days