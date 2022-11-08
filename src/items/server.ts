
// import moment from 'moment-timezone';
// //import moments from 'moment'
// import mongoose from "mongoose";
// import vtoken from "../mid/token"
// //import { Times } from "../moduls/timesInterface";
// import * as fs from 'fs'
// import path from 'path'
// import DaysModel from "../moduls/days"
// import Joi from 'joi';
// import SignupDt from '../moduls/signup';
// import BookingModel from "../moduls/bookingModel"
// import Days from "../moduls/daysInterface"
// import days from "../moduls/days";
// import { AnyNsRecord } from "dns";
// import Booking from "../moduls/bookingModelInterface";
// import nodemailer from "nodemailer"
// import { Signup } from '../moduls/signupinterface';
// import bcrypt from "bcrypt"
// import jwt from "jsonwebtoken";



// //Signin

// /**
//  * @api {post} /Signin signin user
//  * @apiGroup users
//  * @apiBody (Request body) {String} email user email
//  * @apiBody (Request body) {String} password user password
//  * 
//  * @apiSampleRequest /Signin
//  * @apiSuccessExample {json} Success-Response
//  * HTTP/1.1 200 OK
//  * {
//  *      "token": " ",
//  *      "id": " ",
//  *      "email": "",
//  *      "isAdmin": "",
//  *        
//  * }
//  * @apiErrorExample {json} Error-Response:
//  *   HTTP/1.1 404 Not Found
//  *     {
//  *       "message": "user is not present in our Database"
//  *     }
//  *
//  *  HTTP/1.1 400 
//  *  {
//  *    "message":"password went wrong"
//  *  }
//  *  HTTP/1.1 500 
//  * {
//  * "message":"Internal Server Error"
//  * }
//  * 
//  */

// const signin = async (req:any, res:any) => {
//   try {
//     const { email, password } = req.body;

//     let exist : any = await SignupDt.findOne({ email });

//     if (!exist) {
//       return res.status(404).json({"Message":"user is not present in our Database"});
//     }

//     const isPasswordCorrect =  bcrypt.compare(password, exist.password);

//     //console.log(exist)

//     if (!isPasswordCorrect) {
//       return res.status(400).json({"message":"password went wrong"});
//     }

//     let payload = {
//       user: {
//         id: exist.id,
//       },
//     };

//     jwt.sign(
//       payload,
//       "vamsi",
//       { expiresIn: 60 * 60 * 1000 },
//       async (err, token) => {
//         if (err) {
//           console.log(err);
//         }
//         return await res.json({
//           token: token,
//           id: exist._id,
//           email: exist.email,
//           isAdmin: exist.isAdmin,
//         });
//       }
//     );
//     //return res.json(exist)
//   } catch (error) {
//     console.log(error);
//     return res.send(500).json({"message":"Internal server"});
//   }
// }

// //update user

// /**
//  * @api {put} /updateuser update user
//  * @apiGroup users
//  * @apiBody (Request body) {String} firstname user firstname
//  * @apiBody (Request body) {String} lastname user lastname
//  * @apiBody (Request body) {String} password user password
//  * @apiBody (Request body) {String} confirmPassword user confirmPassword
//  * 
//  * @apiSampleRequest /updateuser
//  * 
//  * @apiQuery {String} email email is in the string format
//  * @apiHeader {String} x-token Users unique access-key
//  * 
//  * @apiSuccessExample {json} Success-Response
//  * HTTP/1.1 200 OK
//  * {
//  *    "message":"user update sucessfully"
//  *              " result ": {
//  *              "firstname": " ",
//  *              "lastname": " ",
//  *              "password": " ",
//  *              "confirmPassword": " "
//  *    }
//  *        
//  * }
//  * @apiErrorExample {json} Error-Response:
//  *   HTTP/1.1 404 Not Found
//  *     {
//  *       "message": "user is not present in our Database"
//  *     }
//  *
//  *  HTTP/1.1 400 
//  *  {
//  *    "message":"password and confirmpassword should be same"
//  *  }
//  *  HTTP/1.1 500 
//  * {
//  * "message":"Internal Server Error"
//  * }
//  * 
//  */

// const updateuser =async (req:any,res:any) => {
//   try {
//     let users: any = await SignupDt.findOne({ email: req.query.email });
//     if (!users) {
//       return res.status(404).json({
//         success: false,
//         message: "user is not present",
//       });
//     }
//     if (users?.isDeleted) {
//       return res.status(404).json({
//         message: "user is not present"
//       })
//     }
//     const salt = bcrypt.genSaltSync(10);
//     let password = req.body.password || users.password
//     let confirmPassword = req.body.confirmPassword || users.confirmPassword

//     if (password !== confirmPassword) {
//       return res
//         .status(400)
//         .send(" password and confirmpassword should be same");
//     }

//     const hass = bcrypt.hashSync(password, salt);
//     const conHass = bcrypt.hashSync(confirmPassword, salt);

//     const newUserData = {
      
//       email: users.email,
//       firstname: req.body.firstname || users.firstname,
//       lastname: req.body.lastname || users.lastname,
//       password: hass,
//       confirmPassword: conHass,
   
//     };
   
//     const user = await SignupDt.findOneAndUpdate({ email: req.query.email }, newUserData, {
//       new: true,
//       runValidators: false,
//       userFindAndModify: true,
//     });
//     return res.status(200).json({
//       message: "user updated sucessfully",
//       result: user
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).send("Internal server");
//   }
// }

// //logingetuser

// /**
//  * @api {get} /logingetuser get user detiles
//  * @apiGroup users
//  * 
//  * @apiSampleRequest /logingetuser
//  * 
//  * @apiQuery {String} email email is in the string format
//  * @apiHeader {String} x-token Users unique access-key
//  * 
//  * @apiSuccessExample {json} Success-Response
//  * HTTP/1.1 200 OK
//  * {
//  *    "message":"data"
//  *     "result ": {
//  *              "id":" ",
//  *              "firstname": " ",
//  *              "lastname": " ",
//  *              "password": " ",
//  *              "confirmPassword": " ",
//  *              "isAdmin":" "
//  *    }
//  *        
//  * }
//  * @apiErrorExample {json} Error-Response:
//  *   HTTP/1.1 404 Not Found
//  *     {
//  *       "message": "user is not present"
//  *     }
//  *
//  *  HTTP/1.1 500 
//  * {
//  * "message":"Internal Server Error"
//  * "error":" "
//  * }
//  * 
//  */

// const logingetuser =async (req:any,res:any) => {
//   try {
//     let user = await SignupDt.find({ email: req.query.email, isDeleted: false })
//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "user is not presnt",
//       });
//     }

//     res.status(200).json({
//       message: "data",
//       result: user
//     })
//   } catch (error) {
//     console.log(error)
//     res.status(500).json({
//       message: "internal error",
//       error: error
//     })
//   }
// }

// /**
//  * @api {delete} /deleteuser/:id delete a user
//  * @apiGroup users
//  * 
//  * @apiSampleRequest /deleteuser/:id
//  * 
//  * @apiParam {Number} id Users unique ID.

//  * @apiParamExample {json} Request-Example:
//  *     {
//  *       "id": " "
//  *     }
//  *
//  * @apiHeader {String} x-token Users unique access-key
//  * 
//  * @apiSuccessExample {json} Success-Response
//  * HTTP/1.1 200 OK
//  * {
//  *    "message":"deleted successfully"
//  *          
//  * }
//  * @apiErrorExample {json} Error-Response:
//  *   HTTP/1.1 404 Not Found
//  *     {
//  *       "message": "user is not present"
//  *     }
//  *
//  *  HTTP/1.1 500 
//  * {
//  * "message":"Internal Server Error"
//  * "error":" "
//  * }
//  * 
//  */

// const deleteuser =async (req:any,res:any) => {
//   try {
//     let users: any = await SignupDt.findById(req.params.id);
//     console.log(users)
//     if (!users) {
//       return res.status(404).json({
//         "success":false,
//         error: "user not present"

//       })
//     }
//     if (users.isDeleted === true) {
//       return res.status(404).json({
//         "success":false,
//         error:  "user not present"
//       });
//     }
//     let softdelete = await SignupDt.findOneAndUpdate({ _id: users._id }, { isDeleted: true })
//     res.status(200).json({
//       message: "deleted successfully",
    
//     });
//   }
//   catch (error) {
//     res.status(500).json({
//       message:"Internal Server Error",
//       error: error
//     });
// }
// }

