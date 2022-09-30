import { Document} from "mongoose";

export interface Detals extends Document{

  UserDetals: string;
  name:string
  
}
