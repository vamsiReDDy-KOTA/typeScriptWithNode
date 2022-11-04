import express, { Request, Response } from "express";
import { Router } from "express";
import { Controller, Get, Route } from "tsoa";
import vtoken from "../mid/token"
import {isAdmin ,isStaff} from "../mid/roles";


import { signup,updatealluser,getallusers,updateuser,deletealluser,logingetuser,deleteuser,getallstaffs,softDelete,DaysSoftDelete ,ondays,getDaysByEmail,GetAppointment,updateSlot ,bookingSlots,updateBooking,getBookingsByEmail, signin} from "./server";

export const itemsRouter = express.Router();


//user
itemsRouter.post('/Signup',signup)
itemsRouter.post('/Signin',signin)
itemsRouter.put('/updateuser',vtoken,updateuser)
itemsRouter.get('/logingetuser',vtoken,logingetuser)
itemsRouter.delete('/deleteuser/:id',vtoken,deleteuser)

//Admin
itemsRouter.get('/getallstaffs',vtoken,isAdmin,getallstaffs)
itemsRouter.get('/getallusers',vtoken,isAdmin,getallusers)
itemsRouter.put('/updatealluser',vtoken,isAdmin,updatealluser)
itemsRouter.delete('/deletealluser:id', vtoken,isAdmin,deletealluser)

//staff
itemsRouter.post('/Days',vtoken,isStaff,ondays)
itemsRouter.put('/updateSlot',vtoken,isStaff,updateSlot)
itemsRouter.delete('/DeleteStaff/:id',vtoken,isStaff,DaysSoftDelete)
itemsRouter.get('/getDaysByEmail',vtoken,isStaff,getDaysByEmail)

//availabul slots
itemsRouter.get('/getAppointment',vtoken,GetAppointment)

//booking
itemsRouter.post('/booking',vtoken,bookingSlots)
itemsRouter.put('/updateBooking',vtoken,updateBooking)
itemsRouter.get('/getBookingsByEmail',vtoken,getBookingsByEmail)
itemsRouter.delete('/DeleteBooking/:id',vtoken,softDelete)