// // Staff Days API
// /**
//  * @api {post} /Days staff working hours
//  * @apiGroup Staff
//  * @apiBody (Request body) {String} TimeZone which timezone he is present
//  * @apiBody (Request body) {String} email Staff email
//  * @apiBody (Request body) {String} phoneNo Staff phoneNo
//  * @apiBody (Request body) {String} name Staff name
//  * @apiBody (Request body) {Array} [Monday] [startTime][endTime][breakTime] Times that the staff will be avalibul on monday
//  * @apiBody (Request body) {Array} [Tuesday] [startTime][endTime][breakTime] Times that the staff will be avalibul on Tuesday
//  * @apiBody (Request body) {Array} [Wednesday] [startTime][endTime][breakTime] Times that the staff will be avalibul on Wednesday
//  * @apiBody (Request body) {Array} [Thursday] [startTime][endTime][breakTime] Times that the staff will be avalibul on Thursday
//  * @apiBody (Request body) {Array} [Friday] [startTime][endTime][breakTime] Times that the staff will be avalibul on Friday
//  * @apiBody (Request body) {Array} [Saturday] [startTime][endTime][breakTime] Times that the staff will be avalibul on Saturday
//  * @apiBody (Request body) {Array} [Sunday] [startTime][endTime][breakTime] Times that the staff will be avalibul on Sunday
//  * 
//  * @apiHeader {String} x-token Users unique access-key

//  * @apiSuccessExample {json} Success-Response
//  * HTTP/1.1 200 OK
//  * {
//  *       message: "successfully posted",
//  *        result: { }
//  * }
//  *@apiSampleRequest /Days
//  *@apiErrorExample {json} Error-Response:
//  *   HTTP/1.1 404 Not Found
//  *    {
//  *      "message":"user is not present pleace signup"
//  *    }
//  *   HTTP/1.1 400
//  *     {
//  *       "message": "User is already present"
//  *     }
//  * 
//  * HTTP/1.1 500 Internal Server Error
//  */

// const ondays = async (req: any, res: any) => {
//   try {
//     let data = await SignupDt.findOne({ email: req.body.email })

//     if(!data){
//       return res.status(404).json({
//         message:"user is not present pleace signup"
//       })
//     }

//     let user = await DaysModel.findOne({ email: req.body.email })
//     if(user){
//       return res.status(400).json({
//         message:"user is already present"
//       })
//     }
//     const DaysModels: Days = new DaysModel({
//       TimeZone: req.body.TimeZone,
//       email: req.body.email,
//       phoneNo: req.body.phoneNo,
//       name: req.body.name,
//       Monday: req.body.Monday,
//       Tuesday: req.body.Tuesday,
//       Wednesday: req.body.Wednesday,
//       Thursday: req.body.Thursday,
//       Friday: req.body.Friday,
//       Saturday: req.body.Saturday,
//       Sunday: req.body.Sunday,
//     })
//     const newDays: Days = await DaysModels.save()

//     res.status(200).json({
//       message: "successfully posted",
//       result: newDays
//     })

//   } catch (error) {
//     console.log(error)
//     res.status(500).json({
//       message: "internal server error"
//     })
//   }
// }

// // Staff getAppointment API

// /**
//  * @api {get}/getAppointment availabul slots 
//  * @apiGroup Appointment
//  * 
//  * @apiHeader {String} x-token Users unique access-key
//  * @apiQuery {String} email email is in the string format
//  * @apiQuery {String} date data format will be YYYY-MM-DD and it is in string format
//  * @apiSuccessExample {json} Success-Response
//  * HTTP/1.1 200 OK
//  * {
//  * message: "slots",
//  * result: " "
//  * }
//  *@apiSampleRequest /getAppointment
//  *@apiErrorExample {json} Error-Response:
//  *   HTTP/1.1 404 Not Found
//  *     {
//  *       "message": "user is not present in our database"
//  *     }
//  *    HTTP/1.1 400 
//  *    {
//  *        "message": "slots are not present"
//  *    }
//  * 
//  *    HTTP/1.1 500 Internal Server Error
//  */

// const GetAppointment = async (req: any, res: any) => {
//   try {
//     let date = req.query.date
//     let slots = await DaysModel.findOne({ email: req.query.email })
//     if(!slots){
//       return res.status(404).json({
//         Message : "user is not present in our database"
//       })
//     }
//     if (slots?.isDeleted) {
//       return res.status(404).json({
//         message: "user is not present in our database"
//       })
//     }
//     let timeZn: any = slots?.TimeZone

//     let userDt = moment().tz(timeZn).format("DD-MM-YYYY")

//     let userEnteredDt = moment(date).format("YYYY-MM-DD")
//     let ptz = moment(date).format('DD-MM-YYYY')
//     let userEnteredDay = moment(userEnteredDt).format('dddd')
//     let currentTime = moment().tz(timeZn).format('HH:mm')

//     if (userDt <= ptz) {
//       const slot = await BookingModel.find({ AppointmentDate: userEnteredDt, email: req.query.email }, { "SlotsTime": "$SlotsTime" })
//       console.log(slot)
//       let allslots: any = []
//       for (let i = 0; i < slot.length; i++) {
//         allslots.push(slot[i].SlotsTime)
//       }

//       switch (userEnteredDay) {
//         case "Monday":
//           if (!slots?.Monday[0]) {
//             return res.status(400).send("slots are not there")
//           }
//           let MbreakTime = slots?.Monday[0].breakTime
//           let MStartbreakTime = MbreakTime.filter((_: any, i: any) => !(i % 2));
//           let MEndbreakTime = MbreakTime.filter((_: any, i: any) => (i % 2));
//           let MstartTime: any = slots?.Monday[0].startTime
//           let MendTime: any = slots?.Monday[0].endTime
//           let MallTime: any[] = [];
//           let MallendTime: any = []
//           let Mstartti = slots?.Monday[0].startTime[0]
//           let Mall: any = []
//           for (let i = 0; i < MstartTime.length; i++) {
//             let startt = moment(MstartTime[i], "HH:mm");
//             let endt = moment(MendTime[i], "HH:mm");
//             while (startt < endt) {
//               Mall.push(startt.format("hh:mm A"));
//               startt.add(30, 'minutes');
//             }
//           }
//           for (let i = 0; i < MStartbreakTime.length; i++) {
//             let startt = moment(MStartbreakTime[i], "HH:mm");
//             let endt = moment(MEndbreakTime[i], "HH:mm");
//             while (startt < endt) {
//               MallendTime.push(startt.format("hh:mm A DD-MM-YYYY" ));
//               startt.add(30, 'minutes');
//             }
//           }
//           //console.log(allendTime)
//           let Mremovingslots = MallendTime.concat(allslots.flat())

//           Mall = Mall.filter((v: any) => !Mremovingslots.includes(v))

//           //console.log(Mall)
//           if (userDt === ptz) {
//             if (currentTime > Mstartti) {
//               console.log("first")
//               for (let i = 0; i < MstartTime.length; i++) {
//                 let startt = moment(MstartTime[i], "HH:mm")
//                 let endt = moment(MendTime[i], "HH:mm");
//                 while (startt < endt) {
//                   MallTime.push(startt.add(30,'m').format("hh:mm A"));
//                 }
//               }
//               let h = moment(currentTime, 'HH:mm').format('HH')
//               let m = moment(currentTime, 'HH:mm').format('mm')
//               if (m >= '1' && m <= '29') {
//                 m = '00'
//               }
//               else if (m >= '31' && m <= '59') {
//                 m = '30'
//               }
//               let ti = `${h}:${m}`
//               let st = moment(ti, 'HH:mm')
//               let startt = moment(Mstartti, "HH:mm")
//               console.log(startt)
//               let hello :any[] = []
           
//               while (startt < st) {
//                 hello.push(startt.add(30, 'minutes').format('hh:mm A'));
//               }
//               let hii = MallTime.filter((k:any)=>!hello.includes(k))
//               let removingslots = MallendTime.concat(allslots.flat())
      
//               hii = hii.filter((v: any) => !removingslots.includes(v))

//               if (hii.length === 0) {
//                 return res.status(400).json({
//                   status: false,
//                   message: "slots are not present"
//                 })
//               }
//               return res.status(200).json({
//                 message: "slots",
//                 result: hii
//               })
//             }
//             else if (currentTime <= Mstartti) {
//               console.log('else if')
//               if (Mall.length === 0) {
//                 return res.status(400).json({
//                   status: false,
//                   message: "slot are not present"
//                 })
//               }
//               return res.status(200).json({
//                 message: "slots",
//                 result: Mall
//               })

//             }
//           }
//           else {
//             console.log("else")
//             if (Mall.length === 0) {
//               return res.status(400).json({
//                 status: false,
//                 message: "slot are not present"
//               })
//             }
//             return res.status(200).json({
//               message: "slots",
//               result: Mall
//             })

