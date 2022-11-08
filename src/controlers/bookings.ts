import moment from 'moment-timezone';
//import moments from 'moment'
import mongoose from "mongoose";
import vtoken from "../mid/token"
//import { Times } from "../moduls/timesInterface";
import * as fs from 'fs'
import path from 'path'
import DaysModel from "../moduls/days"
import Joi from 'joi';
import SignupDt from '../moduls/signup';
import BookingModel from "../moduls/bookingModel"
import Days from "../moduls/daysInterface"
import days from "../moduls/days";
import { AnyNsRecord } from "dns";
import Booking from "../moduls/bookingModelInterface";
import nodemailer from "nodemailer"
import { Signup } from '../moduls/signupinterface';
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";

// user booking API
/**
 * @api {post} /booking booking slots
 * @apiGroup Booking
 * @apiBody (Request body) {String} TimeZone which timezone he is present
 * @apiBody (Request body) {String} email user email
 * @apiBody (Request body) {String} SlotsTime user Slot time
 * @apiBody (Request body) {Array} Service user service
 * @apiBody (Request body) {String} AppointmentDate user date Appointment
 * @apiBody (Request body) {String} name user name
 * @apiBody (Request body) {String} Duerication user Duerication of slot
 * @apiHeader {String} x-token Users unique access-key

 
 * @apiSuccessExample {json} Success-Response
 * HTTP/1.1 200 OK
 * {
 *           message: "slot booking sucess",
 *           result: { }
 * }
 *@apiSampleRequest /updateSlot
 *@apiErrorExample {json} Error-Response:
 *   HTTP/1.1 404 Not Found
 *     {
 *       "message": "User is not present"
 *     }
 * 
 *  HTTP/1.1 400
 * {
 *  status: false,
 * message: "date is grater then today"
 * }
 * HTTP/1.1 500 Internal Server Error
 */

 const bookingSlots = async (req: any, res: any) => {

    let user = await BookingModel.find({ TimeZone: req.body.TimeZone, AppointmentDate: req.body.AppointmentDate, email: req.body.email }, { "SlotsTime": "$SlotsTime" })
    let daysdata = await DaysModel.findOne({ email: req.body.email })
  
    if (!daysdata) {
      return res.status(404).json({
        status: false,
        message: "user is not present"
      })
    }
  
    let date = moment().tz(req.body.TimeZone).format('YYYY-MM-DD')
    console.log(date)
    let enterdat = moment(req.body.AppointmentDate).format('YYYY-MM-DD')
    console.log(enterdat)
    
    if (date > enterdat) {
      return res.status(400).json({
        status: false,
        message: "date is grater or equal to  today"
      })
    }
  
    //console.log(user)
    let allslots: any = []
    for (let i = 0; i < user.length; i++) {
      allslots.push(user[i].SlotsTime)
    }
    console.log(allslots.flat())
    const found = allslots.flat().some((r: any) => req.body.SlotsTime.indexOf(r) >= 0)
    //console.log(found)
    if (found) {
      return res.status(400).json({
        Status: false,
        message: 'Slot is already Booked'
      })
    };
  
    try {
      let BookingModels: Booking = new BookingModel({
        TimeZone: req.body.TimeZone,
        SlotsTime: req.body.SlotsTime,
        Service: req.body.Service,
        email: req.body.email,
        Name: req.body.Name,
        Duerication: req.body.Duerication,
        AppointmentDate: req.body.AppointmentDate
      })
      let slot: Booking = await BookingModels.save()
  
      let transporters = nodemailer.createTransport(
        {
          service: 'gmail',
          auth: {
            user: "kotavamsi16@gmail.com",
            pass: "mbjypwpxtpswciyp",
          },
          tls: {
            rejectUnauthorized: true,
          },
  
        }
      )
      let mailOptions: any = {
        from: "kotavamsi16@gmail.com",
        to: "vamsi.1255237@gmail.com",
        subject: "slot booked",
        text: `Hello ${slot.Name} your slot has been updated to ${slot.AppointmentDate} and slots will be at ${slot.SlotsTime} `,
      };
      transporters.sendMail(mailOptions, function (error: any, info: any) {
        if (error) {
          console.log(error);
        }
        console.log('Message sent: ' + info.response);
      })
      return res.status(200).json({
        message: "slot booking sucess",
        result: slot
      })
    }
  
    catch (error) {
      console.log(error)
      res.status(500).json({
        message: "internal server error"
      })
    }
  };
  
  // User updateBooking API
  /**
   * @api {put} /updateBooking update booking details
   * @apiGroup Booking
   * @apiBody (Request body) {String} email user email
   * @apiBody (Request body) {String} SlotsTime user Slot time
   * @apiBody (Request body) {Array} Service user service
   * @apiBody (Request body) {String} AppointmentDate user date Appointment
   * @apiBody (Request body) {String} name user name
   * @apiBody (Request body) {String} Duerication user Duerication of slot
   * 
   * @apiHeader {String} x-token Users unique access-key
  
   * @apiParamExample {json} Request-Example:
   *     {
   *       "email": " "
   *     }
   * 
   
   * @apiSuccessExample {json} Success-Response
   * HTTP/1.1 200 OK
   * {
   *           message: "slot booking sucess",
   *           result: { }
   * }
   *@apiSampleRequest /updateBooking
   *@apiErrorExample {json} Error-Response:
   *   HTTP/1.1 404 Not Found
   *     {
   *       "message": "User is not present"
   *     }
   * 
   * HTTP/1.1 500 Internal Server Error
   *  HTTP/1.1 400
   * {
   *  status: false,
   * message: "date is grater then today"
   * }
   */
  
  const updateBooking = async (req: any, res: any) => {
    try {
  
      let users: any = await BookingModel.findById(req.query.id);
      console.log(users.TimeZone)
      //console.log(use)
      if (!users) {
        //console.log("hello")
        return res.status(404).json({
          success: false,
          message: "user is not presnt",
        });
      }
      let daysdata = await DaysModel.findOne({ email: req.body.email })
      console.log("hello")
      //console.log(daysdata)
      if (!daysdata) {
        return res.status(404).json({
          status: false,
          message: "user is not present"
        })
      }
  
      if (users?.isDeleted) {
        return res.status(404).json({
          message: " user is not present "
        })
      }
  
      let date = moment().tz(users.TimeZone).format('YYYY-MM-DD')
      console.log(date)
      let enterdat = moment(req.body.AppointmentDate).format('YYYY-MM-DD')
      console.log(enterdat)
      if (date > enterdat) {
        return res.status(400).json({
          status: false,
          message: "date is grater then today"
        })
      }
      let user = await BookingModel.find({ TimeZone: users.TimeZone, email: req.body.email, AppointmentDate: req.body.AppointmentDate }, { "SlotsTime": "$SlotsTime" })
      //console.log(user)
      let allslots: any = []
      for (let i = 0; i < user.length; i++) {
        allslots.push(user[i].SlotsTime)
      }
      console.log(allslots.flat())
      const found = allslots.flat().some((r: any) => req.body.SlotsTime.indexOf(r) >= 0)
      console.log(found)
      if (found) {
        return res.status(400).json({
          Status: false,
          message: 'Slot is already Booked'
        })
      };
  
      const newUserData = {
        TimeZone: users.TimeZone,
        SlotsTime: req.body.SlotsTime || users.SlotsTime,
        Service: req.body.Service || users.Service,
        email: req.body.email || users.email,
        Name: req.body.Name || users.Name,
        Duerication: req.body.Duerication || users.Duerication,
        AppointmentDate: req.body.AppointmentDate || users.AppointmentDate
      }
  
      let data: any = await BookingModel.findByIdAndUpdate({ _id: req.query.id }, newUserData, {
        new: true,
        runValidators: false,
        userFindAndModify: true,
      });
      let transporters = nodemailer.createTransport(
        {
          service: 'gmail',
          auth: {
            user: "kotavamsi16@gmail.com",
            pass: "mbjypwpxtpswciyp",
          },
          tls: {
            rejectUnauthorized: true,
          },
  
        }
      )
      let mailOptions: any = {
        from: "kotavamsi16@gmail.com",
        to: "vamsi.1255237@gmail.com",
        subject: "your slot has been updated",
        text: `Hello ${data.Name} your slot has been updated to ${data.AppointmentDate} and slots will be at ${data.SlotsTime} `
      };
      transporters.sendMail(mailOptions, function (error: any, info: any) {
        if (error) {
          console.log(error);
        }
        console.log('Message sent: ' + info.response);
      })
      return res.status(200).json({
        message: "user updated successfully",
        result: data
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send("Hello Internal server");
    }
  };
  
  // user getBookingsByEmail API
  /**
   * @api {get} /getBookingsByEmail get booking details
   * @apiGroup Booking
   * 
   * @apiHeader {String} x-token Users unique access-key
  
  
   * @apiParamExample {json} Request-Example:
   *     {
   *       "email": " "
   *     }
   * 
   * @apiQuery {String} email email is in the string format
   
   * @apiSuccessExample {json} Success-Response
   * HTTP/1.1 200 OK
   * {
   *           message: "data",
   *           result: { }
   * }
   *@apiSampleRequest /getBookingsByEmail
   *@apiErrorExample {json} Error-Response:
   *   HTTP/1.1 404 Not Found
   *     {
   *        "success":false
   *       "message": "User is not present"
   *     }
   * 
   * HTTP/1.1 500 
   * {
   * message:"Internal Server Error",
   * error : { }
   * }
  
   */
  
  const getBookingsByEmail = async (req: any, res: any) => {
    try {
      let user = await BookingModel.find({ email: req.query.email, isDeleted: false })
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "user is not presnt",
        });
      }
      res.status(200).json({
        message: "data",
        result: user
      })
    } catch (error) {
      console.log(error)
      res.status(500).json({
        message: "internal server error",
        error: error
      })
    }
  }

  // user softDelete API
