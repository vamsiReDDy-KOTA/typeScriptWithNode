/* eslint-disable @typescript-eslint/no-unused-vars */
import express, { Request, Response } from "express";
import vtoken from "../mid/token"
import {isAdmin ,isStaff} from "../mid/roles";
import { upload } from "../mid/profile";
import { softDelete, bookingSlots, updateBooking ,getBookingsByEmail} from "../controllers/bookings";

import { deletealluser ,updatealluser ,getallusers,getallstaffs,deleteallstaff,updateallstaff} from "../controllers/admin";

import {  signup,updateuser,logingetuser,deleteuser ,signin , profile, logout } from "../controllers/user";

import { ondays ,updateSlot, DaysSoftDelete, getDaysByEmail  } from "../controllers/staff"
import { GetAppointment } from "../controllers/Appointments";

export const itemsRouter = express.Router();

//user
itemsRouter.post('/Signup',signup) 
itemsRouter.post('/Signin',signin)
itemsRouter.put('/updateuser',vtoken,updateuser)
itemsRouter.delete('/logout',vtoken,logout)
itemsRouter.put('/profilePic',vtoken,upload,profile)
itemsRouter.get('/logingetuser',vtoken,logingetuser)
itemsRouter.delete('/deleteuser/:id',vtoken,deleteuser)

//Admin
itemsRouter.get('/getallstaffs',vtoken,isAdmin,getallstaffs)
itemsRouter.get('/getallusers',vtoken,isAdmin,getallusers)
itemsRouter.put('/updatealluser',vtoken,isAdmin,updatealluser)
itemsRouter.put('/updateallstaff',vtoken,isAdmin,updateallstaff)
itemsRouter.delete('/deletealluser/:id', vtoken,isAdmin,deletealluser)
itemsRouter.delete('/deleteallstaff/:id', vtoken,isAdmin,deleteallstaff)

//staff
itemsRouter.post('/StaffWorkingHours',vtoken,isStaff,ondays)
itemsRouter.put('/updateStaff',vtoken,isStaff,updateSlot)
itemsRouter.delete('/DeleteStaff/:id',vtoken,isStaff,DaysSoftDelete)
itemsRouter.get('/getStaff',vtoken,isStaff,getDaysByEmail)

//availabul slots
itemsRouter.get('/getAppointment',vtoken,GetAppointment)

//booking
itemsRouter.post('/booking',vtoken,bookingSlots)
itemsRouter.put('/updateBooking',vtoken,updateBooking)
itemsRouter.get('/getBookingsByEmail',vtoken,getBookingsByEmail)
itemsRouter.delete('/DeleteBooking/:id',vtoken,softDelete)