//           }
//           break;
//         case "Tuesday":
//           console.log("tuesday")
//           if (!slots?.Tuesday[0]) {
//             return res.status(400).send("slots are not there")
//           }
//           let TubreakTime = slots?.Tuesday[0].breakTime
//           let TuStartbreakTime = TubreakTime.filter((_: any, i: any) => !(i % 2));
//           let TuEndbreakTime = TubreakTime.filter((_: any, i: any) => (i % 2));
//           let TustartTime: any = slots?.Tuesday[0].startTime
//           let TuendTime: any = slots?.Tuesday[0].endTime
//           let TuallTime: any[] = [];
//           let TuallendTime: any = []
//           let Tustartti = slots?.Tuesday[0].startTime[0]

//           let Tuall: any = []
//           for (let i = 0; i < TustartTime.length; i++) {
//             let startt = moment(TustartTime[i], "HH:mm");
//             let endt = moment(TuendTime[i], "HH:mm");
//             while (startt < endt) {
//               Tuall.push(startt.format("hh:mm A"));
//               startt.add(30, 'minutes');
//             }
//           }

//           for (let i = 0; i < TuStartbreakTime.length; i++) {
//             let startt = moment(TuStartbreakTime[i], "HH:mm");
//             let endt = moment(TuEndbreakTime[i], "HH:mm");
//             while (startt < endt) {
//               TuallendTime.push(startt.format("hh:mm A"));
//               startt.add(30, 'minutes');
//             }
//           }
//           // console.log(TuallendTime)
//           let Turemovingslots = TuallendTime.concat(allslots.flat())
//           Tuall = Tuall.filter((v: any) => !Turemovingslots.includes(v))

//           if (userDt === ptz) {

//             if (currentTime > Tustartti) {
//               console.log("first")
//               for (let i = 0; i < TustartTime.length; i++) {
//                 let startt = moment(TustartTime[i], "HH:mm");
//                 let endt = moment(TuendTime[i], "HH:mm");
//                  while (startt < endt) {
//                   TuallTime.push(startt.add(30,'m').format("hh:mm A"));
//                             }
//               }
//               // let AFallTime = TuallTime.filter(v => !Tuall.includes(v))
//               let h = moment(currentTime, 'HH:mm').format('HH')
//               let m = moment(currentTime, 'HH:mm').format('mm')
//               if (m >= '1' && m <= '29') {
//                 m = '00'
//               }
//               else if (m >= '31' && m <= '59') {
//                 m = '30'
//               }
//               let ti = `${h}:${m}`
//               let st = moment(ti, 'HH:mm')
//               let startt = moment(Tustartti, "HH:mm")
//               console.log(startt)
//               let hello :any[] = []
           
//               while (startt < st) {
//                 hello.push(startt.add(30, 'minutes').format('hh:mm A'));
//               }
//               let hii = TuallTime.filter((k:any)=>!hello.includes(k))
//               let removingslots = TuallendTime.concat(allslots.flat())
//               console.log(removingslots)
//               hii = hii.filter((v: any) => !removingslots.includes(v))
//               hii.shift()
//               if (hii.length === 0) {
//                 return res.status(400).json({
//                   status: false,
//                   message: "slots are not present"
//                 })
//               }
//               return res.status(200).json({
//                 message: "slots",
//                 result: hii
//               })

//             }
//             else if (currentTime <= Tustartti) {
//               console.log('else if')
//               if (Tuall.length === 0) {
//                 return res.status(400).json({
//                   status: false,
//                   message: "slot are not present"
//                 })
//               }
//               return res.status(200).json({
//                 message: "slots",
//                 result: Tuall
//               })

//             }
//           }
//           else {
//             console.log("else")
//             if (Tuall.length === 0) {
//               return res.status(400).json({
//                 status: false,
//                 message: "slot are not present"
//               })
//             }
//             return res.status(200).json({
//               message: "slots",
//               result: Tuall
//             })

//           }
//           break
//         case "Wednesday":
//           console.log(" This is wednesday");
//           if (!slots?.Wednesday[0]) {
//             return res.status(400).send("slots are not there")
//           }
//           let WbreakTime:any = slots?.Wednesday[0].breakTime
//           let WStartbreakTime = WbreakTime.filter((_: any, i: any) => !(i % 2));
//           let WEndbreakTime = WbreakTime.filter((_: any, i: any) => (i % 2));
//           let WstartTime: any = slots?.Wednesday[0].startTime
//           let WendTime: any = slots?.Wednesday[0].endTime
//           let WallTime: any[] = [];
//           let WallendTime: any = []
//           let Wstartti = slots?.Wednesday[0].startTime[0]
//           console.log(Wstartti)

//           let Wall: any = []
//           for (let i = 0; i < WstartTime.length; i++) {
//             let startt = moment(WstartTime[i], "HH:mm");
//             let endt = moment(WendTime[i], "HH:mm");
//                 while (startt < endt) {
//                           Wall.push(startt.format("hh:mm A"));
//               startt.add(30, 'minutes');
//             }
//           }

//           for (let i = 0; i < WStartbreakTime.length; i++) {
//             let startt = moment(WStartbreakTime[i], "HH:mm");
//             let endt = moment(WEndbreakTime[i], "HH:mm");
//             while (startt < endt) {
//               WallendTime.push(startt.format("hh:mm A"));
//               startt.add(30, 'minutes');
//             }
//           }
//           //console.log(Wall)
//           let removingslots = WallendTime.concat(allslots.flat())
//           Wall = Wall.filter((v: any) => !removingslots.includes(v))

//           if (userDt === ptz) {


//             if (currentTime > Wstartti) {
//               console.log("first")
//               for (let i = 0; i < WstartTime.length; i++) {
//                 let startt = moment(WstartTime[i], "HH:mm")
//                 let endt = moment(WendTime[i], "HH:mm");
//                 while (startt < endt) {
//                   WallTime.push(startt.add(30, 'minutes').format('hh:mm A'));
//                 }
//               }
//                 let h = moment(currentTime, 'HH:mm').format('HH')
//                 let m = moment(currentTime, 'HH:mm').format('mm')
//                 if (m >= '1' && m <= '29') {
//                   m = '00'
//                 }
//                 else if (m >= '31' && m <= '59') {
//                   m = '30'
//                 }
//                 let ti = `${h}:${m}`
//                 let st = moment(ti, 'HH:mm')
//                 let startt = moment(Wstartti, "HH:mm")
//                 console.log(startt)
//                 let hello :any[] = []
             
//                 while (startt < st) {
//                   hello.push(startt.add(30, 'minutes').format('hh:mm A'));
//                 }
//                 let hii = WallTime.filter((k:any)=>!hello.includes(k))
//               let removingslots = WallendTime.concat(allslots.flat())
//               hii = hii.filter((v: any) => !removingslots.includes(v))
              
//               if (hii.length === 0) {
//                 return res.status(400).json({
//                   status: false,
//                   message: "slota are not present"
//                 })
//               }
//               return res.status(200).json({
//                 message: "slots",
//                 result: hii
//               })

//             }


//             else if (currentTime <= Wstartti) {
//               console.log('else if')
//               if (Wall.length === 0) {
//                 return res.status(400).json({
//                   status: false,
//                   message: "slota are not present"
//                 })
//               }
//               return res.status(200).json({
//                 message: "slots",
//                 result: Wall
//               })

//             }
//           }
//           else {
//             console.log("else")
//             if (Wall.length === 0) {
//               return res.status(400).json({
//                 status: false,
//                 message: "slota are not present"
//               })
//             }
//             return res.status(200).json({
//               message: "slots",
//               result: Wall
//             })

//           }
//           break
//         case "Thursday":
//           console.log("thursday")
//           if (!slots?.Thursday[0]) {
//             return res.status(400).send("slots are not there")
//           }
//           let breakTime = slots?.Thursday[0].breakTime
//           let StartbreakTime = breakTime.filter((_: any, i: any) => !(i % 2));
//           let EndbreakTime = breakTime.filter((_: any, i: any) => (i % 2));
//           let startTime: any = slots?.Thursday[0].startTime
//           let endTime: any = slots?.Thursday[0].endTime
//           let allTime: any[] = [];
//           let allendTime: any = []
//           let startti = slots?.Thursday[0].startTime[0]

//           let Tall: any = []
//           for (let i = 0; i < startTime.length; i++) {
//             let startt = moment(startTime[i], "HH:mm");
//             let endt = moment(endTime[i], "HH:mm");
//             while (startt < endt) {
//               Tall.push(startt.format("hh:mm A"));
//               startt.add(30, 'minutes');
//             }
//           }


//           for (let i = 0; i < StartbreakTime.length; i++) {
//             let startt = moment(StartbreakTime[i], "HH:mm");
//             let endt = moment(EndbreakTime[i], "HH:mm");
//             while (startt < endt) {
//               allendTime.push(startt.format("hh:mm A"));
//               startt.add(30, 'minutes');
//             }
//           }
//           //console.log(allendTime)
//           let thremovingslots = allendTime.concat(allslots.flat())
//           Tall = Tall.filter((v: any) => !thremovingslots.includes(v))

