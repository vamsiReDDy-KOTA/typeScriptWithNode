import { Document} from "mongoose";

export interface Times extends Document{
    startTime: string;
    endTime:string
}