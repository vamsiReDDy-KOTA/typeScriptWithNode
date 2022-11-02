import { BaseItem, Item } from "./module";
//import { readFile, writeFile } from "fs";

import moment from 'moment-timezone';
//import moments from 'moment'
import mongoose from "mongoose";
//import { Times } from "../moduls/timesInterface";
import DaysModel from "../moduls/days"
import BookingModel from "../moduls/bookingModel"
import Days from "../moduls/daysInterface"
import days from "../moduls/days";
import { AnyNsRecord } from "dns";
import Booking from "../moduls/bookingModelInterface";
import nodemailer from "nodemailer"
import { Controller } from "tsoa";

export class Appointment extends Controller { }

// User Registration API
/**
 * @api {post} /api/registration User Registration API
 * @apiGroup User
 * @apiBody (Request body) {String} name User name
 * @apiBody (Request body) {String} email User email
 * @apiBody (Request body)  provider=local User provider
 * @apiBody (Request body) {String='agent','user'} role User role
 * @apiBody (Request body) {String} [password] User Password (if required Only provider is local)
 * @apiParamExample {json} Input
 * {
 *      "name" : "",
 *      "email" : "",
 *      "provider" : "",
 *      "role" : "",
 *      "password":""
 * }
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *      "message": "Registration Successfully.",
 *      "status": "1"
 * }
 * @apiSampleRequest /api/registration
 * @apiErrorExample {json} User error
 * HTTP/1.1 400 Internal Server Error
 */
