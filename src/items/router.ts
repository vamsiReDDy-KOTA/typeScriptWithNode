import express, { Request, Response } from "express";
import * as ItemService from "./server";
import { BaseItem, Item } from "./module";
import Joi, { any } from "joi";
import * as Fs from "fs";
import { addModel, getApp, getSE, softDelete ,ondays,getDaysByEmail,send,GetAppointment,updateSlot ,bookingSlots,updateBooking,getBookingsByEmail} from "./server";


export const itemsRouter = express.Router();

itemsRouter.post('/Days',ondays)
itemsRouter.get('/GetAppointment',GetAppointment)
itemsRouter.put('/updateSlot',updateSlot)
itemsRouter.post('/booking',bookingSlots)
itemsRouter.put('/updateBooking',updateBooking)
itemsRouter.get('/getBookingsByEmail',getBookingsByEmail)
itemsRouter.get('/getDaysByEmail',getDaysByEmail)
itemsRouter.delete('/softDelete/:id',softDelete)