//           if (userDt === ptz) {
//             if (currentTime > startti) {
//               console.log("first")
//               for (let i = 0; i < startTime.length; i++) {
//                 let startt: any = moment(startTime[i], "HH:mm");
//                 let endt = moment(endTime[i], "HH:mm");
//                 while (startt < endt) {
//                   allTime.push(startt.add(30,'m').format("hh:mm A"));
//                   }
//               }
//               let h = moment(currentTime, 'HH:mm').format('HH')
//               let m = moment(currentTime, 'HH:mm').format('mm')
//               if (m >= '1' && m <= '29') {
//                 m = '00'
//               }
//               else if (m >= '31' && m <= '59') {
//                 m = '30'
//               }
//               let ti = `${h}:${m}`
//               let st = moment(ti, 'HH:mm')
//               let startt = moment(startti, "HH:mm")
//               console.log(startt)
//               let hello :any[] = []
           
//               while (startt < st) {
//                 hello.push(startt.add(30, 'minutes').format('hh:mm A'));
//               }
//               let hii = allTime.filter((k:any)=>!hello.includes(k))
//               let removingslots  = allendTime.concat(allslots.flat(), EndbreakTime.flat())
//               //console.log(removingslots)
//               hii = hii.filter((v: any) => !removingslots.includes(v))
//               hii.shift()
//               if (hii.length === 0) {
//                 return res.status(400).json({
//                   status: false,
//                   message: "slota are not present"
//                 })
//               }
//               return res.status(200).json({
//                 message: "slots",
//                 result: hii
//               })
//             }

//             else if (currentTime <= startti) {
//               console.log("else if")
//               if (Tall.length === 0) {
//                 return res.status(400).json({
//                   status: false,
//                   message: "slot are not present"
//                 })
//               }
//               return res.status(200).json({
//                 message: "slots",
//                 result: Tall
//               })

//             }
//           }
//           else {
//             console.log('elif')
//             if (Tall.length === 0) {
//               return res.status(400).json({
//                 status: false,
//                 message: "slot are not present"
//               })
//             }
//             return res.status(200).json({
//               message: "slots",
//               result: Tall
//             })

//           }


//           break

//         case "Friday":
//           console.log("friday")
//           if (!slots?.Friday[0]) {
//             return res.status(400).send("slots are not there")
//           }

//           let FbreakTime = slots?.Friday[0].breakTime
//           let FStartbreakTime = FbreakTime.filter((_: any, i: any) => !(i % 2));
//           let FEndbreakTime = FbreakTime.filter((_: any, i: any) => (i % 2));
//           let FstartTime: any = slots?.Friday[0].startTime
//           let FendTime: any = slots?.Friday[0].endTime
//           let FallTime: any[] = [];
//           let FallendTime: any = []
//           let Fstartti = slots?.Friday[0].startTime[0]
//           console.log(Fstartti)

//           let all: any = []
//           for (let i = 0; i < FstartTime.length; i++) {
//             let startt = moment(FstartTime[i], "HH:mm");
//             let endt = moment(FendTime[i], "HH:mm");
//             while (startt < endt) {
//               all.push(startt.format("hh:mm A"));
//               startt.add(30, 'minutes');
//             }
//           }

//           for (let i = 0; i < FStartbreakTime.length; i++) {
//             let startt = moment(FStartbreakTime[i], "HH:mm");
//             let endt = moment(FEndbreakTime[i], "HH:mm");
//             while (startt < endt) {
//               FallendTime.push(startt.format("hh:mm A"));
//               startt.add(30, 'minutes');
//             }
//           }
//           //console.log(allendTime)
//           let Faremovingslots = FallendTime.concat(allslots.flat())
//           //console.log(removingslots)
//           all = all.filter((v: any) => !Faremovingslots.includes(v))

//           if (userDt === ptz) {

//             if (currentTime > Fstartti) {
//               console.log("first")
//               for (let i = 0; i < FstartTime.length; i++) {
//                 let startt = moment(FstartTime[i], "HH:mm")
//                 let endt = moment(FendTime[i], "HH:mm");
//                while (startt < endt) {
//                   FallTime.push(startt.format("hh:mm A"));
//                   startt.add(30, 'm');
//                 }
//               }

//               let h = moment(currentTime, 'HH:mm').format('HH')
//               let m = moment(currentTime, 'HH:mm').format('mm')
//               if (m >= '1' && m <= '29') {
//                 m = '00'
//               }
//               else if (m >= '31' && m <= '59') {
//                 m = '30'
//               }
//               let ti = `${h}:${m}`
//               let st = moment(ti, 'HH:mm')
//               let startt = moment(Fstartti, "HH:mm")
//               console.log(startt)
//               let hello :any[] = []
           
//               while (startt < st) {
//                 hello.push(startt.add(30, 'minutes').format('hh:mm A'));
//               }
//               let hii = FallTime.filter((k:any)=>!hello.includes(k))
//               // let AFallTime = FallTime.filter(v => !all.includes(v))

//               let removingslots = FallendTime.concat(allslots.flat())
//               //console.log(removingslots)
//               hii = hii.filter((v: any) => !removingslots.includes(v))
//               hii.shift()
//               if (hii.length === 0) {
//                 return res.status(400).json({
//                   status: false,
//                   message: "slota are not present"
//                 })
//               }
//               return res.status(200).json({
//                 message: "slots",
//                 result: hii
//               })
//             }
//             else if (currentTime <= Fstartti) {
//               console.log('else if')
//               if (all.length === 0) {
//                 return res.status(400).json({
//                   status: false,
//                   message: "slot are not present"
//                 })
//               }
//               return res.status(200).json({
//                 message: "slots",
//                 result: all
//               })

//             }
//           }
//           else {
//             console.log("else")
//             if (all.length === 0) {
//               return res.status(400).json({
//                 status: false,
//                 message: "slot are not present"
//               })
//             }
//             return res.status(200).json({
//               message: "slots",
//               result: all
//             })

//           }

//           break

//         case "Saturday":
//           console.log("saturday");
//           if (!slots?.Saturday[0]) {
//             return res.status(400).send("slots are not there")
//           }
//           let SbreakTime = slots?.Saturday[0].breakTime
//           let SStartbreakTime = SbreakTime.filter((_: any, i: any) => !(i % 2));
//           console.log("rii")
//           let SEndbreakTime = SbreakTime.filter((_: any, i: any) => (i % 2));
//           let SstartTime: any = slots?.Saturday[0].startTime
//           let SendTime: any = slots?.Saturday[0].endTime
//           let SallTime: any[] = [];
//           let SallendTime: any = []
//           let Sstartti = slots?.Saturday[0].startTime[0]
//           console.log(Sstartti)

//           let Sall: any = []
//           for (let i = 0; i < SstartTime.length; i++) {
//             let startt = moment(SstartTime[i], "HH:mm");
//             let endt = moment(SendTime[i], "HH:mm");
//             while (startt < endt) {
//               Sall.push(startt.format("hh:mm A"));
//               startt.add(30, 'minutes');
//             }
//           }

//           for (let i = 0; i < SStartbreakTime.length; i++) {
//             let startt = moment(SStartbreakTime[i], "HH:mm");
//             let endt = moment(SEndbreakTime[i], "HH:mm");
//             while (startt < endt) {
//               SallendTime.push(startt.format("hh:mm A"));
//               startt.add(30, 'minutes');
//             }
//           }
//           //console.log(allendTime)
//           let saremovingslots = SallendTime.concat(allslots.flat())
//           console.log(removingslots)
//           Sall = Sall.filter((v: any) => !saremovingslots.includes(v))


//           if (userDt === ptz) {
//             if (currentTime > Sstartti) {
//               console.log("first")
//               for (let i = 0; i < SstartTime.length; i++) {
//                 let startt = moment(SstartTime[i], "HH:mm");
//                 let endt = moment(SendTime[i], "HH:mm");
//                 while (startt < endt) {
//                   SallTime.push(startt.format("hh:mm A"));
//                   startt.add(30, 'minutes');
//                 }
//               }
//               let h = moment(currentTime, 'HH:mm').format('HH')
//               let m = moment(currentTime, 'HH:mm').format('mm')
//               if (m >= '1' && m <= '29') {
//                 m = '00'
//               }
//               else if (m >= '31' && m <= '59') {
//                 m = '30'
//               }
//               let ti = `${h}:${m}`
//               let st = moment(ti, 'HH:mm')
//               let startt = moment(Sstartti, "HH:mm")
//               console.log(startt)
//               let hello :any[] = []
           