const ondays = async (req: any, res: any) => {
  try {
    let user = await DaysModel.findOne({ email: req.body.email })
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
      BookedDate: req.body.BookedDate,
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

const GetAppointment = async (req: any, res: any) => {
  try {
    let date = req.query.date
    let slots = await DaysModel.findOne({ email: req.query.email })
    if(!slots){
      return res.status(400).json({
        Message : "user is not present in our database"
      })
    }
    if (slots?.isDeleted) {
      return res.status(400).json({
        message: "user is not present in our database"
      })
    }
    let timeZn: any = slots?.TimeZone

    let userDt = moment().tz(timeZn).format("DD-MM-YYYY")

    let userEnteredDt = moment(date).format("YYYY-MM-DD")
    let ptz = moment(date).format('DD-MM-YYYY')
    let userEnteredDay = moment(userEnteredDt).format('dddd')
    let currentTime = moment().tz(timeZn).format('HH:mm')

    if (userDt <= ptz) {
      const slot = await BookingModel.find({ AppointmentDate: userEnteredDt, email: req.query.email }, { "SlotsTime": "$SlotsTime" })
      console.log(slot)
      let allslots: any = []
      for (let i = 0; i < slot.length; i++) {
        allslots.push(slot[i].SlotsTime)
      }

      switch (userEnteredDay) {
        case "Monday":
          if (!slots?.Monday[0]) {
            return res.status(400).send("slots are not there")
          }
          let MbreakTime = slots?.Monday[0].breakTime
          let MStartbreakTime = MbreakTime.filter((_: any, i: any) => !(i % 2));
          let MEndbreakTime = MbreakTime.filter((_: any, i: any) => (i % 2));
          let MstartTime: any = slots?.Monday[0].startTime
          let MendTime: any = slots?.Monday[0].endTime
          let MallTime: any[] = [];
          let MallendTime: any = []
          let Mstartti = slots?.Monday[0].startTime[0]
          let Mall: any = []
          for (let i = 0; i < MstartTime.length; i++) {
            let startt = moment(MstartTime[i], "HH:mm");
            let endt = moment(MendTime[i], "HH:mm");
            while (startt < endt) {
              Mall.push(startt.format("hh:mm A"));
              startt.add(30, 'minutes');
            }
          }
          for (let i = 0; i < MStartbreakTime.length; i++) {
            let startt = moment(MStartbreakTime[i], "HH:mm");
            let endt = moment(MEndbreakTime[i], "HH:mm");
            while (startt < endt) {
              MallendTime.push(startt.format("hh:mm A"));
              startt.add(30, 'minutes');
            }
          }
          //console.log(allendTime)
          let Mremovingslots = MallendTime.concat(allslots.flat())

          Mall = Mall.filter((v: any) => !Mremovingslots.includes(v))

          //console.log(Mall)
          if (userDt === ptz) {
            if (currentTime > Mstartti) {
              console.log("first")
              for (let i = 0; i < MstartTime.length; i++) {
                let startt = moment(MstartTime[i], "HH:mm")
                let endt = moment(MendTime[i], "HH:mm");
                while (startt < endt) {
                  MallTime.push(startt.add(30,'m').format("hh:mm A"));
                }
              }
              let h = moment(currentTime, 'HH:mm').format('HH')
              let m = moment(currentTime, 'HH:mm').format('mm')
              if (m >= '1' && m <= '29') {
                m = '00'
              }
              else if (m >= '31' && m <= '59') {
                m = '30'
              }
              let ti = `${h}:${m}`
              let st = moment(ti, 'HH:mm')
              let startt = moment(Mstartti, "HH:mm")
              console.log(startt)
              let hello :any[] = []
           
              while (startt < st) {
                hello.push(startt.add(30, 'minutes').format('hh:mm A'));
              }
              let hii = MallTime.filter((k:any)=>!hello.includes(k))
              let removingslots = MallendTime.concat(allslots.flat())
      
              hii = hii.filter((v: any) => !removingslots.includes(v))

              if (MallTime.length === 0) {
                return res.status(400).json({
                  status: false,
                  message: "slots are not present"
                })
              }
              return res.status(200).json({
                message: "slots",
                result: MallTime
              })
            }
            else if (currentTime <= Mstartti) {
              console.log('else if')
              return res.status(200).json({
                message: "slots",
                result: MallTime
              })

            }
          }
          else {
            console.log("else")
            return res.status(200).json({
              message: "slots",
              result: MallTime
            })

          }
          break;
        case "Tuesday":
          console.log("tuesday")
          if (!slots?.Tuesday[0]) {
            return res.status(400).send("slots are not there")
          }
          let TubreakTime = slots?.Tuesday[0].breakTime
          let TuStartbreakTime = TubreakTime.filter((_: any, i: any) => !(i % 2));
          let TuEndbreakTime = TubreakTime.filter((_: any, i: any) => (i % 2));
          let TustartTime: any = slots?.Tuesday[0].startTime
          let TuendTime: any = slots?.Tuesday[0].endTime
          let TuallTime: any[] = [];
          let TuallendTime: any = []
          let Tustartti = slots?.Tuesday[0].startTime[0]

          let Tuall: any = []
          for (let i = 0; i < TustartTime.length; i++) {
            let startt = moment(TustartTime[i], "HH:mm");
            let endt = moment(TuendTime[i], "HH:mm");
            while (startt < endt) {
              Tuall.push(startt.format("hh:mm A"));
              startt.add(30, 'minutes');
            }
          }

          for (let i = 0; i < TuStartbreakTime.length; i++) {
            let startt = moment(TuStartbreakTime[i], "HH:mm");
            let endt = moment(TuEndbreakTime[i], "HH:mm");
            while (startt < endt) {
              TuallendTime.push(startt.format("hh:mm A"));
              startt.add(30, 'minutes');
            }
          }
          // console.log(TuallendTime)
          let Turemovingslots = TuallendTime.concat(allslots.flat())
          Tuall = Tuall.filter((v: any) => !Turemovingslots.includes(v))

          if (userDt === ptz) {

            if (currentTime > Tustartti) {
              console.log("first")
              for (let i = 0; i < TustartTime.length; i++) {
                let startt = moment(TustartTime[i], "HH:mm");
                let endt = moment(TuendTime[i], "HH:mm");
                 while (startt < endt) {
                  TuallTime.push(startt.add(30,'m').format("hh:mm A"));
                            }
              }
              // let AFallTime = TuallTime.filter(v => !Tuall.includes(v))
              let h = moment(currentTime, 'HH:mm').format('HH')
              let m = moment(currentTime, 'HH:mm').format('mm')
              if (m >= '1' && m <= '29') {
                m = '00'
              }
              else if (m >= '31' && m <= '59') {
                m = '30'
              }
              let ti = `${h}:${m}`
              let st = moment(ti, 'HH:mm')
              let startt = moment(Tustartti, "HH:mm")
              console.log(startt)
              let hello :any[] = []
           
              while (startt < st) {
                hello.push(startt.add(30, 'minutes').format('hh:mm A'));
              }
              let hii = TuallTime.filter((k:any)=>!hello.includes(k))
              let removingslots = TuallendTime.concat(allslots.flat())
              console.log(removingslots)
              hii = hii.filter((v: any) => !removingslots.includes(v))
              hii.shift()
              if (hii.length === 0) {
                return res.status(400).json({
                  status: false,
                  message: "slota are not present"
                })
              }
              return res.status(200).json({
                message: "slots",
                result: hii
              })

            }
            else if (currentTime <= Tustartti) {
              console.log('else if')
              return res.status(200).json({
                message: "slots",
                result: Tuall
              })

            }
          }
          else {
            console.log("else")

            return res.status(200).json({
              message: "slots",
              result: Tuall
            })

          }
          break
        case "Wednesday":
          console.log(" This is wednesday");
          if (!slots?.Wednesday[0]) {
            return res.status(400).send("slots are not there")
          }
          let WbreakTime:any = slots?.Wednesday[0].breakTime
          let WStartbreakTime = WbreakTime.filter((_: any, i: any) => !(i % 2));
          let WEndbreakTime = WbreakTime.filter((_: any, i: any) => (i % 2));
          let WstartTime: any = slots?.Wednesday[0].startTime
          let WendTime: any = slots?.Wednesday[0].endTime
          let WallTime: any[] = [];
          let WallendTime: any = []
          let Wstartti = slots?.Wednesday[0].startTime[0]
          console.log(Wstartti)

          let Wall: any = []
          for (let i = 0; i < WstartTime.length; i++) {
            let startt = moment(WstartTime[i], "HH:mm");
            let endt = moment(WendTime[i], "HH:mm");
                while (startt < endt) {
                          Wall.push(startt.format("hh:mm A"));
              startt.add(30, 'minutes');
            }
          }

          for (let i = 0; i < WStartbreakTime.length; i++) {
            let startt = moment(WStartbreakTime[i], "HH:mm");
            let endt = moment(WEndbreakTime[i], "HH:mm");
            while (startt < endt) {
              WallendTime.push(startt.format("hh:mm A"));
              startt.add(30, 'minutes');
            }
          }
          //console.log(Wall)
          let removingslots = WallendTime.concat(allslots.flat())
          Wall = Wall.filter((v: any) => !removingslots.includes(v))

          if (userDt === ptz) {


            if (currentTime > Wstartti) {
              console.log("first")
              for (let i = 0; i < WstartTime.length; i++) {
                let startt = moment(WstartTime[i], "HH:mm")
                let endt = moment(WendTime[i], "HH:mm");
                while (startt < endt) {
                  WallTime.push(startt.add(30, 'minutes').format('hh:mm A'));
                }
              }
                let h = moment(currentTime, 'HH:mm').format('HH')
                let m = moment(currentTime, 'HH:mm').format('mm')
                if (m >= '1' && m <= '29') {
                  m = '00'
                }
                else if (m >= '31' && m <= '59') {
                  m = '30'
                }
                let ti = `${h}:${m}`
                let st = moment(ti, 'HH:mm')
                let startt = moment(Wstartti, "HH:mm")
                console.log(startt)
                let hello :any[] = []
             
                while (startt < st) {
                  hello.push(startt.add(30, 'minutes').format('hh:mm A'));
                }
                let hii = WallTime.filter((k:any)=>!hello.includes(k))
              let removingslots = WallendTime.concat(allslots.flat())
              hii = hii.filter((v: any) => !removingslots.includes(v))
              if (WallTime.length === 0) {
                return res.status(400).json({
                  status: false,
                  message: "slota are not present"
                })
              }
              return res.status(200).json({
                message: "slots",
                result: hii
              })

            }


            else if (currentTime <= Wstartti) {
              console.log('else if')

              return res.status(200).json({
                message: "slots",
                result: Wall
              })

            }
          }
          else {
            console.log("else")

            return res.status(200).json({
              message: "slots",
              result: Wall
            })

          }
          break
        case "Thursday":
          console.log("thursday")
          if (!slots?.Thursday[0]) {
            return res.status(400).send("slots are not there")
          }
          let breakTime = slots?.Thursday[0].breakTime
          let StartbreakTime = breakTime.filter((_: any, i: any) => !(i % 2));
          let EndbreakTime = breakTime.filter((_: any, i: any) => (i % 2));
          let startTime: any = slots?.Thursday[0].startTime
          let endTime: any = slots?.Thursday[0].endTime
          let allTime: any[] = [];
          let allendTime: any = []
          let startti = slots?.Thursday[0].startTime[0]

          let Tall: any = []
          for (let i = 0; i < startTime.length; i++) {
            let startt = moment(startTime[i], "HH:mm");
            let endt = moment(endTime[i], "HH:mm");
            while (startt < endt) {
              Tall.push(startt.format("hh:mm A"));
              startt.add(30, 'minutes');
            }
          }


          for (let i = 0; i < StartbreakTime.length; i++) {
            let startt = moment(StartbreakTime[i], "HH:mm");
            let endt = moment(EndbreakTime[i], "HH:mm");
            while (startt < endt) {
              allendTime.push(startt.format("hh:mm A"));
              startt.add(30, 'minutes');
            }
          }
          //console.log(allendTime)
          let thremovingslots = allendTime.concat(allslots.flat())
          Tall = Tall.filter((v: any) => !thremovingslots.includes(v))

          if (userDt === ptz) {
            if (currentTime > startti) {
              console.log("first")
              for (let i = 0; i < startTime.length; i++) {
                let startt: any = moment(startTime[i], "HH:mm");
                let endt = moment(endTime[i], "HH:mm");
                while (startt < endt) {
                  allTime.push(startt.add(30,'m').format("hh:mm A"));
                  }
              }
              let h = moment(currentTime, 'HH:mm').format('HH')
              let m = moment(currentTime, 'HH:mm').format('mm')
              if (m >= '1' && m <= '29') {
                m = '00'
              }
              else if (m >= '31' && m <= '59') {
                m = '30'
              }
              let ti = `${h}:${m}`
              let st = moment(ti, 'HH:mm')
              let startt = moment(startti, "HH:mm")
              console.log(startt)
              let hello :any[] = []
           
              while (startt < st) {
                hello.push(startt.add(30, 'minutes').format('hh:mm A'));
              }
              let hii = allTime.filter((k:any)=>!hello.includes(k))
              let removingslots  = allendTime.concat(allslots.flat(), EndbreakTime.flat())
              //console.log(removingslots)
              hii = hii.filter((v: any) => !removingslots.includes(v))
              hii.shift()
              if (hii.length === 0) {
                return res.status(400).json({
                  status: false,
                  message: "slota are not present"
                })
              }
              return res.status(200).json({
                message: "slots",
                result: hii
              })
            }

            else if (currentTime <= startti) {
              console.log("else if")


              return res.status(200).json({
                message: "slots",
                result: Tall
              })

            }
          }
          else {
            console.log('elif')
            return res.status(200).json({
              message: "slots",
              result: Tall
            })

          }


          break

        case "Friday":
          console.log("friday")
          if (!slots?.Friday[0]) {
            return res.status(400).send("slots are not there")
          }

          let FbreakTime = slots?.Friday[0].breakTime
          let FStartbreakTime = FbreakTime.filter((_: any, i: any) => !(i % 2));
          let FEndbreakTime = FbreakTime.filter((_: any, i: any) => (i % 2));
          let FstartTime: any = slots?.Friday[0].startTime
          let FendTime: any = slots?.Friday[0].endTime
          let FallTime: any[] = [];
          let FallendTime: any = []
          let Fstartti = slots?.Friday[0].startTime[0]
          console.log(Fstartti)

          let all: any = []
          for (let i = 0; i < FstartTime.length; i++) {
            let startt = moment(FstartTime[i], "HH:mm");
            let endt = moment(FendTime[i], "HH:mm");
            while (startt < endt) {
              all.push(startt.format("hh:mm A"));
              startt.add(30, 'minutes');
            }
          }

          for (let i = 0; i < FStartbreakTime.length; i++) {
            let startt = moment(FStartbreakTime[i], "HH:mm");
            let endt = moment(FEndbreakTime[i], "HH:mm");
            while (startt < endt) {
              FallendTime.push(startt.format("hh:mm A"));
              startt.add(30, 'minutes');
            }
          }
          //console.log(allendTime)
          let Faremovingslots = FallendTime.concat(allslots.flat())
          //console.log(removingslots)
          all = all.filter((v: any) => !Faremovingslots.includes(v))

          if (userDt === ptz) {

            if (currentTime > Fstartti) {
              console.log("first")
              for (let i = 0; i < FstartTime.length; i++) {
                let startt = moment(FstartTime[i], "HH:mm")
                let endt = moment(FendTime[i], "HH:mm");
               while (startt < endt) {
                  FallTime.push(startt.format("hh:mm A"));
                  startt.add(30, 'm');
                }
              }

              let h = moment(currentTime, 'HH:mm').format('HH')
              let m = moment(currentTime, 'HH:mm').format('mm')
              if (m >= '1' && m <= '29') {
                m = '00'
              }
              else if (m >= '31' && m <= '59') {
                m = '30'
              }
              let ti = `${h}:${m}`
              let st = moment(ti, 'HH:mm')
              let startt = moment(Fstartti, "HH:mm")
              console.log(startt)
              let hello :any[] = []
           
              while (startt < st) {
                hello.push(startt.add(30, 'minutes').format('hh:mm A'));
              }
              let hii = FallTime.filter((k:any)=>!hello.includes(k))
              // let AFallTime = FallTime.filter(v => !all.includes(v))

              let removingslots = FallendTime.concat(allslots.flat())
              //console.log(removingslots)
              hii = hii.filter((v: any) => !removingslots.includes(v))
              hii.shift()
              if (hii.length === 0) {
                return res.status(400).json({
                  status: false,
                  message: "slota are not present"
                })
              }
              return res.status(200).json({
                message: "slots",
                result: hii
              })
            }
            else if (currentTime <= Fstartti) {
              console.log('else if')


              return res.status(200).json({
                message: "slots",
                result: all
              })

            }
          }
          else {
            console.log("else")

            return res.status(200).json({
              message: "slots",
              result: all
            })

          }

          break

        case "Saturday":
          console.log("saturday");
          if (!slots?.Saturday[0]) {
            return res.status(400).send("slots are not there")
          }
          let SbreakTime = slots?.Saturday[0].breakTime
          let SStartbreakTime = SbreakTime.filter((_: any, i: any) => !(i % 2));
          console.log("rii")
          let SEndbreakTime = SbreakTime.filter((_: any, i: any) => (i % 2));
          let SstartTime: any = slots?.Saturday[0].startTime
          let SendTime: any = slots?.Saturday[0].endTime
          let SallTime: any[] = [];
          let SallendTime: any = []
          let Sstartti = slots?.Saturday[0].startTime[0]
          console.log(Sstartti)

          let Sall: any = []
          for (let i = 0; i < SstartTime.length; i++) {
            let startt = moment(SstartTime[i], "HH:mm");
            let endt = moment(SendTime[i], "HH:mm");
            while (startt < endt) {
              Sall.push(startt.format("hh:mm A"));
              startt.add(30, 'minutes');
            }
          }

          for (let i = 0; i < SStartbreakTime.length; i++) {
            let startt = moment(SStartbreakTime[i], "HH:mm");
            let endt = moment(SEndbreakTime[i], "HH:mm");
            while (startt < endt) {
              SallendTime.push(startt.format("hh:mm A"));
              startt.add(30, 'minutes');
            }
          }
          //console.log(allendTime)
          let saremovingslots = SallendTime.concat(allslots.flat())
          console.log(removingslots)
          Sall = Sall.filter((v: any) => !saremovingslots.includes(v))


          if (userDt === ptz) {
            if (currentTime > Sstartti) {
              console.log("first")
              for (let i = 0; i < SstartTime.length; i++) {
                let startt = moment(SstartTime[i], "HH:mm");
                let endt = moment(SendTime[i], "HH:mm");
                while (startt < endt) {
                  SallTime.push(startt.format("hh:mm A"));
                  startt.add(30, 'minutes');
                }
              }
              let h = moment(currentTime, 'HH:mm').format('HH')
              let m = moment(currentTime, 'HH:mm').format('mm')
              if (m >= '1' && m <= '29') {
                m = '00'
              }
              else if (m >= '31' && m <= '59') {
                m = '30'
              }
              let ti = `${h}:${m}`
              let st = moment(ti, 'HH:mm')
              let startt = moment(Sstartti, "HH:mm")
              console.log(startt)
              let hello :any[] = []
           
              while (startt < st) {
                hello.push(startt.add(30, 'minutes').format('hh:mm A'));
              }
              let hii = SallTime.filter((k:any)=>!hello.includes(k))

              let removingslots = FallendTime.concat(allslots.flat())
              //console.log(removingslots)
              hii = hii.filter((v: any) => !removingslots.includes(v))
              hii.shift()
              if (SallTime.length === 0) {
                return res.status(400).json({
                  status: false,
                  message: "slota are not present"
                })
              }
              return res.status(200).json({
                message: "slots",
                result: hii
              })

            }
            else if (currentTime <= Sstartti) {
              console.log('else if')


              return res.status(200).json({
                message: "slots",
                result: Sall
              })

            }
          }
          else {
            console.log("else")
            return res.status(200).json({
              message: "slots",
              result: Sall
            })

          }
          break

        case "Sunday":
          if (!slots?.Sunday[0]) {
            return res.status(400).send("slots are not there")
          }
          let SnbreakTime = slots?.Sunday[0].breakTime
          let SnStartbreakTime = SnbreakTime.filter((_: any, i: any) => !(i % 2));
          console.log("rii")
          let SnEndbreakTime = SnbreakTime.filter((_: any, i: any) => (i % 2));
          let SnstartTime: any = slots?.Saturday[0].startTime
          let SnendTime: any = slots?.Saturday[0].endTime
          let SnallTime: any[] = [];
          let SnallendTime: any = []
          let Snstartti = slots?.Saturday[0].startTime[0]
          console.log(Sstartti)
          let Snall: any = []
          for (let i = 0; i < SnstartTime.length; i++) {
            let startt = moment(SnstartTime[i], "HH:mm");
            let endt = moment(SnendTime[i], "HH:mm");
            while (startt < endt) {
              Snall.push(startt.format("hh:mm A"));
              startt.add(30, 'minutes');
            }
          }

          for (let i = 0; i < SnStartbreakTime.length; i++) {
            let startt = moment(SnStartbreakTime[i], "HH:mm");
            let endt = moment(SnEndbreakTime[i], "HH:mm");
            while (startt < endt) {
              SnallendTime.push(startt.format("hh:mm A"));
              startt.add(30, 'minutes');
            }
          }
          //console.log(allendTime)
          let Snremovingslots = SnallendTime.concat(allslots.flat())
          Snall = Snall.filter((v: any) => !Snremovingslots.includes(v))
          if (userDt === ptz) {
            if (currentTime > Snstartti) {
              console.log("first")
              for (let i = 0; i < SnstartTime.length; i++) {
                let startt = moment(SnstartTime[i], "HH:mm")
                let endt = moment(SnendTime[i], "HH:mm");
                while (startt < endt) {
                  SnallTime.push(startt.format("hh:mm A"));
                  startt.add(30, 'minutes');
                }
              }
              let h = moment(currentTime, 'HH:mm').format('HH')
              let m = moment(currentTime, 'HH:mm').format('mm')
              if (m >= '1' && m <= '29') {
                m = '00'
              }
              else if (m >= '31' && m <= '59') {
                m = '30'
              }
              let ti = `${h}:${m}`
              let st = moment(ti, 'HH:mm')
              let startt = moment(Snstartti, "HH:mm")
              console.log(startt)
              let hello :any[] = []
           
              while (startt < st) {
                hello.push(startt.add(30, 'minutes').format('hh:mm A'));
              }
              let hii = SnallTime.filter((k:any)=>!hello.includes(k))
              // console.log(SnallTime)
              // let AFallTime = SnallTime.filter(v => !all.includes(v))
              // console.log(AFallTime)
              let removingslots = SnallendTime.concat(allslots.flat())
              //console.log(removingslots)
              hii = hii.filter(v => !removingslots.includes(v))
              hii.shift()
              if (hii.length === 0) {
                return res.status(400).json({
                  status: false,
                  message: "slots are not present"
                })
              }
              return res.status(200).json({
                message: "slots",
                result: SnallTime
              })
            }
            else if (currentTime <= Snstartti) {
              console.log('else if')

              //SnallTime = SnallTime.filter(v => !SnallendTime.includes(v))

              return res.status(200).json({
                message: "slots",
                result: Snall
              })

            }
          }
          else {
            console.log("else")


            return res.status(200).json({
              message: "slots",
              result: Snall
            })

          }
          console.log("sunday");

          break
      }

    }

    else {
      return res.status(400).json({
        message: "slots are not present hui"
      })
    }
  } catch (error) {
    res.status(400).send(error)
    console.log(error)
  }
}

const updateSlot = async (req: any, res: any) => {
  try {
    let users: any = await DaysModel.findOne({ email: req.query.email });
    if (!users) {
      return res.status(500).json({
        success: false,
        message: "user is not present",
      });
    }
    if (users?.isDeleted) {
      return res.status(400).json({
        message: "user is not present"
      })
    }
    const newUserData = {
      TimeZone: req.body.TimeZone || users.TimeZone,
      email: users.email,
      phoneNo: req.body.phoneNo || users.phoneNo,
      name: req.body.name || users.name,
      BookedDate: req.body.BookedDate || users.BookedDate,
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
};

const bookingSlots = async (req: any, res: any) => {

  let user = await BookingModel.find({ TimeZone: req.body.TimeZone, AppointmentDate: req.body.AppointmentDate, email: req.body.email }, { "SlotsTime": "$SlotsTime" })
  let daysdata = await DaysModel.findOne({ email: req.body.email })

  if (!daysdata) {
    return res.status(400).json({
      status: false,
      message: "user is not present"
    })
  }

  let date = moment().tz(req.body.TimeZone).format('YYYY-MM-DD')
  console.log(date)
  let enterdat = moment(req.body.AppointmentDate).format('YYYY-MM-DD')
  console.log(enterdat)
  if (date === enterdat) {
    console.log("vamsi")
  }
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

const updateBooking = async (req: any, res: any) => {
  try {

    let users: any = await BookingModel.findById(req.query.id);
    console.log(users.TimeZone)
    //console.log(use)
    if (!users) {
      //console.log("hello")
      return res.status(400).json({
        success: false,
        message: "user is not presnt",
      });
    }
    let daysdata = await DaysModel.findOne({ email: req.body.email })
    console.log("hello")
    //console.log(daysdata)
    if (!daysdata) {
      return res.status(400).json({
        status: false,
        message: "user is not present"
      })
    }

    if (users?.isDeleted) {
      return res.status(400).json({
        message: "user is not there in our database"
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
      message: "user updated sucessfully",
      result: data
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Hello Internal server");
  }
};

const getBookingsByEmail = async (req: any, res: any) => {
  try {
    let user = await BookingModel.find({ email: req.query.email, isDeleted: false })
    if (!user) {
      return res.status(400).json({
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
      message: "internal error",
      error: error
    })
  }
}

const getDaysByEmail = async (req: any, res: any) => {
  try {
    let user = await DaysModel.find({ email: req.query.email, isDeleted: false })
    if (!user) {
      return res.status(400).json({
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
      message: "internal error",
      error: error
    })
  }
}

const softDelete = async (req: any, res: any) => {
  debugger
  try {
    const users: any = await BookingModel.findById(req.params.id);
    console.log(users)

    if (users.isDeleted === true) {
      return res.status(404).json({
        error: 'Requested category does not exist'
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
      message: "Your slot was deleted",
      data: softdelete
    });
  }
  catch (error) {
    res.status(400).json({
      error: error
    });
  }
};

const DaysSoftDelete = async (req: any, res: any) => {
  try {
    const users: any = await DaysModel.findById(req.params.id);
    console.log(users)
    if (!users) {
      return res.status(400).json({
        error: "Staff dose not present"

      })
    }
    if (users.isDeleted === true) {
      return res.status(404).json({
        error: 'Staff does not exist'
      });
    }
    const softdelete = await DaysModel.findOneAndUpdate({ _id: users._id }, { isDeleted: true })
    res.status(200).json({
      message: "deleted sucess",
      data: softdelete
    });
  }
  catch (error) {
    res.status(400).json({
      error: error
    });
  }
};

export { ondays, GetAppointment, updateSlot, DaysSoftDelete, softDelete, bookingSlots, updateBooking, getBookingsByEmail, getDaysByEmail }
