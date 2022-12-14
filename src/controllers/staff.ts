/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
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

// Staff Days API
/**
 * @api {post} /StaffWorkingHours staff working hours
 * @apiGroup Staff
 * @apiBody (Request body) {String} TimeZone which timezone he is present
 * @apiBody (Request body) {String} email Staff email
 * @apiBody (Request body) {String} phoneNo Staff phoneNo
 * @apiBody (Request body) {String} name Staff name
 * @apiBody (Request body) {Array} [Monday] [startTime][endTime][breakTime] Times that the staff will be avalibul on monday
 * @apiBody (Request body) {Array} [Tuesday] [startTime][endTime][breakTime] Times that the staff will be avalibul on Tuesday
 * @apiBody (Request body) {Array} [Wednesday] [startTime][endTime][breakTime] Times that the staff will be avalibul on Wednesday
 * @apiBody (Request body) {Array} [Thursday] [startTime][endTime][breakTime] Times that the staff will be avalibul on Thursday
 * @apiBody (Request body) {Array} [Friday] [startTime][endTime][breakTime] Times that the staff will be avalibul on Friday
 * @apiBody (Request body) {Array} [Saturday] [startTime][endTime][breakTime] Times that the staff will be avalibul on Saturday
 * @apiBody (Request body) {Array} [Sunday] [startTime][endTime][breakTime] Times that the staff will be avalibul on Sunday
 * 
 * @apiHeader {String} x-token Users unique access-key

 * @apiSuccessExample {json} Success-Response
 * HTTP/1.1 200 OK
 * {
 *       message: "successfully posted",
 *        result: { }
 * }
 *@apiSampleRequest /StaffWorkingHours
 *@apiErrorExample {json} Error-Response:
 *   HTTP/1.1 404 Not Found
 *    {
 *      "message":"user is not present pleace signup"
 *    }
 *   HTTP/1.1 400
 *     {
 *       "message": "User is already present"
 *     }
 * 
 * HTTP/1.1 500 Internal Server Error
 */

 const ondays = async (req: any, res: any) => {

    try {
      const data = await SignupDt.findOne({ email: req.body.email })

      const StartDate =moment.utc(req.body.StartDate).format("dddd");
     // console.log(StartDate)
      if(StartDate !='Sunday'){
        return res.status(400).send("Start Date should be starting day of the week")
      }
      const Start =moment.utc(req.body.StartDate).format();
      
      console.log(Start)
      console.log(StartDate)

      const ds = moment.utc(req.body.StartDate).add(1, 'week').format("DD-MM-YYYY");
      const da = moment.utc(req.body.StartDate).format("DD-MM-YYYY");
      const ts = moment().tz(req.body.TimeZone).format("DD-MM-YYYY");

      console.log(ds)

      const va= ts<=da

      //console.log(va)

      if(da<ts){
        return res.status(400).send("upgrade the StartDate")
      }

      if(!va){
        return res.status(400).send("date should be graterthen or equal to today")
      }
      
      if(!data){
        return res.status(404).json({
          message:"user is not present pleace signup"
        })
      }
      
      const user = await DaysModel.findOne({ email: req.body.email })
      if(user){
        return res.status(400).json({
          message:"user is already present"
        })
      }

      
      const DaysModels: Days = new DaysModel({
        TimeZone: req.body.TimeZone,
        email: req.body.email,
        phoneNo: req.body.phoneNo,
        name: req.body.name,
        StartDate:req.body.StartDate,
        repectForWeek:req.body.repectForWeek,
        Monday: req.body.Monday,
        Tuesday: req.body.Tuesday,
        Wednesday: req.body.Wednesday,
        Thursday: req.body.Thursday,
        Friday: req.body.Friday,
        Saturday: req.body.Saturday,
        Sunday: req.body.Sunday,
      })
      const newDays: Days = await DaysModels.save()
  
      res.status(200).json({
        message: "successfully posted",
        result: newDays
      })
  
    } catch (error) {
      console.log(error)
      res.status(500).json({
        message: "internal server error"
      })
    }
  }

  // Staff updateSlot API
/**
 * @api {put} /updateSlot update staff working hours
 * @apiGroup Staff
 * @apiBody (Request body) {String} TimeZone which timezone he is present
 * @apiBody (Request body) {String} email Staff email
 * @apiBody (Request body) {String} phoneNo Staff phoneNo
 * @apiBody (Request body) {String} name Staff name
 * @apiBody (Request body) {Array} [Monday] [startTime][endTime][breakTime] Times that the staff will be avalibul on monday
 * @apiBody (Request body) {Array} [Tuesday] [startTime][endTime][breakTime] Times that the staff will be avalibul on Tuesday
 * @apiBody (Request body) {Array} [Wednesday] [startTime][endTime][breakTime] Times that the staff will be avalibul on Wednesday
 * @apiBody (Request body) {Array} [Thursday] [startTime][endTime][breakTime] Times that the staff will be avalibul on Thursday
 * @apiBody (Request body) {Array} [Friday] [startTime][endTime][breakTime] Times that the staff will be avalibul on Friday
 * @apiBody (Request body) {Array} [Saturday] [startTime][endTime][breakTime] Times that the staff will be avalibul on Saturday
 * @apiBody (Request body) {Array} [Sunday] [startTime][endTime][breakTime] Times that the staff will be avalibul on Sunday
 * @apiHeader {String} x-token Users unique access-key

 * 
 * @apiParamExample {json} Request-Example:
 *     {
 *       "email": " "
 *     }
 * 
 * @apiQuery {String} email email is in the string format
 
 
 * @apiSuccessExample {json} Success-Response
 * HTTP/1.1 200 OK
 * {
 *         message: "user updated sucessfully",
 *         result: {  }
 * }
 *@apiSampleRequest /updateSlot
 *@apiErrorExample {json} Error-Response:
 *   HTTP/1.1 404 Not Found
 *     {
 *       "message": "User is not present"
 *     }
 * 
 * HTTP/1.1 500 Internal Server Error
 */

