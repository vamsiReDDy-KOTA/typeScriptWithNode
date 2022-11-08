import express, { Request, Response } from "express";
import vtoken from "../mid/token"
import {isAdmin ,isStaff} from "../mid/roles";
import { upload } from "../mid/profile";
import { softDelete, bookingSlots, updateBooking ,getBookingsByEmail} from "../controlers/bookings";

import { deletealluser ,updatealluser ,getallusers,getallstaffs} from "../controlers/admin";

import {  signup,updateuser,logingetuser,deleteuser ,signin , profile } from "../controlers/user";

import { ondays ,updateSlot, DaysSoftDelete, getDaysByEmail  } from "../controlers/staff"
import { GetAppointment } from "../controlers/Appointments";

export const itemsRouter = express.Router();


//user
itemsRouter.post('/Signup',signup) 
itemsRouter.post('/Signin',signin)
itemsRouter.put('/updateuser',vtoken,updateuser)
itemsRouter.put('/profile',vtoken,upload,profile)
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
