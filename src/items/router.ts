import express, { Request, Response } from "express";
import { Router } from "express";
import { Controller, Get, Route } from "tsoa";
import vtoken from "../mid/token"
import isAdmin from "../mid/isAdmin";


import { signup,updateuser,logingetuser,deleteuser,getallstaffs,softDelete,DaysSoftDelete ,ondays,getDaysByEmail,GetAppointment,updateSlot ,bookingSlots,updateBooking,getBookingsByEmail, signin} from "./server";

export const itemsRouter = express.Router();



itemsRouter.post('/Signup',signup)
itemsRouter.post('/Signin',signin)
itemsRouter.put('/updateuser',vtoken,updateuser)
itemsRouter.get('/logingetuser',logingetuser)
itemsRouter.get('/getallstaffs',vtoken,isAdmin,getallstaffs)
itemsRouter.delete('deleteuser',deleteuser)
itemsRouter.post('/Days',ondays)
itemsRouter.get('/GetAppointment',GetAppointment)
itemsRouter.put('/updateSlot',updateSlot)
itemsRouter.post('/booking',bookingSlots)
itemsRouter.put('/updateBooking',updateBooking)
itemsRouter.get('/getBookingsByEmail',getBookingsByEmail)
itemsRouter.get('/getDaysByEmail',getDaysByEmail)
itemsRouter.delete('/DeleteBooking/:id',softDelete)
itemsRouter.delete('/DeleteStaff/:id',DaysSoftDelete)