//               while (startt < st) {
//                 hello.push(startt.add(30, 'minutes').format('hh:mm A'));
//               }
//               let hii = SallTime.filter((k:any)=>!hello.includes(k))

//               let removingslots = FallendTime.concat(allslots.flat())
//               //console.log(removingslots)
//               hii = hii.filter((v: any) => !removingslots.includes(v))
//               hii.shift()
//               if (SallTime.length === 0) {
//                 return res.status(400).json({
//                   status: false,
//                   message: "slota are not present"
//                 })
//               }
//               return res.status(200).json({
//                 message: "slots",
//                 result: hii
//               })

//             }
//             else if (currentTime <= Sstartti) {
//               console.log('else if')
//               if (Sall.length === 0) {
//                 return res.status(400).json({
//                   status: false,
//                   message: "slot are not present"
//                 })
//               }
//               return res.status(200).json({
//                 message: "slots",
//                 result: Sall
//               })

//             }
//           }
//           else {
//             console.log("else")
//             if (Sall.length === 0) {
//               return res.status(400).json({
//                 status: false,
//                 message: "slot are not present"
//               })
//             }
//             return res.status(200).json({
//               message: "slots",
//               result: Sall
//             })

//           }
//           break

//         case "Sunday":
//           if (!slots?.Sunday[0]) {
//             return res.status(400).send("slots are not there")
//           }
//           let SnbreakTime = slots?.Sunday[0].breakTime
//           let SnStartbreakTime = SnbreakTime.filter((_: any, i: any) => !(i % 2));
//           console.log("rii")
//           let SnEndbreakTime = SnbreakTime.filter((_: any, i: any) => (i % 2));
//           let SnstartTime: any = slots?.Saturday[0].startTime
//           let SnendTime: any = slots?.Saturday[0].endTime
//           let SnallTime: any[] = [];
//           let SnallendTime: any = []
//           let Snstartti = slots?.Saturday[0].startTime[0]
//           console.log(Sstartti)
//           let Snall: any = []
//           for (let i = 0; i < SnstartTime.length; i++) {
//             let startt = moment(SnstartTime[i], "HH:mm");
//             let endt = moment(SnendTime[i], "HH:mm");
//             while (startt < endt) {
//               Snall.push(startt.format("hh:mm A"));
//               startt.add(30, 'minutes');
//             }
//           }

//           for (let i = 0; i < SnStartbreakTime.length; i++) {
//             let startt = moment(SnStartbreakTime[i], "HH:mm");
//             let endt = moment(SnEndbreakTime[i], "HH:mm");
//             while (startt < endt) {
//               SnallendTime.push(startt.format("hh:mm A"));
//               startt.add(30, 'minutes');
//             }
//           }
//           //console.log(allendTime)
//           let Snremovingslots = SnallendTime.concat(allslots.flat())
//           Snall = Snall.filter((v: any) => !Snremovingslots.includes(v))
//           if (userDt === ptz) {
//             if (currentTime > Snstartti) {
//               console.log("first")
//               for (let i = 0; i < SnstartTime.length; i++) {
//                 let startt = moment(SnstartTime[i], "HH:mm")
//                 let endt = moment(SnendTime[i], "HH:mm");
//                 while (startt < endt) {
//                   SnallTime.push(startt.format("hh:mm A"));
//                   startt.add(30, 'minutes');
//                 }
//               }
//               let h = moment(currentTime, 'HH:mm').format('HH')
//               let m = moment(currentTime, 'HH:mm').format('mm')
//               if (m >= '1' && m <= '29') {
//                 m = '00'
//               }
//               else if (m >= '31' && m <= '59') {
//                 m = '30'
//               }
//               let ti = `${h}:${m}`
//               let st = moment(ti, 'HH:mm')
//               let startt = moment(Snstartti, "HH:mm")
//               console.log(startt)
//               let hello :any[] = []
           
//               while (startt < st) {
//                 hello.push(startt.add(30, 'minutes').format('hh:mm A'));
//               }
//               let hii = SnallTime.filter((k:any)=>!hello.includes(k))
//               // console.log(SnallTime)
//               // let AFallTime = SnallTime.filter(v => !all.includes(v))
//               // console.log(AFallTime)
//               let removingslots = SnallendTime.concat(allslots.flat())
//               //console.log(removingslots)
//               hii = hii.filter(v => !removingslots.includes(v))
//               hii.shift()
//               if (hii.length === 0) {
//                 return res.status(400).json({
//                   status: false,
//                   message: "slots are not present"
//                 })
//               }
//               return res.status(200).json({
//                 message: "slots",
//                 result: SnallTime
//               })
//             }
//             else if (currentTime <= Snstartti) {
//               console.log('else if')

//               //SnallTime = SnallTime.filter(v => !SnallendTime.includes(v))
//               if (Snall.length === 0) {
//                 return res.status(400).json({
//                   status: false,
//                   message: "slot are not present"
//                 })
//               }
//               return res.status(200).json({
//                 message: "slots",
//                 result: Snall
//               })

//             }
//           }
//           else {
//             console.log("else")
//             if (Snall.length === 0) {
//               return res.status(400).json({
//                 status: false,
//                 message: "slot are not present"
//               })
//             }
//             return res.status(200).json({
//               message: "slots",
//               result: Snall
//             })

//           }
//           console.log("sunday");

//           break
//       }

//     }

//     else {
//       return res.status(400).json({
//         message: "slots are not present"
//       })
//     }
//   } catch (error) {
//     res.status(400).send("Internal Server Error")
//     console.log(error)
//   }
// }



// // Staff updateSlot API
// /**
//  * @api {put} /updateSlot update staff working hours
//  * @apiGroup Staff
//  * @apiBody (Request body) {String} TimeZone which timezone he is present
//  * @apiBody (Request body) {String} email Staff email
//  * @apiBody (Request body) {String} phoneNo Staff phoneNo
//  * @apiBody (Request body) {String} name Staff name
//  * @apiBody (Request body) {Array} [Monday] [startTime][endTime][breakTime] Times that the staff will be avalibul on monday
//  * @apiBody (Request body) {Array} [Tuesday] [startTime][endTime][breakTime] Times that the staff will be avalibul on Tuesday
//  * @apiBody (Request body) {Array} [Wednesday] [startTime][endTime][breakTime] Times that the staff will be avalibul on Wednesday
//  * @apiBody (Request body) {Array} [Thursday] [startTime][endTime][breakTime] Times that the staff will be avalibul on Thursday
//  * @apiBody (Request body) {Array} [Friday] [startTime][endTime][breakTime] Times that the staff will be avalibul on Friday
//  * @apiBody (Request body) {Array} [Saturday] [startTime][endTime][breakTime] Times that the staff will be avalibul on Saturday
//  * @apiBody (Request body) {Array} [Sunday] [startTime][endTime][breakTime] Times that the staff will be avalibul on Sunday
//  * @apiHeader {String} x-token Users unique access-key

//  * 
//  * @apiParamExample {json} Request-Example:
//  *     {
//  *       "email": " "
//  *     }
//  * 
//  * @apiQuery {String} email email is in the string format
 
 
//  * @apiSuccessExample {json} Success-Response
//  * HTTP/1.1 200 OK
//  * {
//  *         message: "user updated sucessfully",
//  *         result: {  }
//  * }
//  *@apiSampleRequest /updateSlot
//  *@apiErrorExample {json} Error-Response:
//  *   HTTP/1.1 404 Not Found
//  *     {
//  *       "message": "User is not present"
//  *     }
//  * 
//  * HTTP/1.1 500 Internal Server Error
//  */

// const updateSlot = async (req: any, res: any) => {
//   try {
//     let users: any = await DaysModel.findOne({ email: req.query.email });
//     if (!users) {
//       return res.status(404).json({
//         success: false,
//         message: "user is not present",
//       });
//     }
//     if (users?.isDeleted) {
//       return res.status(404).json({
//         message: "user is not present"
//       })
//     }
//     const newUserData = {
//       TimeZone: req.body.TimeZone || users.TimeZone,
//       email: users.email,
//       phoneNo: req.body.phoneNo || users.phoneNo,
//       name: req.body.name || users.name,
//       Monday: req.body.Monday || users.Monday,
//       Tuesday: req.body.Tuesday || users.Tuesday,
//       Wednesday: req.body.Wednesday || users.Wednesday,
//       Thursday: req.body.Thursday || users.Thursday,
//       Friday: req.body.Friday || users.Friday,
//       Saturday: req.body.Saturday || users.Saturday,
//       Sunday: req.body.Sunday || users.Sunday,
//     };

//     const user = await DaysModel.findOneAndUpdate({ email: req.query.email }, newUserData, {
//       new: true,
//       runValidators: false,
//       userFindAndModify: true,
//     });
//     return res.status(200).json({
//       message: "staff updated sucessfully",
//       result: user
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).send("Internal server");
//   }
// };

