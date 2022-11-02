import express, { Request, Response } from "express";
import { Router } from "express";
import { Controller, Get, Route } from "tsoa";

import { softDelete,DaysSoftDelete ,ondays,getDaysByEmail,GetAppointment,updateSlot ,bookingSlots,updateBooking,getBookingsByEmail} from "./server";

export const itemsRouter = express.Router();



itemsRouter.post('/Days',ondays)
itemsRouter.get('/GetAppointment',GetAppointment)
itemsRouter.put('/updateSlot',updateSlot)
itemsRouter.post('/booking',bookingSlots)
itemsRouter.put('/updateBooking',updateBooking)
 
itemsRouter.get('/getBookingsByEmail',getBookingsByEmail)


itemsRouter.get('/getDaysByEmail',getDaysByEmail)
itemsRouter.delete('/softDelete/:id',softDelete)
itemsRouter.delete('/DaysSoftDelete/:id',DaysSoftDelete)