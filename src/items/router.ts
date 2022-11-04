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
itemsRouter.get('/logingetuser',vtoken,logingetuser)
itemsRouter.get('/getallstaffs',vtoken,isAdmin,getallstaffs)
itemsRouter.delete('/deleteuser/:id',vtoken,deleteuser)
itemsRouter.post('/Days',vtoken,ondays)
itemsRouter.get('/getAppointment',vtoken,GetAppointment)
itemsRouter.put('/updateSlot',vtoken,updateSlot)
itemsRouter.post('/booking',vtoken,bookingSlots)
itemsRouter.put('/updateBooking',vtoken,updateBooking)
itemsRouter.get('/getBookingsByEmail',vtoken,getBookingsByEmail)
itemsRouter.get('/getDaysByEmail',vtoken,getDaysByEmail)
itemsRouter.delete('/DeleteBooking/:id',vtoken,softDelete)
itemsRouter.delete('/DeleteStaff/:id',vtoken,DaysSoftDelete)