const updateSlot = async (req: any, res: any) => {
    try {
      
      const users: any = await DaysModel.findOne({ email: req.query.email,StartDate:req.query.StartDate});
      //console.log(users)
      const datas = users?.repectForWeek
      
      if(!datas){ 
       // eslint-disable-next-line no-var
       var ds:any = moment.utc(users.StartDate).add(1, 'week').format("DD-MM-YYYY");
      } 
      console.log(ds)
      const Startdates = moment.utc(req.body.StartDate).format("DD-MM-YYYY")
      console.log(Startdates)
      const daya = Startdates<ds
      const day = Startdates==ds
      console.log(day)
      console.log(daya)
      if(!day){
        return res.status(400).send("start date is grater then lastWeek")
      }
      
      const StartDate =moment.utc(req.body.StartDate).format("dddd");
      console.log(StartDate)
      const daa = StartDate =='Sunday'
      console.log(daa)
       if(!daa){
         return res.status(400).send("Start Date should be starting day of the week")
       }
         
      
      const da = moment.utc(req.body.StartDate).format("DD-MM-YYYY");
      const ts = moment.utc().tz(req.body.TimeZone).format("DD-MM-YYYY");
      const updateDate = req.query.updateDate
      const udDate =  moment(updateDate).tz(req.body.TimeZone).format("DD-MM-YYYY");

      console.log(udDate)

      // const va= ts<=da

      // console.log(va)

      // if(!va){
      //   return res.status(400).send("date should be graterthen or equal to today")
      // }
      if (!users) {
        return res.status(404).json({
          success: false,
          message: "user is not present",
        });
      }
      if (users?.isDeleted) {
        return res.status(404).json({
          message: "user is not present"
        })
      }
      const newUserData = {
        TimeZone: req.body.TimeZone || users.TimeZone,
        email: users.email,
        phoneNo: req.body.phoneNo || users.phoneNo,
        name: req.body.name || users.name,
        StartDate:req.body.StartDate || users.StartDate,
        repectForWeek : req.body.repect || users.repectForWeek,
        Monday: req.body.Monday || users.Monday,
        Tuesday: req.body.Tuesday || users.Tuesday,
        Wednesday: req.body.Wednesday || users.Wednesday,
        Thursday: req.body.Thursday || users.Thursday,
        Friday: req.body.Friday || users.Friday,
        Saturday: req.body.Saturday || users.Saturday,
        Sunday: req.body.Sunday || users.Sunday,
      };


      const user = await DaysModel.findOneAndUpdate({ email: req.query.email }, newUserData, {
        new: true,
        runValidators: false,
        userFindAndModify: true,
      });
      return res.status(200).json({
        message: "staff updated sucessfully",
        result: user
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send("Internal server");
    }
  };

  // user DaysSoftDelete API

/**
 * @api {delete} /DeleteStaff/:id  delete staff 
 * @apiGroup Staff
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
 *@apiSampleRequest /DeleteStaff/:id
 *@apiErrorExample {json} Error-Response:
 *   HTTP/1.1 404 Not Found
 *     {
 *        "success":false
 *       "message":  "Staff dose not present"
 *     }
 * 
 * HTTP/1.1 500 
 * {
 * message:"Internal Server Error",
 * error : { }
 * }

 */

const DaysSoftDelete = async (req: any, res: any) => {
    try {
      //const users: any = await DaysModel.findById(req.params.id);
      const users: any = await DaysModel.findOne({ email: req.query.email ,StartDate:req.query.StartDate })
      console.log(users)
      if (!users) {
        return res.status(404).json({
          "success":false,
          error: "Staff dose not present"
        })
      }
      if (users.isDeleted === true) {
        return res.status(404).json({
          "success":false,
          error:  "Staff dose not present"
        });
      }
      const softdelete = await DaysModel.findOneAndUpdate({  email: req.query.email }, { isDeleted: true })
      res.status(200).json({
        message: "deleted success",
        //data: softdelete
      });
    }
    catch (error) {
      res.status(500).json({
        message:"Internal Server Error",
        error: error
      });
    }
  };

  // staff getDaysByEmail API
/**
 * @api {get} /getDaysByEmail get staff details
 * @apiGroup Staff
 * @apiHeader {String} x-token Users unique access-key

 * @apiParamExample {json} Request-Example:
 *     {
 *       "email": " "
 *     }
 * 
 * @apiQuery {String} email email is in the string format
 * 
 
 * @apiSuccessExample {json} Success-Response
 * HTTP/1.1 200 OK
 * {
 *           message: "data",
 *           result: { }
 * }
 *@apiSampleRequest /getDaysByEmail
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

const getDaysByEmail = async (req: any, res: any) => {
    try {
     // let user = await DaysModel.find({ email: req.query.email, isDeleted: false })
      const users: any = await DaysModel.findOne({ email: req.query.email , StartDate:req.query.StartDate },{isDeleted: false })
      if (!users) {
        return res.status(400).json({
          success: false,
          message: "user is not presnt",
        });
      }
  
      return res.status(200).json({
        message: "data",
        result: users
      })
    } catch (error) {
      console.log(error)
      res.status(500).json({
        message: "internal error",
        error: error
      })
    }
  }

  export { ondays ,updateSlot, DaysSoftDelete, getDaysByEmail }