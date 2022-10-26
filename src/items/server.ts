import { BaseItem, Item } from "./module";
//import { readFile, writeFile } from "fs";
import { Items } from "./interface";
import * as Fs from "fs";
import Appoint from "../moduls/appointmentIntrerFace";
import AppointModel from "../moduls/appointment"
import userDt from "../moduls/appointMentDetals"
import appointment from "../moduls/appointment";
import { Detals } from "../moduls/appointMentDetalsInterFace";
import moment from 'moment-timezone';
import moments from 'moment'
import mongoose from "mongoose"; 
//import { Times } from "../moduls/timesInterface";
import DaysModel from "../moduls/days"
import Days from "../moduls/daysInterface"
import days from "../moduls/days";
import { AnyNsRecord } from "dns";



const addModel = async (req: any, res: any): Promise<void> => {
  try {
    const date = new Date().toLocaleString('en-US', {
      timeZone: req.body.DateYouBooked
    })
    const Data = DaysModel.find({}).populate({path:"DaysModel",strictPopulate:false}).exec((err, result) => {
      if(err){
        console.log({error :  err})
      }
       return result 
      }
      )
      console.log(Date)
    //const body = req.body as Pick<Appoint, "name" | "description" | "price" | "startTime" | "endTime" | "DateYouBooked" | "bookedID" | "dateOfAppointment"| "date" >;
    const Appointment: Appoint = new AppointModel({
      name: req.body.name,
      description: req.body.description,
      references : await DaysModel.findById({_id:"6335a5bade9a1a748447d6d4"}),
      //daysModel:Data,
      startTime: req.body.startTime,
      endTime: req.body.endTime,
      DateYouBooked: moment().tz(req.body.DateYouBooked).format(),
      dateOfAppointment: req.body.dateOfAppointment,
      conformBooking:req.body.conformBooking
    });
    const newAppoint: Appoint = await Appointment.save()
    //const allAppoint : Appoint[] = await Appointment.find()

    const Adates = moment().tz("Asia/Kolkata").format();
    console.log(Adates)

    res.status(201).json({
      message: 'appointment was booked',
      deatels: newAppoint
    })
  }
  catch (err) {
    console.log(err)
  }
}

const getApp = async (req: any, res: any): Promise<void> => {
  try {
    const allAppoint: Appoint[] = await appointment.find(
      {
        dateOfAppointment: "27-9-2022"
      },
      {
        "startTime": "$startTime",
        "endTime": "$endTime"
      }
    )
    
    //console.log(dates)

    const date = moment().tz("America/Los_Angeles").format();
    console.log(date)

    //const vl =  setTimeToDate()

    //const date = new Date('09/29/2022 04:12:00').toISOString()
    //console.log(date)

  //   while(time.isBetween(startTime,endTime,undefined,[])){
  //     result.push(time.toString());
  //     time = time.add(interval,'m');
  // }
      
  // while(startTime <= endTime){
  //   timeStops.push(new moment(startTime).format('HH:mm'));
  //   startTime.add(15, 'minutes');
  // }

    var time = {
      "start": "2022-09-27T16:30:00.000Z",
      "end": "2022-09-27T18:30:00.000Z"
    };

    var start = new Date(time.start).getTime();
    var end = new Date(time.end).getTime();

    //var diff = end - start;

    var chunks = [];
    var hold = start;
    var threshold = (60 * 30 * 1000); //30minutes
    for (var i = (start + threshold); i <= end; i += (threshold)) {
      var newEndTime = new Date(i);
      chunks.push({
        start: new Date(hold),
        end: newEndTime
      });
      
    }
    console.log("vamsi")
    console.log(chunks)
    const all = allAppoint.map(o => o.startTime)
    //console.log(all)
    const startTime = all.forEach(element => {
      console.log({ "startTime": element })
    })

    const endt = allAppoint.map(o => o.endTime)
    const endTime = endt.forEach(element => {
      console.log({ "endTime": element })
    })
    //var arrayToString = JSON.stringify(Object.assign({},all));
    //var stringToJsonObject = JSON.parse(arrayToString);
    //console.log(stringToJsonObject)
    res.status(201).json({
      message: 'booked time slots on the date',
      deatels: allAppoint,
      //StartTimeSlotsBooked:startTime , endTime

    })
  } catch (error) {
    console.log(error)
  }
}