// // user booking API
// /**
//  * @api {post} /booking booking slots
//  * @apiGroup Booking
//  * @apiBody (Request body) {String} TimeZone which timezone he is present
//  * @apiBody (Request body) {String} email user email
//  * @apiBody (Request body) {String} SlotsTime user Slot time
//  * @apiBody (Request body) {Array} Service user service
//  * @apiBody (Request body) {String} AppointmentDate user date Appointment
//  * @apiBody (Request body) {String} name user name
//  * @apiBody (Request body) {String} Duerication user Duerication of slot
//  * @apiHeader {String} x-token Users unique access-key

 
//  * @apiSuccessExample {json} Success-Response
//  * HTTP/1.1 200 OK
//  * {
//  *           message: "slot booking sucess",
//  *           result: { }
//  * }
//  *@apiSampleRequest /updateSlot
//  *@apiErrorExample {json} Error-Response:
//  *   HTTP/1.1 404 Not Found
//  *     {
//  *       "message": "User is not present"
//  *     }
//  * 
//  *  HTTP/1.1 400
//  * {
//  *  status: false,
//  * message: "date is grater then today"
//  * }
//  * HTTP/1.1 500 Internal Server Error
//  */

// const bookingSlots = async (req: any, res: any) => {

//   let user = await BookingModel.find({ TimeZone: req.body.TimeZone, AppointmentDate: req.body.AppointmentDate, email: req.body.email }, { "SlotsTime": "$SlotsTime" })
//   let daysdata = await DaysModel.findOne({ email: req.body.email })

//   if (!daysdata) {
//     return res.status(404).json({
//       status: false,
//       message: "user is not present"
//     })
//   }

//   let date = moment().tz(req.body.TimeZone).format('YYYY-MM-DD')
//   console.log(date)
//   let enterdat = moment(req.body.AppointmentDate).format('YYYY-MM-DD')
//   console.log(enterdat)
  
//   if (date > enterdat) {
//     return res.status(400).json({
//       status: false,
//       message: "date is grater or equal to  today"
//     })
//   }

//   //console.log(user)
//   let allslots: any = []
//   for (let i = 0; i < user.length; i++) {
//     allslots.push(user[i].SlotsTime)
//   }
//   console.log(allslots.flat())
//   const found = allslots.flat().some((r: any) => req.body.SlotsTime.indexOf(r) >= 0)
//   //console.log(found)
//   if (found) {
//     return res.status(400).json({
//       Status: false,
//       message: 'Slot is already Booked'
//     })
//   };

//   try {
//     let BookingModels: Booking = new BookingModel({
//       TimeZone: req.body.TimeZone,
//       SlotsTime: req.body.SlotsTime,
//       Service: req.body.Service,
//       email: req.body.email,
//       Name: req.body.Name,
//       Duerication: req.body.Duerication,
//       AppointmentDate: req.body.AppointmentDate
//     })
//     let slot: Booking = await BookingModels.save()

//     let transporters = nodemailer.createTransport(
//       {
//         service: 'gmail',
//         auth: {
//           user: "kotavamsi16@gmail.com",
//           pass: "mbjypwpxtpswciyp",
//         },
//         tls: {
//           rejectUnauthorized: true,
//         },

//       }
//     )
//     let mailOptions: any = {
//       from: "kotavamsi16@gmail.com",
//       to: "vamsi.1255237@gmail.com",
//       subject: "slot booked",
//       text: `Hello ${slot.Name} your slot has been updated to ${slot.AppointmentDate} and slots will be at ${slot.SlotsTime} `,
//     };
//     transporters.sendMail(mailOptions, function (error: any, info: any) {
//       if (error) {
//         console.log(error);
//       }
//       console.log('Message sent: ' + info.response);
//     })
//     return res.status(200).json({
//       message: "slot booking sucess",
//       result: slot
//     })
//   }

//   catch (error) {
//     console.log(error)
//     res.status(500).json({
//       message: "internal server error"
//     })
//   }
// };

// // User updateBooking API
// /**
//  * @api {put} /updateBooking update booking details
//  * @apiGroup Booking
//  * @apiBody (Request body) {String} email user email
//  * @apiBody (Request body) {String} SlotsTime user Slot time
//  * @apiBody (Request body) {Array} Service user service
//  * @apiBody (Request body) {String} AppointmentDate user date Appointment
//  * @apiBody (Request body) {String} name user name
//  * @apiBody (Request body) {String} Duerication user Duerication of slot
//  * 
//  * @apiHeader {String} x-token Users unique access-key

//  * @apiParamExample {json} Request-Example:
//  *     {
//  *       "email": " "
//  *     }
//  * 
 
//  * @apiSuccessExample {json} Success-Response
//  * HTTP/1.1 200 OK
//  * {
//  *           message: "slot booking sucess",
//  *           result: { }
//  * }
//  *@apiSampleRequest /updateBooking
//  *@apiErrorExample {json} Error-Response:
//  *   HTTP/1.1 404 Not Found
//  *     {
//  *       "message": "User is not present"
//  *     }
//  * 
//  * HTTP/1.1 500 Internal Server Error
//  *  HTTP/1.1 400
//  * {
//  *  status: false,
//  * message: "date is grater then today"
//  * }
//  */

// const updateBooking = async (req: any, res: any) => {
//   try {

//     let users: any = await BookingModel.findById(req.query.id);
//     console.log(users.TimeZone)
//     //console.log(use)
//     if (!users) {
//       //console.log("hello")
//       return res.status(404).json({
//         success: false,
//         message: "user is not presnt",
//       });
//     }
//     let daysdata = await DaysModel.findOne({ email: req.body.email })
//     console.log("hello")
//     //console.log(daysdata)
//     if (!daysdata) {
//       return res.status(404).json({
//         status: false,
//         message: "user is not present"
//       })
//     }

//     if (users?.isDeleted) {
//       return res.status(404).json({
//         message: " user is not present "
//       })
//     }

//     let date = moment().tz(users.TimeZone).format('YYYY-MM-DD')
//     console.log(date)
//     let enterdat = moment(req.body.AppointmentDate).format('YYYY-MM-DD')
//     console.log(enterdat)
//     if (date > enterdat) {
//       return res.status(400).json({
//         status: false,
//         message: "date is grater then today"
//       })
//     }
//     let user = await BookingModel.find({ TimeZone: users.TimeZone, email: req.body.email, AppointmentDate: req.body.AppointmentDate }, { "SlotsTime": "$SlotsTime" })
//     //console.log(user)
//     let allslots: any = []
//     for (let i = 0; i < user.length; i++) {
//       allslots.push(user[i].SlotsTime)
//     }
//     console.log(allslots.flat())
//     const found = allslots.flat().some((r: any) => req.body.SlotsTime.indexOf(r) >= 0)
//     console.log(found)
//     if (found) {
//       return res.status(400).json({
//         Status: false,
//         message: 'Slot is already Booked'
//       })
//     };

//     const newUserData = {
//       TimeZone: users.TimeZone,
//       SlotsTime: req.body.SlotsTime || users.SlotsTime,
//       Service: req.body.Service || users.Service,
//       email: req.body.email || users.email,
//       Name: req.body.Name || users.Name,
//       Duerication: req.body.Duerication || users.Duerication,
//       AppointmentDate: req.body.AppointmentDate || users.AppointmentDate
//     }

//     let data: any = await BookingModel.findByIdAndUpdate({ _id: req.query.id }, newUserData, {
//       new: true,
//       runValidators: false,
//       userFindAndModify: true,
//     });
//     let transporters = nodemailer.createTransport(
//       {
//         service: 'gmail',
//         auth: {
//           user: "kotavamsi16@gmail.com",
//           pass: "mbjypwpxtpswciyp",
//         },
//         tls: {
//           rejectUnauthorized: true,
//         },

//       }
//     )
//     let mailOptions: any = {
//       from: "kotavamsi16@gmail.com",
//       to: "vamsi.1255237@gmail.com",
//       subject: "your slot has been updated",
//       text: `Hello ${data.Name} your slot has been updated to ${data.AppointmentDate} and slots will be at ${data.SlotsTime} `
//     };
//     transporters.sendMail(mailOptions, function (error: any, info: any) {
//       if (error) {
//         console.log(error);
//       }
//       console.log('Message sent: ' + info.response);
//     })
//     return res.status(200).json({
//       message: "user updated successfully",
//       result: data
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).send("Hello Internal server");
//   }
// };

// // user getBookingsByEmail API
// /**
//  * @api {get} /getBookingsByEmail get booking details
//  * @apiGroup Booking
//  * 
//  * @apiHeader {String} x-token Users unique access-key


