/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

//import { Times } from "../moduls/timesInterface";
import * as fs from "fs";
import TokenDt from "../moduls/tokenT";
import path from "path";
import SigninDt from "../moduls/login";
import DaysModel from "../moduls/days";
import Joi from "joi";
import SignupDt from "../moduls/signup";
import BookingModel from "../moduls/bookingModel";
import Days from "../moduls/daysInterface";
import days from "../moduls/days";
import { AnyNsRecord } from "dns";
import Booking from "../moduls/bookingModelInterface";
import nodemailer from "nodemailer";
import { Signup } from "../moduls/signupinterface";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import tokenT from "../moduls/tokenT";

//signup api

/**
 * @api {post} /Signup create a new user
 * @apiGroup users
 * @apiBody (Request body) {String} firstname first name of the user
 * @apiBody (Request body) {String} lastname of the user
 * @apiBody (Request body) {String} email user email
 * @apiBody (Request body) {String} password user password
 * @apiBody (Request body) {String} confirmPassword user name
 *
 * @apiSampleRequest /Signup 
 * @apiSuccessExample {json} Success-Response
 * HTTP/1.1 200 OK
 * {
 *       message: "user successfully register",
 *
 * }
 * @apiErrorExample {json} Error-Response:
 *   HTTP/1.1 404 Not Found
 *     {
 *       "message": "User is already present"
 *     }
 *
 *  HTTP/1.1 400
 *  {
 *    "message":"password and confirmpassword should be same"
 *  }
 *  HTTP/1.1 500
 * {
 * "message":"Internal Server Error"
 * }
 *
 */

const signup = async (req: any, res: any) => {
  const salt = bcrypt.genSaltSync(10);

  const schema = Joi.object().keys({
    email: Joi.string()
      .lowercase()
      .trim()
      .max(320)
      .email({ minDomainSegments: 2 })
      .required(),
    firstname: Joi.string().trim().max(70).required(),
    lastname: Joi.string().trim().max(70).required(),
    password: Joi.string().trim().min(8).max(70).required(),
    confirmPassword: Joi.string().trim().min(8).max(70).required(),
  });

  const { firstname, lastname, email, password, confirmPassword } = req.body;
  schema
    .validateAsync({ firstname, lastname, email, password, confirmPassword })
    .then(async (val) => {
      req.body = val;
    })
    // .catch((err) => {
    //   console.log("Failed to validate input " + err.details[0].message);

    //   const k: any = err.details[0].message;
    //   return res.status(400).send(k); 
    // });

  try {
    //const {image} =  req.file.filename
    const hass = bcrypt.hashSync(password, salt);
    const conHass = bcrypt.hashSync(confirmPassword, salt);
    const exist = await SignupDt.findOne({ email });

    if (exist) {
      return res.status(404).json({ message: "User is already present" });
    }

    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ message: " password and confirmpassword should be same" });
    }

    const newUser = new SignupDt({
      firstname,
      lastname,
      email,
      password: hass,
      confirmPassword: conHass,
    });
    // res.status(400).send(k)

    await newUser.save();

    return res.status(200).json({
      message: "user successfully register",
    });
  } catch (error) {
    console.log(error);
    return res.send(500).json({
      message: "internal server error",
    });
  }
};

//Signin

/**
 * @api {post} /Signin signin user
 * @apiGroup users
 * @apiBody (Request body) {String} email user email
 * @apiBody (Request body) {String} password user password
 *
 * @apiSampleRequest /Signin
 * @apiSuccessExample {json} Success-Response
 * HTTP/1.1 200 OK
 * {
 *      "token": " ",
 *      "id": " ",
 *      "email": "",
 *      "isAdmin": "",
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
 *    "message":"password went wrong"
 *  }
 *  HTTP/1.1 500
 * {
 * "message":"Internal Server Error"
 * }
 *
 */