/**
 * @api {delete} /DeleteBooking/:id delete bookings
 * @apiGroup Booking
 * @apiHeader {String} x-token Users unique access-key

 * @apiParam {Number} id Users unique ID.

 * @apiParamExample {json} Request-Example:
 *     {
 *       "id": " "
 *     }
 * 
 
 * @apiSuccessExample {json} Success-Response
 * HTTP/1.1 200 OK
 * {
 *           message: "Your slot was deleted"
 * }
 *@apiSampleRequest /DeleteBooking/:id
 *@apiErrorExample {json} Error-Response:
 *   HTTP/1.1 404 Not Found
 *     {
 *        "success":false
 *       "message": "User is not present"
 *     }
 * 
 * HTTP/1.1 500 
 * {
 * message:"Internal Server Error",
 * error : { }
 * }

 */

const softDelete = async (req: any, res: any) => {
    debugger
    try {
      const users: any = await BookingModel.findById(req.params.id);
      console.log(users)
  
      if (!users) {
        return res.status(404).json({
          error: 'user is not present'
        });
      }
  
      if (users.isDeleted === true) {
        return res.status(404).json({
          error: 'user is not present'
        });
      }
      const softdelete = await BookingModel.findOneAndUpdate({ _id: users._id }, { isDeleted: true })
  
      let transporters = nodemailer.createTransport(
        {
          service: 'gmail',
          auth: {
            user: "kotavamsi16@gmail.com",
            pass: "mbjypwpxtpswciyp",
          },
          tls: {
            rejectUnauthorized: true,
          },
  
        }
      )
      let mailOptions: any = {
        from: "kotavamsi16@gmail.com",
        to: "vamsi.1255237@gmail.com",
        subject: "your slot deleted",
        text: `Hello ${users.Name} your slot has been deleted`,
      };
      transporters.sendMail(mailOptions, function (error: any, info: any) {
        if (error) {
          console.log(error);
        }
        console.log('Message sent: ' + info.response);
      })
      res.status(200).json({
        message: "Your slot was deleted"
      
      });
    }
    catch (error) {
      res.status(500).json({
        message:"Internal Server Error",
        error: error
      });
    }
  };

  export { softDelete, bookingSlots, updateBooking ,getBookingsByEmail }