//  * @apiParamExample {json} Request-Example:
//  *     {
//  *       "email": " "
//  *     }
//  * 
//  * @apiQuery {String} email email is in the string format
 
//  * @apiSuccessExample {json} Success-Response
//  * HTTP/1.1 200 OK
//  * {
//  *           message: "data",
//  *           result: { }
//  * }
//  *@apiSampleRequest /getBookingsByEmail
//  *@apiErrorExample {json} Error-Response:
//  *   HTTP/1.1 404 Not Found
//  *     {
//  *        "success":false
//  *       "message": "User is not present"
//  *     }
//  * 
//  * HTTP/1.1 500 
//  * {
//  * message:"Internal Server Error",
//  * error : { }
//  * }

//  */

// const getBookingsByEmail = async (req: any, res: any) => {
//   try {
//     let user = await BookingModel.find({ email: req.query.email, isDeleted: false })
//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "user is not presnt",
//       });
//     }
//     res.status(200).json({
//       message: "data",
//       result: user
//     })
//   } catch (error) {
//     console.log(error)
//     res.status(500).json({
//       message: "internal server error",
//       error: error
//     })
//   }
// }

// // staff getDaysByEmail API
// /**
//  * @api {get} /getDaysByEmail get staff details
//  * @apiGroup Staff
//  * @apiHeader {String} x-token Users unique access-key

//  * @apiParamExample {json} Request-Example:
//  *     {
//  *       "email": " "
//  *     }
//  * 
//  * @apiQuery {String} email email is in the string format
//  * 
 
//  * @apiSuccessExample {json} Success-Response
//  * HTTP/1.1 200 OK
//  * {
//  *           message: "data",
//  *           result: { }
//  * }
//  *@apiSampleRequest /getDaysByEmail
//  *@apiErrorExample {json} Error-Response:
//  *   HTTP/1.1 404 Not Found
//  *     {
//  *        "success":false
//  *       "message": "User is not present"
//  *     }
//  * 
//  * HTTP/1.1 500 
//  * {
//  * message:"Internal Server Error",
//  * error : { }
//  * }

//  */

// const getDaysByEmail = async (req: any, res: any) => {
//   try {
//     let user = await DaysModel.find({ email: req.query.email, isDeleted: false })
//     if (!user) {
//       return res.status(400).json({
//         success: false,
//         message: "user is not presnt",
//       });
//     }

//     return res.status(200).json({
//       message: "data",
//       result: user
//     })
//   } catch (error) {
//     console.log(error)
//     res.status(500).json({
//       message: "internal error",
//       error: error
//     })
//   }
// }

// // user softDelete API
// /**
//  * @api {delete} /DeleteBooking/:id delete bookings
//  * @apiGroup Booking
//  * @apiHeader {String} x-token Users unique access-key

//  * @apiParam {Number} id Users unique ID.

//  * @apiParamExample {json} Request-Example:
//  *     {
//  *       "id": " "
//  *     }
//  * 
 
//  * @apiSuccessExample {json} Success-Response
//  * HTTP/1.1 200 OK
//  * {
//  *           message: "Your slot was deleted"
//  * }
//  *@apiSampleRequest /DeleteBooking/:id
//  *@apiErrorExample {json} Error-Response:
//  *   HTTP/1.1 404 Not Found
//  *     {
//  *        "success":false
//  *       "message": "User is not present"
//  *     }
//  * 
//  * HTTP/1.1 500 
//  * {
//  * message:"Internal Server Error",
//  * error : { }
//  * }

//  */

// const softDelete = async (req: any, res: any) => {
//   debugger
//   try {
//     const users: any = await BookingModel.findById(req.params.id);
//     console.log(users)

//     if (!users) {
//       return res.status(404).json({
//         error: 'user is not present'
//       });
//     }

//     if (users.isDeleted === true) {
//       return res.status(404).json({
//         error: 'user is not present'
//       });
//     }
//     const softdelete = await BookingModel.findOneAndUpdate({ _id: users._id }, { isDeleted: true })

//     let transporters = nodemailer.createTransport(
//       {
//         service: 'gmail',
//         auth: {
//           user: "kotavamsi16@gmail.com",
//           pass: "mbjypwpxtpswciyp",
//         },
//         tls: {
//           rejectUnauthorized: true,
//         },

//       }
//     )
//     let mailOptions: any = {
//       from: "kotavamsi16@gmail.com",
//       to: "vamsi.1255237@gmail.com",
//       subject: "your slot deleted",
//       text: `Hello ${users.Name} your slot has been deleted`,
//     };
//     transporters.sendMail(mailOptions, function (error: any, info: any) {
//       if (error) {
//         console.log(error);
//       }
//       console.log('Message sent: ' + info.response);
//     })
//     res.status(200).json({
//       message: "Your slot was deleted"
    
//     });
//   }
//   catch (error) {
//     res.status(500).json({
//       message:"Internal Server Error",
//       error: error
//     });
//   }
// };

// // user DaysSoftDelete API

// /**
//  * @api {delete} /DeleteStaff/:id  delete staff 
//  * @apiGroup Staff
//  * @apiHeader {String} x-token Users unique access-key
 
//  * @apiParam {Number} id Users unique ID.

//  * @apiParamExample {json} Request-Example:
//  *     {
//  *       "id": " "
//  *     }
//  * 
 
//  * @apiSuccessExample {json} Success-Response
//  * HTTP/1.1 200 OK
//  * {
//  *           message: "Your slot was deleted"
//  * }
//  *@apiSampleRequest /DeleteStaff/:id
//  *@apiErrorExample {json} Error-Response:
//  *   HTTP/1.1 404 Not Found
//  *     {
//  *        "success":false
//  *       "message":  "Staff dose not present"
//  *     }
//  * 
//  * HTTP/1.1 500 
//  * {
//  * message:"Internal Server Error",
//  * error : { }
//  * }

//  */

// const DaysSoftDelete = async (req: any, res: any) => {
//   try {
//     const users: any = await DaysModel.findById(req.params.id);
//     console.log(users)
//     if (!users) {
//       return res.status(404).json({
//         "success":false,
//         error: "Staff dose not present"

//       })
//     }
//     if (users.isDeleted === true) {
//       return res.status(404).json({
//         "success":false,
//         error:  "Staff dose not present"
//       });
//     }
//     const softdelete = await DaysModel.findOneAndUpdate({ _id: users._id }, { isDeleted: true })
//     res.status(200).json({
//       message: "deleted success",
//       //data: softdelete
//     });
//   }
//   catch (error) {
//     res.status(500).json({
//       message:"Internal Server Error",
//       error: error
//     });
//   }
// };

// //getallstaffs

// /**
//  * @api {get} /getallstaffs get all staff details
//  * @apiGroup Admin
//  * 
//  * @apiSampleRequest /getallstaffs
//  * 
//  * @apiHeader {String} x-token Users unique access-key
//  * 
//  * @apiSuccessExample {json} Success-Response
//  * HTTP/1.1 200 OK
//  * {
//  *    "message":"data"
//  *    "result" : "get all staff details"
//  *        
//  * }
//  * @apiErrorExample {json} Error-Response:
//  *   
//  *
//  *  HTTP/1.1 403 "Access denied"
//  * 
//  *  HTTP/1.1 500 
//  * {
//  * "message":"Internal Server Error"
//  * }
//  * 
//  */

// const getallstaffs =async (req:any,res:any) => {
//   try {
//     let user = await DaysModel.find({isDeleted: false })
//     res.status(200).json({
//       message: "data",
//       result: user
//     })
//   } catch (error) {
//     console.log(error)
//     res.status(500).json({
//       message: "internal server error",
//       error: error
//     })
//   }
// }

// //get all users

// /**
//  * @api {get} /getallusers get all user details
//  * @apiGroup Admin
//  * 
//  * @apiSampleRequest /getallusers
//  * 
//  * @apiHeader {String} x-token Users unique access-key
//  * @apiQuery {String} email the email used for filter
//  * 
//  * @apiSuccessExample {json} Success-Response
//  * HTTP/1.1 200 OK
//  * {
//  *    "message":"data"
//  *    "result" : "get all users details"
//  *        
//  * }
//  * @apiErrorExample {json} Error-Response:
//  *   
//  *
//  *  HTTP/1.1 403 "Access denied"
//  * 
//  *  HTTP/1.1 500 
//  * {
//  * "message":"Internal Server Error"
//  * }
//  * 
//  */

// const getallusers =async (req:any,res:any) => {
//   try {

//     let query

//     let searchFild = req.query.email

//     let user = await SignupDt.find({isDeleted: false , $or:[ {email:{$regex:searchFild,$options:'$i'},firstname:{$regex:searchFild,$options:'$i'}} ]  } ) 



//     /**
//      try {
//   let query;


//   const searchFild = req.query.username