const signin = async (req: any, res: any) => {
  try {
    const { email, password } = req.body;

    const exist: any =await SignupDt.findOne({ email });
   
    
    if (!exist) {
      return res
        .status(404) 
        .json({ Message: "user is not present in our Database" });
    }
    const token:any = await TokenDt.findOneAndUpdate({userId:exist.id},{status:'D'},{ sort: { _id: -1 } })

    const isPasswordCorrect = await bcrypt.compare(password, exist.password);

    //console.log(exist)

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "password went wrong" });
    }

    const payload = {
      user: {
        id: exist.id,
      },
    };

    jwt.sign(
      payload,
      "vamsi",
      { expiresIn: 60 * 60 * 1000 },
      async (err, token) => {
        if (err) {
          console.log(err);
        }

        const user: any = await TokenDt.create(
          { token: token, userId: exist._id },
          
        )
      
        return await res.json({
          token: token,
          id: exist._id,
          email: exist.email,
          role: exist.role,
          data:user
        });
      }
    );
    //return res.json(exist)
  } catch (error) {
    console.log(error);
    return res.send(500).json({ message: "Internal server" });
  }
};

//update user

/**
 * @api {put} /updateuser update user
 * @apiGroup users
 * @apiBody (Request body) {String} firstname user firstname
 * @apiBody (Request body) {String} lastname user lastname
 *
 *
 * @apiSampleRequest /updateuser
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
 *             "email":" "
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
 *  HTTP/1.1 500
 * {
 * "message":"Internal Server Error"
 * }
 *
 */

const updateuser = async (req: any, res: any) => {
  try {
    const users: any = await SignupDt.findOne({ email: req.query.email });
    if (!users) {
      return res.status(404).json({
        success: false,
        message: "user is not present",
      });
    }
    if (users?.isDeleted) {
      return res.status(404).json({
        message: "user is not present",
      });
    }
    const salt = bcrypt.genSaltSync(10);
    const password = req.body.password || users.password;
    const confirmPassword = req.body.confirmPassword || users.confirmPassword;

    if (password !== confirmPassword) {
      return res
        .status(400)
        .send(" password and confirmpassword should be same");
    }

    const hass = bcrypt.hashSync(password, salt);
    const conHass = bcrypt.hashSync(confirmPassword, salt);

    const newUserData = {
      email: users.email,
      firstname: req.body.firstname || users.firstname,
      lastname: req.body.lastname || users.lastname,
    };

    const user = await SignupDt.findOneAndUpdate(
      { email: req.query.email },
      newUserData,
      {
        new: true,
        runValidators: false,
        userFindAndModify: true,
      }
    );
    return res.status(200).json({
      message: "user updated sucessfully",
      result: user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal server");
  }
};

//logOut

/**
 * @api {delete} /logout user logout 
 * @apiGroup users
 * 
 * @apiSampleRequest /logout
 * 
 * @apiHeader {String} x-token Users unique access-key
 * 
 * @apiSuccessExample {json} Success-Response
 * HTTP/1.1 200 OK
 * {
 *    "message":"deleted successfully"
 *          
 * }
 * @apiErrorExample {json} Error-Response:
 *
 *  HTTP/1.1 500 
 * {
 * "message":"Internal Server Error"
 * }
 * 
 */


const logout =async (req:any,res:any) => {
 try {
  const user = await tokenT.findOneAndDelete({token:req.header('x-token')})
  return await res.status(200).json({ 
    message:"deleted successfully" 
   })
 } catch (error) {
  return await res.status(500).json({ 
    error : "internal server error"
   })
 }
}

//logingetuser

/**
 * @api {get} /logingetuser get user detiles
 * @apiGroup users
 *
 * @apiSampleRequest /logingetuser
 *
 * @apiQuery {String} email email is in the string format
 * @apiHeader {String} x-token Users unique access-key
 *
 * @apiSuccessExample {json} Success-Response
 * HTTP/1.1 200 OK
 * {
 *    "message":"data"
 *     "result ": {
 *              "id":" ",
 *              "firstname": " ",
 *              "lastname": " ",
 *              "password": " ",
 *              "confirmPassword": " ",
 *              "isAdmin":" "
 *    }
 *
 * }
 * @apiErrorExample {json} Error-Response:
 *   HTTP/1.1 404 Not Found
 *     {
 *       "message": "user is not present"
 *     }
 *
 *  HTTP/1.1 500
 * {
 * "message":"Internal Server Error"
 * "error":" "
 * }
 *
 */

const logingetuser = async (req: any, res: any) => {
  try {
    const user = await SignupDt.find({
      email: req.query.email,
      isDeleted: false,
    });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "user is not presnt",
      });
    }

    res.status(200).json({
      message: "data",
      result: user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "internal error",
      error: error,
    });
  }
};

