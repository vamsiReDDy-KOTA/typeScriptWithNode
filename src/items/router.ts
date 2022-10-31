//import express, { Request, Response } from "express";
import { Router } from "express";
import { Controller, Get, Route } from "tsoa";

import { softDelete,DaysSoftDelete ,ondays,getDaysByEmail,GetAppointment,updateSlot ,bookingSlots,updateBooking,getBookingsByEmail} from "./server";

//export const itemsRouter = express.Router();

export class Appointment extends Controller{

@Route('/getBookingsByEmail')
@Get()
public async getAll():Promise<any>{
    return getBookingsByEmail
}

//itemsRouter.get('/getBookingsByEmail',getBookingsByEmail)

// itemsRouter.post('/Days',ondays)
// itemsRouter.get('/GetAppointment',GetAppointment)
// itemsRouter.put('/updateSlot',updateSlot)
// itemsRouter.post('/booking',bookingSlots)
// itemsRouter.put('/updateBooking',updateBooking)

// itemsRouter.get('/getDaysByEmail',getDaysByEmail)
// itemsRouter.delete('/softDelete/:id',softDelete)
// itemsRouter.delete('/DaysSoftDelete/:id',DaysSoftDelete)

}