//   const search = await vamsi.find({
//     $or:[
//     {username:{$regex:searchFild,$options:'$i'}}
//     ]
//   })


//   let uiValues = {
//     filtering: {},
//     sorting: {},
//   };

//   const reqQuery = { ...req.query };

//   const removeFields = ["sort"];

//   removeFields.forEach((val) => delete reqQuery[val]);

//   const filterKeys = Object.keys(reqQuery);
//   const filterValues = Object.values(reqQuery);

//   filterKeys.forEach(
//     (val, idx) => (uiValues.filtering[val] = filterValues[idx])
//   );

//   let queryStr = JSON.stringify(reqQuery);

//   queryStr = queryStr.replace(
//     /\b(gt|gte|lt|lte|in)\b/g,
//     (match) => `$${match}`
//   );

//   query = vamsi.find(JSON.parse(queryStr));

//   if (req.query.sort) {
//     const sortByArr = req.query.sort.split(",");

//     sortByArr.forEach((val) => {
//       let order;

//       if (val[0] === "-") {
//         order = "descending";
//       } else {
//         order = "ascending";
//       }

//       uiValues.sorting[val.replace("-", "")] = order;
//     });

//     const sortByStr = sortByArr.join(" ");

//     query = query.sort(sortByStr);
//   } else {
//     query = query.sort("-fullname");
//   }

//   const bootcamps = await query;

//   const maxPrice = await vamsi.find()
//     .sort({ fullname: -1 })
//     .limit(1)
//     .select("-_id fullname");

//   const minPrice = await vamsi.find()
//     .sort({ fullname: 1 })
//     .limit(1)
//     .select("-_id fullname");

//   uiValues.maxPrice = maxPrice[0].price;
//   uiValues.minPrice = minPrice[0].price;

//     //let allprofiles = await vamsi.find();
//     return res.status(200).json({
//       success: true,
//       data: bootcamps,
//       sea:search,
//       uiValues,
//     });
//      */

//     res.status(200).json({
//       message: "data",
//       result: user
//     })
//   } catch (error) {
//     console.log(error)
//     res.status(500).json({
//       message: "internal server error",
//       error: error
//     })
//   }
// }

// //update all users 

// /**
//  * @api {put} /updatealluser update user
//  * @apiGroup Admin
//  * @apiBody (Request body) {String} firstname user firstname
//  * @apiBody (Request body) {String} lastname user lastname
//  * @apiBody (Request body) {String} password user password
//  * @apiBody (Request body) {String} confirmPassword user confirmPassword
//  * @apiBody (Request body) {String} role user role
//  * 
//  * @apiSampleRequest /updatealluser
//  * 
//  * @apiQuery {String} email email is in the string format
//  * @apiHeader {String} x-token Users unique access-key
//  * 
//  * @apiSuccessExample {json} Success-Response
//  * HTTP/1.1 200 OK
//  * {
//  *    "message":"user update sucessfully"
//  *              " result ": {
//  *              "firstname": " ",
//  *              "lastname": " ",
//  *              "password": " ",
//  *              "confirmPassword": " ",
//  *              "role":" ",
//  *    }
//  *        
//  * }
//  * @apiErrorExample {json} Error-Response:
//  *   HTTP/1.1 404 Not Found
//  *     {
//  *       "message": "user is not present in our Database"
//  *     }
//  *
//  *  HTTP/1.1 400 
//  *  {
//  *    "message":"password and confirmpassword should be same"
//  *  }
//  * 
//  *  HTTP/1.1 500 
//  * {
//  *    "message":"Internal Server Error"
//  * }
//  * 
//  */

//  const updatealluser =async (req:any,res:any) => {
//   try {
//     let users: any = await SignupDt.find({email: req.query.email,isDeleted: false});
//     if (!users) {
//       return res.status(404).json({
//         success: false,
//         message: "user is not present",
//       });
//     }
//     if (users?.isDeleted) {
//       return res.status(404).json({
//         message: "user is not present"
//       })
//     }
//     const salt = bcrypt.genSaltSync(10);
//     let password = req.body.password || users.password
//     let confirmPassword = req.body.confirmPassword || users.confirmPassword

//     if (password !== confirmPassword) {
//       return res
//         .status(400)
//         .send(" password and confirmpassword should be same");
//     }

//     const hass = bcrypt.hashSync(password, salt);
//     const conHass = bcrypt.hashSync(confirmPassword, salt);

//     const newUserData = {
      
//       email: users.email,
//       firstname: req.body.firstname || users.firstname,
//       lastname: req.body.lastname || users.lastname,
//       password: hass,
//       confirmPassword: conHass,
//       role:req.body.role || users.role
//     };

//     const user = await SignupDt.findOneAndUpdate({ email: req.query.email }, newUserData, {
//       new: true,
//       runValidators: false,
//       userFindAndModify: true,
//     });
//     return res.status(200).json({
//       message: "user updated sucessfully",
//       result: user
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).send("Internal server");
//   }
// }

// //delete all user

// /**
//  * @api {delete} /deletealluser/:id delete user by id
//  * @apiGroup Admin
 
//  * @apiParam {Number} id Users unique ID.
//  * @apiHeader {String} x-token Users unique access-key


//  * @apiParamExample {json} Request-Example:
//  *     {
//  *       "id": " "
//  *     }
//  * 
 
//  * @apiSuccessExample {json} Success-Response
//  * HTTP/1.1 200 OK
//  * {
//  *           message: "Your slot was deleted"
//  * }
//  *@apiSampleRequest /deletealluser/:id
//  *@apiErrorExample {json} Error-Response:
//  *   HTTP/1.1 404 Not Found
//  *     {
//  *        "success":false
//  *       "message":  "Staff dose not present"
//  *     }
//  * 
//  * HTTP/1.1 500 
//  * {
//  * message:"Internal Server Error",
//  * error : { }
//  * }

//  */

// const deletealluser =async (req:any , res:any) => {
//   try {
//     const users: any = await SignupDt.findById(req.params.id);
//     console.log(users)
//     if (!users) {
//       return res.status(404).json({
//         "success":false,
//         error: "Staff dose not present"

//       })
//     }
//     if (users.isDeleted === true) {
//       return res.status(404).json({
//         "success":false,
//         error:  "Staff dose not present"
//       });
//     }
//     const softdelete = await SignupDt.findOneAndUpdate({ _id: users._id }, { isDeleted: true })
//     res.status(200).json({
//       message: "deleted success",
//       //data: softdelete
//     });
//   }
//   catch (error) {
//     res.status(500).json({
//       message:"Internal Server Error",
//       error: error
//     });
//   }
// }

// /**
//  * @api {put} /profile profilePic
//  * @apiGroup users
//  * @apiBody (Request body) {file} image user profilePic
//  * 
//  * 
//  * @apiSampleRequest /profile
//  * 
//  * @apiQuery {String} email email is in the string format
//  * @apiHeader {String} x-token Users unique access-key
//  * 
//  * @apiSuccessExample {json} Success-Response
//  * HTTP/1.1 200 OK
//  * {
//  *    "message":"profile update sucessfully"
//  *              " result ": {
//  *              "id":" ",
//  *              "firstname": " ",
//  *              "lastname": " ",
//  *              "password": " ",
//  *              "confirmPassword": " ",
//  *              "image":" ",
//  *              "role":" "
//  *    }
//  *        
//  * }
//  * @apiErrorExample {json} Error-Response:
//  *   HTTP/1.1 404 Not Found
//  *     {
//  *       "message": "user is not present in our Database"
//  *     }
//  *
//  * 
//  *  HTTP/1.1 500 
//  * {
//  * "message":"Internal Server Error"
//  * }
//  * 
//  */

// const profile =  async (req :any, res :any, next:any) => {

//   try {
//     let userd : any = await SignupDt.findOne({email: req.query.email});
    
//     if (!userd) {
//       return res.status(404).json({
//         success: false,
//         message: "user is not present in our Database",
//       });
//     }
//     //console.log(req.params.id) 
//     // console.log(req.file.filename)
    
      
//       //image:req.file.filename
      
    
//     const user = await SignupDt.findOneAndUpdate({email:req.query.email}, {image:req.file.filename}, {
//       new: true,
//       runValidators: true,
//       userFindAndModify: false,
//     });
    
//     res.status(200).send({
//       message: "profile update sucessfully",
//       result : user,
//     });
//   } catch (error) {
//     res.status(500).json({
//       message:"Internal Server Error"
//     })
//   }
// }



// export { ondays, GetAppointment, deletealluser ,updatealluser ,updateSlot,getallusers, DaysSoftDelete, softDelete, bookingSlots, updateBooking,updateuser,logingetuser,deleteuser,getallstaffs ,signin ,getBookingsByEmail, getDaysByEmail,profile }