/**
 * @api {delete} /deleteuser/:id delete a user
 * @apiGroup users
 * 
 * @apiSampleRequest /deleteuser/:id
 * 
 * @apiParam {Number} id Users unique ID.

 * @apiParamExample {json} Request-Example:
 *     {
 *       "id": " "
 *     }
 *
 * @apiHeader {String} x-token Users unique access-key
 * 
 * @apiSuccessExample {json} Success-Response
 * HTTP/1.1 200 OK
 * {
 *    "message":"deleted successfully"
 *          
 * }
 * @apiErrorExample {json} Error-Response:
 *   HTTP/1.1 404 Not Found
 *     {
 *       "message": "user is not present"
 *     }
 *
 *  HTTP/1.1 500 
 * {
 * "message":"Internal Server Error"
 * "error":" "
 * }
 * 
 */

const deleteuser = async (req: any, res: any) => {
  try {
    const users: any = await SignupDt.findById(req.params.id);
    console.log(users);
    if (!users) {
      return res.status(404).json({
        success: false,
        error: "user not present",
      });
    }
    if (users.isDeleted === true) {
      return res.status(404).json({
        success: false,
        error: "user not present",
      });
    }
    const softdelete = await SignupDt.findOneAndUpdate(
      { _id: users._id },
      { isDeleted: true }
    );
    res.status(200).json({
      message: "deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      error: error,
    });
  }
};

/**
 * @api {put} /profilePic profilePic
 * @apiGroup users
 * @apiBody (Request body) {file} image user profilePic
 *
 *
 * @apiSampleRequest /profilePic
 *
 * @apiQuery {String} email email is in the string format
 * @apiHeader {String} x-token Users unique access-key
 *
 * @apiSuccessExample {json} Success-Response
 * HTTP/1.1 200 OK
 * {
 *    "message":"profile update sucessfully"
 *              " result ": {
 *              "id":" ",
 *              "firstname": " ",
 *              "lastname": " ",
 *              "password": " ",
 *              "confirmPassword": " ",
 *              "image":" ",
 *              "role":" "
 *    }
 *
 * }
 * @apiErrorExample {json} Error-Response:
 *   HTTP/1.1 404 Not Found
 *     {
 *       "message": "user is not present in our Database"
 *     }
 *
 *
 *  HTTP/1.1 500
 * {
 * "message":"Internal Server Error"
 * }
 *
 */

const profile = async (req: any, res: any, next: any) => {
  try {
    const userd: any = await SignupDt.findOne({ email: req.query.email });

    if (!userd) {
      return res.status(404).json({
        success: false,
        message: "user is not present in our Database",
      });
    }
    //console.log(req.params.id)
    // console.log(req.file.filename)

    //image:req.file.filename

    const user = await SignupDt.findOneAndUpdate(
      { email: req.query.email },
      { image: req.file.filename },
      {
        new: true,
        runValidators: true,
        userFindAndModify: false,
      }
    );

    res.status(200).send({
      message: "profile update sucessfully",
      result: user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export { signup, updateuser, logingetuser, deleteuser, signin, logout ,profile };
