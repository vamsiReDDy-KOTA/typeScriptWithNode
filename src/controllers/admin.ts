/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
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

//getallstaffs

/**
 * @api {get} /getallstaffs get all staff details
 * @apiGroup Admin
 * 
 * @apiSampleRequest /getallstaffs
 * 
 * @apiHeader {String} x-token Users unique access-key
 * 
 * @apiSuccessExample {json} Success-Response
 * HTTP/1.1 200 OK
 * {
 *    "message":"data"
 *    "result" : "get all staff details"
 *        
 * }
 * @apiErrorExample {json} Error-Response:
 *   
 *
 *  HTTP/1.1 403 "Access denied"
 * 
 *  HTTP/1.1 500 
 * {
 * "message":"Internal Server Error"
 * }
 * 
 */

 const getallstaffs =async (req:any,res:any) => {
    try {
      const user = await DaysModel.find({isDeleted: false })
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
  
  //get all users
  
  /**
   * @api {get} /getallusers get all user details
   * @apiGroup Admin
   * 
   * @apiSampleRequest /getallusers
   * 
   * @apiHeader {String} x-token Users unique access-key
   * @apiQuery {String} email the email used for filter
   * 
   * @apiSuccessExample {json} Success-Response
   * HTTP/1.1 200 OK
   * {
   *    "message":"data"
   *    "result" : "get all users details"
   *        
   * }
   * @apiErrorExample {json} Error-Response:
   *   
   *
   *  HTTP/1.1 403 "Access denied"
   * 
   *  HTTP/1.1 500 
   * {
   * "message":"Internal Server Error"
   * }
   * 
   */
  
  const getallusers =async (req:any,res:any) => {
    try {
  
      let query
  
     
      const searchFild = req.query.email
  
      const user = await SignupDt.find({isDeleted: false , $or:[ {email:{$regex:searchFild,$options:'$i'}} ]  } )
  
      /**
       try {
    let query;
  
  
    const searchFild = req.query.username
  
    const search = await vamsi.find({
      $or:[
      {username:{$regex:searchFild,$options:'$i'}}
      ]
    })
  
  
    let uiValues = {
      filtering: {},
      sorting: {},
    };
  
    const reqQuery = { ...req.query };
  
    const removeFields = ["sort"];
  
    removeFields.forEach((val) => delete reqQuery[val]);
  
    const filterKeys = Object.keys(reqQuery);
    const filterValues = Object.values(reqQuery);
  
    filterKeys.forEach(
      (val, idx) => (uiValues.filtering[val] = filterValues[idx])
    );
  
    let queryStr = JSON.stringify(reqQuery);
  
    queryStr = queryStr.replace(
      /\b(gt|gte|lt|lte|in)\b/g,
      (match) => `$${match}`
    );
  
    query = vamsi.find(JSON.parse(queryStr));
  
    if (req.query.sort) {
      const sortByArr = req.query.sort.split(",");
  
      sortByArr.forEach((val) => {
        let order;
  
        if (val[0] === "-") {
          order = "descending";
        } else {
          order = "ascending";
        }
  
        uiValues.sorting[val.replace("-", "")] = order;
      });
  
      const sortByStr = sortByArr.join(" ");
  
      query = query.sort(sortByStr);
    } else {
      query = query.sort("-fullname");
    }
  
    const bootcamps = await query;
  
    const maxPrice = await vamsi.find()
      .sort({ fullname: -1 })
      .limit(1)
      .select("-_id fullname");
  
    const minPrice = await vamsi.find()
      .sort({ fullname: 1 })
      .limit(1)
      .select("-_id fullname");
  
    uiValues.maxPrice = maxPrice[0].price;
    uiValues.minPrice = minPrice[0].price;
  
      //let allprofiles = await vamsi.find();
      return res.status(200).json({
        success: true,
        data: bootcamps,
        sea:search,
        uiValues,
      });
       */
  
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
  
  //update all users 
  
  /**
   * @api {put} /updatealluser update user
   * @apiGroup Admin
   * @apiBody (Request body) {String} firstname user firstname
   * @apiBody (Request body) {String} lastname user lastname
   * @apiBody (Request body) {String} password user password
   * @apiBody (Request body) {String} confirmPassword user confirmPassword
   * @apiBody (Request body) {String} role user role
   * 
   * @apiSampleRequest /updatealluser
   * 
   * @apiQuery {String} email email is in the string format
   * @apiHeader {String} x-token Users unique access-key
   * 
   * @apiSuccessExample {json} Success-Response
   * HTTP/1.1 200 OK
   * {
   *    "message":"user update sucessfully"
   *              " result ": {
   *              "firstname": " ",
   *              "lastname": " ",
   *              "password": " ",
   *              "confirmPassword": " ",
   *              "role":" ",
   *    }
   *        
   * }
   * @apiErrorExample {json} Error-Response:
   *   HTTP/1.1 404 Not Found
   *     {
   *       "message": "user is not present in our Database"
   *     }
   *
   *  HTTP/1.1 400 
   *  {
   *    "message":"password and confirmpassword should be same"
   *  }
   * 
   *  HTTP/1.1 500 
   * {
   *    "message":"Internal Server Error"
   * }
   * 
   */
  
   const updatealluser =async (req:any,res:any) => {
    try {
      const users: any = await SignupDt.find({email: req.query.email,isDeleted: false});
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
        
        email: users.email,
        firstname: req.body.firstname || users.firstname,
        lastname: req.body.lastname || users.lastname,
      
        role:req.body.role || users.role
      };
  
      const user = await SignupDt.findOneAndUpdate({ email: req.query.email }, newUserData, {
        new: true,
        runValidators: false,
        userFindAndModify: true,
      });
      return res.status(200).json({
        message: "user updated sucessfully",
        result: user
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send("Internal server");
    }
  }
  
  const updateallstaff =async (req:any,res:any) => {
    try {
      const users: any = await DaysModel.find({email: req.query.email,isDeleted: false});
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
        message: "user updated sucessfully",
        result: user
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send("Internal server");
    }
  }
  //delete all user
  
  /**
   * @api {delete} /deletealluser/:id delete user by id
   * @apiGroup Admin
   
   * @apiParam {Number} id Users unique ID.
   * @apiHeader {String} x-token Users unique access-key
  
  
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
   *@apiSampleRequest /deletealluser/:id
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
  
  const deletealluser =async (req:any , res:any) => {
    try {
      const users: any = await SignupDt.findById(req.params.id);
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
      const softdelete = await SignupDt.findOneAndUpdate({ _id: users._id }, { isDeleted: true })
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
  }

  const deleteallstaff =async (req:any , res:any) => {
    try {
      const users: any = await DaysModel.findById(req.params.id);
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
      const softdelete = await DaysModel.findOneAndUpdate({ _id: users._id }, { isDeleted: true })
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
  }

  export {  deletealluser ,updatealluser ,getallusers,getallstaffs,deleteallstaff ,updateallstaff}