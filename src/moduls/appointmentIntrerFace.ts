import { Document } from "mongoose";

export interface Appoint extends Document {
  name: string;
  description: string;
  startTime: string;
  EndTime:string;
  endTime: string;
  DateYouBooked: Date;
  conformBooking:string
  dateOfAppointment:string;
}

export default Appoint

