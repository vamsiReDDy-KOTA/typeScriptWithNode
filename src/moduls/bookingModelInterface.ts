import { Document } from "mongoose";

export interface Booking extends Document {
    TimeZone:string,
    SlotsTime:Array<any>,
    Service:string,
    email:string,
    Name:string,
    Duerication:string,
    AppointmentDate:string,
    isDeleted:boolean
   
}

export default Booking