const getSE = async (req: any, res: any): Promise<void> => {
  try {
    appointment.findOne(
      { _id: req.params.id }, (err: any, doc: any) => {
      if (err) {
        console.log(err)
      }
      else {
        res.status(200).json({
          "msg": "based on id you will get data",
          "result": doc
        })
      }
    })

    //console.log(OneAppoint)



    const date = new Date('09/29/2022 04:12:00').toISOString()
    console.log(date)
    var time = {
      "start": "2022-09-27T16:30:00.000Z",
      "end": "2022-09-27T18:30:00.000Z"
    };


    var start = new Date(time.start).getTime();
    var end = new Date(time.end).getTime();

    var chunks = [];
    var hold = start;
    var threshold = (60 * 30 * 1000); //30minutes
    for (var i = (start + threshold); i <= end; i += (threshold)) {
      var newEndTime = new Date(i);
      chunks.push({
        start: new Date(hold),
        end: newEndTime
      });
     
    }
    console.log(chunks)
  } catch (error) {
    console.log(error)
    res.status(500).send(error)
  }
}

const ondays = async (req:any , res:any)=>{
  try {
    const DaysModels : Days = new DaysModel({
    TimeZone : req.body.TimeZone,
    email:req.body.email,
    phoneNo:req.body.phoneNo,
    name:req.body.name,
    BookedDate:req.body.BookedDate,
    Monday : req.body.Monday,
    Tuesday:req.body.Tuesday,
    Wednesday:req.body.Wednesday,
    Thursday:req.body.Thursday,
    Friday:req.body.Friday,
    saturday:req.body.saturday,
    sunday:req.body.sunday,
    }) 
    const newDays: Days = await DaysModels.save()
    
    res.status(200).json({
      message : "this is date and time",
      result:newDays
    })

  } catch (error) {
    console.log(error)
    res.status(500).send(error)
  }
}

const send = async (req: any, res: any) => {
  try {
    const deate: Detals = new userDt({ name: req.body.name })
    const newdet: Detals = await deate.save()
    res.status(201).json({
      message: 'appointment was booked',
      deatels: newdet
    })

  }
  catch (err) {
    res.status(400).send(err)
  }
}
const GetAppointment =async (req:any,res:any) => {
  try {
  let date = req.query.date
   let slots = await DaysModel.findOne({email:req.query.email})
   let timeZn:any = slots.TimeZone
   //console.log(timeZn)
   let userDt = moment().tz(timeZn).format("DD-MM-YYYY")
   let userTime = moment().tz(timeZn).format("hh:mm A")
   let userDay = moment().tz(timeZn).format('dddd')
   console.log(userDay)
   //console.log(date)
   //console.log(userTime);

    let startTime :any = slots.Monday[0].startTime
    console.log(startTime)

    let endTime :any = slots.Monday[0].endTime
    console.log(endTime)
    console.log(startTime.length)
    let allTimes = [];
    let allTime = [];
    for( let i = 0;i<startTime.length;i++){
      let startt = moment(startTime[i], "HH:mm");
      let endt = moment(endTime[i], "HH:mm");
      while (startt < endt) {
        allTime.push(startt.format("hh:mm A")); 
        startt.add(30, 'minutes');
      }
    }

    console.log(allTime)
   let breakTime = slots?.Monday[0].breakTime
   console.log(breakTime)
   let StartbreakTime = breakTime.filter((_: any, i: any) => !(i % 2));
    console.log(StartbreakTime)
    let EndbreakTime = breakTime.filter((_:any, i:any) => (i % 2));
    console.log(EndbreakTime)
    let allendTime : any = []

    for( let i = 0;i<StartbreakTime.length;i++){
      let startt = moment(StartbreakTime[i], "HH:mm");
      let endt = moment(EndbreakTime[i], "HH:mm");
      while (startt < endt) {
        allendTime.push(startt.format("hh:mm A")); 
        startt.add(30, 'minutes');
      }
    }
    console.log(allendTime)
   allTime = allTime.filter(v => !allendTime.includes(v))

   console.log(allTime)
// let startt = moment(startTime, "HH:mm");
// let endt = moment(endTime, "HH:mm");
// while (startt < endt) {
//   allTimes.push(startt.format("hh:mm A"));
//   startt.add(30, 'minutes');
// }
//console.log(allTimes)

   let userEnteredDt = moment(date).format("YYYY-MM-DD")
   let ptz = moment(userEnteredDt).tz(timeZn).format('dddd DD-MM-YYYY')
   let userEnteredDay = moment(userEnteredDt).tz(timeZn).format('dddd')
   console.log(userEnteredDay)
   console.log(ptz);
   
   if(userDt<=ptz){
    console.log("hello")
   }
   
else{
   return res.status(400).json({
      message:"slots are not present"
    })
   }
  //  console.log(userEnteredDt)
  //  console.log(userDt)
   return res.status(200).json({
    message:"slots time",
    result : allTime
   })
  } catch (error) {
    res.status(400).send(error)
    console.log(error)
  }
}


export { addModel, getApp, send, getSE ,ondays,GetAppointment }
