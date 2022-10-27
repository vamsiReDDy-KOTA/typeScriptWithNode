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
import BookingModel from "../moduls/bookingModel"
import Days from "../moduls/daysInterface"
import days from "../moduls/days";
import { AnyNsRecord } from "dns";
import Booking from "../moduls/bookingModelInterface";



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
    Saturday:req.body.Saturday,
    Sunday:req.body.Sunday,
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
   let timeZn:any = slots?.TimeZone
   //console.log(timeZn)
   let userDt = moment().tz(timeZn).format("DD-MM-YYYY")
   let userTime = moment().tz(timeZn).format("hh:mm A")
   let userDay = moment().tz(timeZn).format('dddd')
   
    let startTime :any = slots?.Monday[0].startTime
    //console.log(startTime)

    let endTime :any = slots?.Monday[0].endTime
  

   let userEnteredDt = moment(date).format("YYYY-MM-DD")
   let ptz = moment(date).format('DD-MM-YYYY')
   let userEnteredDay = moment(userEnteredDt).format('dddd')
   let currentTime = moment().tz(timeZn).format('HH:mm')
  //  console.log(userEnteredDay)
  //  console.log(ptz);
   console.log(currentTime)
   let startti = slots?.Thursday[0].startTime[0]
   console.log(startti)
   if(currentTime>=startti){
    startti=currentTime
    let h = moment(startti,'HH:mm').format('HH')
    let m = moment(startti,'HH:mm').format('mm')
    if(m>='1' && m<='29'){
      m='00'
    }
    else if(m>='31' && m<='59'){
      m='30'
    }
    let ti = `${h}:${m}`
    let st = moment(ti,'HH:mm').format('HH:mm')
    console.log(st);
   }
   
   if(userDt<=ptz){
    const slot = await BookingModel.find({
      AppointmentDate: "2022-10-28"
    },
    {
      "SlotsTime": "$SlotsTime"
    })
    let allslots : any = []
    for( let i = 0;i<slot.length;i++){
        allslots.push(slot[i].SlotsTime)
    }
    console.log(allslots.flat())

    //console.log(slot[0].SlotsTime)

    switch (userEnteredDay) {
      case "Monday":
        console.log("Monday");
        let MbreakTime = slots?.Monday[0].breakTime
        let MStartbreakTime = MbreakTime.filter((_: any, i: any) => !(i % 2));
        console.log("rii")
         let MEndbreakTime = MbreakTime.filter((_:any, i:any) => (i % 2));
         let MstartTime :any = slots?.Monday[0].startTime
         let MendTime :any = slots?.Monday[0].endTime
         let MallTime: any[] = [];
         let MallendTime : any = []
         let Mstartti = slots?.Monday[0].startTime[0]
         console.log(Mstartti)
         if(userDt===ptz){
         if(currentTime>=Mstartti){
           console.log("first")
           for( let i = 0;i<MstartTime.length;i++){
             let startt = moment(MstartTime[i], "HH:mm").format('HH:mm');
             startt=currentTime
             let endt = moment(MendTime[i], "HH:mm");
             let h = moment(startt,'HH:mm').format('HH')
             let m = moment(startt,'HH:mm').format('mm')
             if(m>='1' && m<='29'){
               m='00'
             }
             else if(m>='31' && m<='59'){
               m='30'
             }
             let ti = `${h}:${m}`
             let st = moment(ti,'HH:mm')
             //console.log(st);
             while (st < endt) {
               MallTime.push(st.format("hh:mm A")); 
               st.add(30, 'minutes');
             }
           }
           console.log(MallTime)
           // let start = moment(startti,'HH:mm').format('HH:mm')
           let h = moment(Mstartti,'HH:mm').format('HH')
           let m = moment(Mstartti,'HH:mm').format('mm')
           if(m>='1' && m<='29'){
             m='00'
           }
           else if(m>='31' && m<='59'){
             m='30'
           }
           let ti = `${h}:${m}`
           let st = moment(ti,'HH:mm').format('HH:mm')
           console.log(st);
          }
          else if(currentTime<Mstartti){
           console.log('else if')
           for( let i = 0;i<MstartTime.length;i++){
             let startt = moment(MstartTime[i], "HH:mm");
             let endt = moment(MendTime[i], "HH:mm");
             while (startt < endt) {
               MallTime.push(startt.format("hh:mm A")); 
               startt.add(30, 'minutes');
             }
           }
     
           for( let i = 0;i<MStartbreakTime.length;i++){
             let startt = moment(MStartbreakTime[i], "HH:mm");
             let endt = moment(MEndbreakTime[i], "HH:mm");
             while (startt < endt) {
               MallendTime.push(startt.format("hh:mm A")); 
               startt.add(30, 'minutes');
             }
           }
           //console.log(allendTime)
          MallTime = MallTime.filter(v => !MallendTime.includes(v))
     
         return res.status(200).json({
           message:"slots",
           result:MallTime
          })
     
          }
         }
          else{
           console.log("else")
           for( let i = 0;i<MstartTime.length;i++){
             let startt = moment(MstartTime[i], "HH:mm");
             let endt = moment(MendTime[i], "HH:mm");
             while (startt < endt) {
               MallTime.push(startt.format("hh:mm A")); 
               startt.add(30, 'minutes');
             }
           }
           for( let i = 0;i<MStartbreakTime.length;i++){
             let startt = moment(MStartbreakTime[i], "HH:mm");
             let endt = moment(MEndbreakTime[i], "HH:mm");
             while (startt < endt) {
               MallendTime.push(startt.format("hh:mm A")); 
               startt.add(30, 'minutes');
             }
           }
           //console.log(allendTime)
          MallTime = MallTime.filter(v => !MallendTime.includes(v))
     
         return res.status(200).json({
           message:"slots",
           result:MallTime
          })
     
          }
        break;
      case "Tuesday":
        console.log("thuesday")
        let TubreakTime = slots?.Saturday[0].breakTime
        let TuStartbreakTime = TubreakTime.filter((_: any, i: any) => !(i % 2));
        console.log("rii")
         let TuEndbreakTime = TubreakTime.filter((_:any, i:any) => (i % 2));
         let TustartTime :any = slots?.Saturday[0].startTime
         let TuendTime :any = slots?.Saturday[0].endTime
         let TuallTime: any[] = [];
         let TuallendTime : any = []
         let Tustartti = slots?.Saturday[0].startTime[0]
         console.log(Tustartti)
         if(userDt===ptz){
         if(currentTime>=Tustartti){
           console.log("first")
           for( let i = 0;i<TustartTime.length;i++){
             let startt = moment(TustartTime[i], "HH:mm").format('HH:mm');
             startt=currentTime
             let endt = moment(TuendTime[i], "HH:mm");
             let h = moment(startt,'HH:mm').format('HH')
             let m = moment(startt,'HH:mm').format('mm')
             if(m>='1' && m<='29'){
               m='00'
             }
             else if(m>='31' && m<='59'){
               m='30'
             }
             let ti = `${h}:${m}`
             let st = moment(ti,'HH:mm')
             //console.log(st);
             while (st < endt) {
               TuallTime.push(st.format("hh:mm A")); 
               st.add(30, 'minutes');
             }
           }
           console.log(TuallTime)
           // let start = moment(startti,'HH:mm').format('HH:mm')
           let h = moment(Tustartti,'HH:mm').format('HH')
           let m = moment(Tustartti,'HH:mm').format('mm')
           if(m>='1' && m<='29'){
             m='00'
           }
           else if(m>='31' && m<='59'){
             m='30'
           }
           let ti = `${h}:${m}`
           let st = moment(ti,'HH:mm').format('HH:mm')
           console.log(st);
          }
          else if(currentTime<Tustartti){
           console.log('else if')
           for( let i = 0;i<TustartTime.length;i++){
             let startt = moment(TustartTime[i], "HH:mm");
             let endt = moment(TuendTime[i], "HH:mm");
             while (startt < endt) {
               TuallTime.push(startt.format("hh:mm A")); 
               startt.add(30, 'minutes');
             }
           }
     
           for( let i = 0;i<TuStartbreakTime.length;i++){
             let startt = moment(TuStartbreakTime[i], "HH:mm");
             let endt = moment(TuEndbreakTime[i], "HH:mm");
             while (startt < endt) {
               TuallendTime.push(startt.format("hh:mm A")); 
               startt.add(30, 'minutes');
             }
           }
           //console.log(allendTime)
          TuallTime = TuallTime.filter(v => !TuallendTime.includes(v))
     
         return res.status(200).json({
           message:"slots",
           result:TuallTime
          })
     
          }
         }
          else{
           console.log("else")
           for( let i = 0;i<TustartTime.length;i++){
             let startt = moment(TustartTime[i], "HH:mm");
             let endt = moment(TuendTime[i], "HH:mm");
             while (startt < endt) {
               TuallTime.push(startt.format("hh:mm A")); 
               startt.add(30, 'minutes');
             }
           }
           for( let i = 0;i<TuStartbreakTime.length;i++){
             let startt = moment(TuStartbreakTime[i], "HH:mm");
             let endt = moment(TuEndbreakTime[i], "HH:mm");
             while (startt < endt) {
               TuallendTime.push(startt.format("hh:mm A")); 
               startt.add(30, 'minutes');
             }
           }
           //console.log(allendTime)
          TuallTime = TuallTime.filter(v => !TuallendTime.includes(v))
     
         return res.status(200).json({
           message:"slots",
           result:TuallTime
          })
     
          }
        break
      case "Wednesday":
        console.log(" This is wednesday");
        let WbreakTime = slots?.Saturday[0].breakTime
        let WStartbreakTime = WbreakTime.filter((_: any, i: any) => !(i % 2));
        console.log("rii")
         let WEndbreakTime = WbreakTime.filter((_:any, i:any) => (i % 2));
         let WstartTime :any = slots?.Saturday[0].startTime
         let WendTime :any = slots?.Saturday[0].endTime
         let WallTime: any[] = [];
         let WallendTime : any = []
         let Wstartti = slots?.Saturday[0].startTime[0]
         console.log(Wstartti)
         if(userDt===ptz){
         if(currentTime>=Wstartti){
           console.log("first")
           for( let i = 0;i<WstartTime.length;i++){
             let startt = moment(WstartTime[i], "HH:mm").format('HH:mm');
             startt=currentTime
             let endt = moment(WendTime[i], "HH:mm");
             let h = moment(startt,'HH:mm').format('HH')
             let m = moment(startt,'HH:mm').format('mm')
             if(m>='1' && m<='29'){
               m='00'
             }
             else if(m>='31' && m<='59'){
               m='30'
             }
             let ti = `${h}:${m}`
             let st = moment(ti,'HH:mm')
             //console.log(st);
             while (st < endt) {
               WallTime.push(st.format("hh:mm A")); 
               st.add(30, 'minutes');
             }
           }
           console.log(WallTime)
           // let start = moment(startti,'HH:mm').format('HH:mm')
           let h = moment(Wstartti,'HH:mm').format('HH')
           let m = moment(Wstartti,'HH:mm').format('mm')
           if(m>='1' && m<='29'){
             m='00'
           }
           else if(m>='31' && m<='59'){
             m='30'
           }
           let ti = `${h}:${m}`
           let st = moment(ti,'HH:mm').format('HH:mm')
           console.log(st);
          }
          else if(currentTime<Wstartti){
           console.log('else if')
           for( let i = 0;i<WstartTime.length;i++){
             let startt = moment(WstartTime[i], "HH:mm");
             let endt = moment(WendTime[i], "HH:mm");
             while (startt < endt) {
               WallTime.push(startt.format("hh:mm A")); 
               startt.add(30, 'minutes');
             }
           }
     
           for( let i = 0;i<WStartbreakTime.length;i++){
             let startt = moment(WStartbreakTime[i], "HH:mm");
             let endt = moment(WEndbreakTime[i], "HH:mm");
             while (startt < endt) {
               WallendTime.push(startt.format("hh:mm A")); 
               startt.add(30, 'minutes');
             }
           }
           //console.log(allendTime)
          WallTime = WallTime.filter(v => !WallendTime.includes(v))
     
         return res.status(200).json({
           message:"slots",
           result:WallTime
          })
     
          }
         }
          else{
           console.log("else")
           for( let i = 0;i<TustartTime.length;i++){
             let startt = moment(TustartTime[i], "HH:mm");
             let endt = moment(TuendTime[i], "HH:mm");
             while (startt < endt) {
               WallTime.push(startt.format("hh:mm A")); 
               startt.add(30, 'minutes');
             }
           }
           for( let i = 0;i<WStartbreakTime.length;i++){
             let startt = moment(WStartbreakTime[i], "HH:mm");
             let endt = moment(WEndbreakTime[i], "HH:mm");
             while (startt < endt) {
               WallendTime.push(startt.format("hh:mm A")); 
               startt.add(30, 'minutes');
             }
           }
           //console.log(allendTime)
          WallTime = WallTime.filter(v => !WallendTime.includes(v))
     
         return res.status(200).json({
           message:"slots",
           result:WallTime
          })
     
          }
        break

      case "Thursday":
        console.log("thursday")
    let breakTime = slots?.Thursday[0].breakTime
    let StartbreakTime = breakTime.filter((_: any, i: any) => !(i % 2));
    let EndbreakTime = breakTime.filter((_:any, i:any) => (i % 2));
    let startTime :any = slots?.Thursday[0].startTime
    let endTime :any = slots?.Thursday[0].endTime
    let allTime: any[] = [];
    let allendTime : any = []
    let startti = slots?.Thursday[0].startTime

        if(currentTime>=startti){
          console.log("first")
          for( let i = 0;i<startTime.length;i++){
            let startt : any = moment(startTime[i], "HH:mm");
            startt=currentTime
            console.log(startt)
            let endt = moment(endTime[i], "HH:mm");
            let h = moment(startt,'HH:mm').format('HH')
            let m = moment(startt,'HH:mm').format('mm')
            if(m>='1' && m<='29'){
              m='00'
            }
            else if(m>='31' && m<='59'){
              m='30'
            }
            let ti = `${h}:${m}`
            console.log("hello")
            console.log(ti)
            let st = moment(ti,'HH:mm')
            //console.log(st);
            while (st < endt) {
              allTime.push(st.format("hh:mm A")); 
              st.add(30, 'minutes');
            }
          }
          console.log(allTime)
          // let start = moment(startti,'HH:mm').format('HH:mm')
          let h = moment(startti,'HH:mm').format('HH')
          let m = moment(startti,'HH:mm').format('mm')
          if(m>='1' && m<='29'){
            m='00'
          }
          else if(m>='31' && m<='59'){
            m='30'
          }
          let ti = `${h}:${m}`
          let st = moment(ti,'HH:mm').format('HH:mm')
          console.log(st);
          for( let i = 0;i<StartbreakTime.length;i++){
            let startt = moment(StartbreakTime[i], "HH:mm");
            let endt = moment(EndbreakTime[i], "HH:mm");
            while (startt < endt) {
              allendTime.push(startt.format("hh:mm A")); 
              startt.add(30, 'minutes');
            }
          }
          //console.log(allendTime)
          let removingslots = allendTime.concat(allslots.flat())
      console.log(removingslots)
         allTime = allTime.filter(v => !removingslots.includes(v))
          allTime.shift()
         return res.status(200).json({
          message:"slots",
          result:allTime
         })
         }
         
         else if(currentTime<startti){
          console.log("else if")
          for( let i = 0;i<startTime.length;i++){
            let startt = moment(startTime[i], "HH:mm");
            let endt = moment(endTime[i], "HH:mm");
            while (startt < endt) {
              allTime.push(startt.format("hh:mm A")); 
              startt.add(30, 'minutes');
            }
          }

          for( let i = 0;i<StartbreakTime.length;i++){
            let startt = moment(StartbreakTime[i], "HH:mm");
            let endt = moment(EndbreakTime[i], "HH:mm");
            while (startt < endt) {
              allendTime.push(startt.format("hh:mm A")); 
              startt.add(30, 'minutes');
            }
          }
          //console.log(allendTime)
         allTime = allTime.filter(v => !allendTime.includes(v))

        return res.status(200).json({
          message:"slots",
          result:allTime
         })

         }
         else{

          for( let i = 0;i<startTime.length;i++){
            let startt = moment(startTime[i], "HH:mm");
            let endt = moment(endTime[i], "HH:mm");
            while (startt < endt) {
              allTime.push(startt.format("hh:mm A")); 
              startt.add(30, 'minutes');
            }
          }

          for( let i = 0;i<StartbreakTime.length;i++){
            let startt = moment(StartbreakTime[i], "HH:mm");
            let endt = moment(EndbreakTime[i], "HH:mm");
            while (startt < endt) {
              allendTime.push(startt.format("hh:mm A")); 
              startt.add(30, 'minutes');
            }
          }
          //console.log(allendTime)
          let removingslots = allendTime.concat(allslots.flat())
      console.log(removingslots)
         allTime = allTime.filter(v => !removingslots.includes(v))

        return res.status(200).json({
          message:"slots",
          result:allTime
         })

         }

        
      break

      case "Friday":
        console.log("friday")
        let FbreakTime = slots?.Friday[0].breakTime
   let FStartbreakTime = FbreakTime.filter((_: any, i: any) => !(i % 2));
   console.log("rii")
    let FEndbreakTime = FbreakTime.filter((_:any, i:any) => (i % 2));
    let FstartTime :any = slots?.Friday[0].startTime
    let FendTime :any = slots?.Friday[0].endTime
    let FallTime: any[] = [];
    let FallendTime : any = []
    let Fstartti = slots?.Friday[0].startTime[0]
    console.log(Fstartti)
    if(userDt===ptz){
    if(currentTime>=Fstartti){
      console.log("first")
      for( let i = 0;i<FstartTime.length;i++){
        let startt = moment(FstartTime[i], "HH:mm").format('HH:mm');
        startt=currentTime
        let endt = moment(FendTime[i], "HH:mm");
        let h = moment(startt,'HH:mm').format('HH')
        let m = moment(startt,'HH:mm').format('mm')
        if(m>='1' && m<='29'){
          m='00'
        }
        else if(m>='31' && m<='59'){
          m='30'
        }
        let ti = `${h}:${m}`
        let st = moment(ti,'HH:mm')
        //console.log(st);
        while (st < endt) {
          FallTime.push(st.format("hh:mm A")); 
          st.add(30, 'minutes');
        }
      }
      console.log(FallTime)
      // let start = moment(startti,'HH:mm').format('HH:mm')
      let h = moment(startti,'HH:mm').format('HH')
      let m = moment(startti,'HH:mm').format('mm')
      if(m>='1' && m<='29'){
        m='00'
      }
      else if(m>='31' && m<='59'){
        m='30'
      }
      let ti = `${h}:${m}`
      let st = moment(ti,'HH:mm').format('HH:mm')
      console.log(st);
     }
     else if(currentTime<Fstartti){
      console.log('else if')
      for( let i = 0;i<FstartTime.length;i++){
        let startt = moment(FstartTime[i], "HH:mm");
        let endt = moment(FendTime[i], "HH:mm");
        while (startt < endt) {
          FallTime.push(startt.format("hh:mm A")); 
          startt.add(30, 'minutes');
        }
      }

      for( let i = 0;i<FStartbreakTime.length;i++){
        let startt = moment(FStartbreakTime[i], "HH:mm");
        let endt = moment(FEndbreakTime[i], "HH:mm");
        while (startt < endt) {
          FallendTime.push(startt.format("hh:mm A")); 
          startt.add(30, 'minutes');
        }
      }
      //console.log(allendTime)
      let removingslots = FallendTime.concat(allslots.flat())
      console.log(removingslots)
     FallTime = FallTime.filter(v => !removingslots.includes(v))

    return res.status(200).json({
      message:"slots",
      result:FallTime
     })

     }
    }
     else{
      console.log("else")
      for( let i = 0;i<FstartTime.length;i++){
        let startt = moment(FstartTime[i], "HH:mm");
        let endt = moment(FendTime[i], "HH:mm");
        while (startt < endt) {
          FallTime.push(startt.format("hh:mm A")); 
          startt.add(30, 'minutes');
        }
      }
      for( let i = 0;i<FStartbreakTime.length;i++){
        let startt = moment(FStartbreakTime[i], "HH:mm");
        let endt = moment(FEndbreakTime[i], "HH:mm");
        while (startt < endt) {
          FallendTime.push(startt.format("hh:mm A")); 
          startt.add(30, 'minutes');
        }
      }
      //console.log(allendTime)
      let removingslots = FallendTime.concat(allslots.flat())
      console.log(removingslots)
     FallTime = FallTime.filter(v => !removingslots.includes(v))

    return res.status(200).json({
      message:"slots",
      result:FallTime
     })

     }
       
      break

      case "Saturday":
      console.log("saturday");
      let SbreakTime = slots?.Saturday[0].breakTime
      let SStartbreakTime = SbreakTime.filter((_: any, i: any) => !(i % 2));
      console.log("rii")
       let SEndbreakTime = SbreakTime.filter((_:any, i:any) => (i % 2));
       let SstartTime :any = slots?.Saturday[0].startTime
       let SendTime :any = slots?.Saturday[0].endTime
       let SallTime: any[] = [];
       let SallendTime : any = []
       let Sstartti = slots?.Saturday[0].startTime[0]
       console.log(Sstartti)
       if(userDt===ptz){
       if(currentTime>=Sstartti){
         console.log("first")
         for( let i = 0;i<SstartTime.length;i++){
           let startt = moment(SstartTime[i], "HH:mm").format('HH:mm');
           startt=currentTime
           let endt = moment(SendTime[i], "HH:mm");
           let h = moment(startt,'HH:mm').format('HH')
           let m = moment(startt,'HH:mm').format('mm')
           if(m>='1' && m<='29'){
             m='00'
           }
           else if(m>='31' && m<='59'){
             m='30'
           }
           let ti = `${h}:${m}`
           let st = moment(ti,'HH:mm')
           //console.log(st);
           while (st < endt) {
             SallTime.push(st.format("hh:mm A")); 
             st.add(30, 'minutes');
           }
         }
         console.log(SallTime)
         // let start = moment(startti,'HH:mm').format('HH:mm')
         let h = moment(startti,'HH:mm').format('HH')
         let m = moment(startti,'HH:mm').format('mm')
         if(m>='1' && m<='29'){
           m='00'
         }
         else if(m>='31' && m<='59'){
           m='30'
         }
         let ti = `${h}:${m}`
         let st = moment(ti,'HH:mm').format('HH:mm')
         console.log(st);
        }
        else if(currentTime<Sstartti){
         console.log('else if')
         for( let i = 0;i<SstartTime.length;i++){
           let startt = moment(SstartTime[i], "HH:mm");
           let endt = moment(SendTime[i], "HH:mm");
           while (startt < endt) {
             SallTime.push(startt.format("hh:mm A")); 
             startt.add(30, 'minutes');
           }
         }
   
         for( let i = 0;i<SStartbreakTime.length;i++){
           let startt = moment(SStartbreakTime[i], "HH:mm");
           let endt = moment(SEndbreakTime[i], "HH:mm");
           while (startt < endt) {
             SallendTime.push(startt.format("hh:mm A")); 
             startt.add(30, 'minutes');
           }
         }
         //console.log(allendTime)
         let removingslots = SallendTime.concat(allslots.flat())
      console.log(removingslots)
        SallTime = SallTime.filter(v => !removingslots.includes(v))
   
       return res.status(200).json({
         message:"slots",
         result:SallTime
        })
   
        }
       }
        else{
         console.log("else")
         for( let i = 0;i<SstartTime.length;i++){
           let startt = moment(SstartTime[i], "HH:mm");
           let endt = moment(SendTime[i], "HH:mm");
           while (startt < endt) {
             SallTime.push(startt.format("hh:mm A")); 
             startt.add(30, 'minutes');
           }
         }
         for( let i = 0;i<SStartbreakTime.length;i++){
           let startt = moment(SStartbreakTime[i], "HH:mm");
           let endt = moment(SEndbreakTime[i], "HH:mm");
           while (startt < endt) {
             SallendTime.push(startt.format("hh:mm A")); 
             startt.add(30, 'minutes');
           }
         }
         let removingslots = SallendTime.concat(allslots.flat())
      console.log(removingslots)
         //console.log(allendTime)
        SallTime = SallTime.filter(v => !removingslots.includes(v))
   
       return res.status(200).json({
         message:"slots",
         result:SallTime
        })
   
        }
      break

      case  "Sunday":
        let SnbreakTime = slots?.Sunday[0].breakTime
        let SnStartbreakTime = SnbreakTime.filter((_: any, i: any) => !(i % 2));
        console.log("rii")
         let SnEndbreakTime = SnbreakTime.filter((_:any, i:any) => (i % 2));
         let SnstartTime :any = slots?.Saturday[0].startTime
         let SnendTime :any = slots?.Saturday[0].endTime
         let SnallTime: any[] = [];
         let SnallendTime : any = []
         let Snstartti = slots?.Saturday[0].startTime[0]
         console.log(Sstartti)
         if(userDt===ptz){
         if(currentTime>=Sstartti){
           console.log("first")
           for( let i = 0;i<SnstartTime.length;i++){
             let startt = moment(SnstartTime[i], "HH:mm").format('HH:mm');
             startt=currentTime
             let endt = moment(SnendTime[i], "HH:mm");
             let h = moment(startt,'HH:mm').format('HH')
             let m = moment(startt,'HH:mm').format('mm')
             if(m>='1' && m<='29'){
               m='00'
             }
             else if(m>='31' && m<='59'){
               m='30'
             }
             let ti = `${h}:${m}`
             let st = moment(ti,'HH:mm')
             //console.log(st);
             while (st < endt) {
               SnallTime.push(st.format("hh:mm A")); 
               st.add(30, 'minutes');
             }
           }
           console.log(SnallTime)
           // let start = moment(startti,'HH:mm').format('HH:mm')
           let h = moment(startti,'HH:mm').format('HH')
           let m = moment(startti,'HH:mm').format('mm')
           if(m>='1' && m<='29'){
             m='00'
           }
           else if(m>='31' && m<='59'){
             m='30'
           }
           let ti = `${h}:${m}`
           let st = moment(ti,'HH:mm').format('HH:mm')
           console.log(st);
          }
          else if(currentTime<Snstartti){
           console.log('else if')
           for( let i = 0;i<SnstartTime.length;i++){
             let startt = moment(SnstartTime[i], "HH:mm");
             let endt = moment(SnendTime[i], "HH:mm");
             while (startt < endt) {
               SnallTime.push(startt.format("hh:mm A")); 
               startt.add(30, 'minutes');
             }
           }
     
           for( let i = 0;i<SnStartbreakTime.length;i++){
             let startt = moment(SnStartbreakTime[i], "HH:mm");
             let endt = moment(SnEndbreakTime[i], "HH:mm");
             while (startt < endt) {
               SnallendTime.push(startt.format("hh:mm A")); 
               startt.add(30, 'minutes');
             }
           }
           //console.log(allendTime)
          SnallTime = SnallTime.filter(v => !SnallendTime.includes(v))
     
         return res.status(200).json({
           message:"slots",
           result:SnallTime
          })
     
          }
         }
          else{
           console.log("else")
           for( let i = 0;i<SnstartTime.length;i++){
             let startt = moment(SnstartTime[i], "HH:mm");
             let endt = moment(SnendTime[i], "HH:mm");
             while (startt < endt) {
               SnallTime.push(startt.format("hh:mm A")); 
               startt.add(30, 'minutes');
             }
           }
           for( let i = 0;i<SnStartbreakTime.length;i++){
             let startt = moment(SnStartbreakTime[i], "HH:mm");
             let endt = moment(SnEndbreakTime[i], "HH:mm");
             while (startt < endt) {
               SnallendTime.push(startt.format("hh:mm A")); 
               startt.add(30, 'minutes');
             }
           }
           //console.log(allendTime)
          SnallTime = SnallTime.filter(v => !SnallendTime.includes(v))
     
         return res.status(200).json({
           message:"slots",
           result:SnallTime
          })
     
          }
      console.log("sunday");
      
      break
    }

   }
   
else{
   return res.status(400).json({
      message:"slots are not present"
    })
   }
  } catch (error) {
    res.status(400).send(error)
    console.log(error)
  }
}

const updateSlot =  async (req:any, res:any) => {
  try {
    let users : any = await DaysModel.findOne({email:req.query.email});
    if (!users) {
      return res.status(500).json({
        success: false,
        message: "user is not presnt",
      });
    }
    const newUserData = {
    TimeZone : req.body.TimeZone||users.TimeZone,
    email:users.email,
    phoneNo:req.body.phoneNo||users.phoneNo,
    name:req.body.name||users.name,
    BookedDate:req.body.BookedDate||users.BookedDate,
    Monday : req.body.Monday||users.Monday,
    Tuesday:req.body.Tuesday||users.Tuesday,
    Wednesday:req.body.Wednesday||users.Wednesday,
    Thursday:req.body.Thursday||users.Thursday,
    Friday:req.body.Friday||users.Friday,
    Saturday:req.body.Saturday||users.Saturday,
    Sunday:req.body.Sunday||users.Sunday,
    };

    const user = await DaysModel.findOneAndUpdate({email:req.query.email}, newUserData, {
      new: true,
      runValidators: false,
      userFindAndModify: true,
    });
    return res.status(200).json({
      message:"user updated sucessfully",
      result:user
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal server");
  }
};

const bookingSlots = async (req:any , res:any)=>{
  
  let user = await BookingModel.find({TimeZone:req.body.TimeZone,AppointmentDate:req.body.AppointmentDate},{"SlotsTime":"$SlotsTime"})
  console.log(user)
  let allslots : any = []
  for( let i = 0;i<user.length;i++){
      allslots.push(user[i].SlotsTime)
  }
  console.log(allslots.flat())

  let result = allslots.flat().some(function (a: any, i: any, aa: { [x: string]: any; }) {
    return req.body.SlotsTime.every(function (b: any, j: any) {
        return aa[i + j] === b;
    });
});
const found = allslots.flat().some((r: any)=> req.body.SlotsTime.indexOf(r) >= 0)
console.log(found)
if(found){
  return res.status(400).json({
    Status:false,
    message:'Slot is already present'
  })
};

  try {
    let BookingModels :Booking = new BookingModel({
      TimeZone:req.body.TimeZone,
      SlotsTime:req.body.SlotsTime,
      Service:req.body.Service,
      email:req.body.email,
      Name:req.body.Name,
      Duerication:req.body.Duerication,
      AppointmentDate:req.body.AppointmentDate
    }) 
    const slot:Booking  = await BookingModels.save()
    
    res.status(200).json({
      message : "slot booking sucess",
      result:slot
    })

  } catch (error) {
    console.log(error)
    res.status(500).send(error)
  }
}

const updateBooking =  async (req:any, res:any) => {
  try {
    let users : any = await BookingModel.findById(req.query.id);
    let use : any = BookingModel.find()
    //console.log(use)
    if (!users) {
      //console.log("hello")
      return res.status(400).json({
        success: false,
        message: "user is not presnt",
      }); 
    }
    const newUserData = {
      SlotsTime:req.body.SlotsTime || users.SlotsTime,
      Service:req.body.Service || users.Service,
      email:req.body.email || users.email,
      Name:req.body.Name || users.Name,
      Duerication:req.body.Duerication || users.Duerication,
      AppointmentDate:req.body.AppointmentDate || users.AppointmentDate
    }

    let user = await BookingModel.findByIdAndUpdate({_id:req.query.id}, newUserData, {
      new: true,
      runValidators: false,
      userFindAndModify: true,
    });
    return res.status(200).json({
      message:"user updated sucessfully",
      result:user
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal server");
  }
};

const getBookingsByEmail =async (req:any,res:any) => {
  try {
    let user = await BookingModel.find({email:req.query.email})
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "user is not presnt",
      }); 
    }

    res.status(200).json({
      message:"data",
      result:user
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message:"internal error",
      error:error
    })
  }
}

const getDaysByEmail = async (req:any,res:any) => {
  try {
    let user = await DaysModel.find({email:req.query.email})
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "user is not presnt",
      }); 
    }

    res.status(200).json({
      message:"data",
      result:user
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message:"internal error",
      error:error
    })
  }
}

const softDelete = async (req:any, res:any) => {
  debugger
  try {
    const users : any = await BookingModel.findById(req.params.id);
    console.log(users)

    if (users.isDeleted === true) {
      return res.status(404).json({
        error: 'Requested category does not exist'
      });
    }
    
      const softdelete =await BookingModel.findOneAndUpdate({_id:users._id},{isDeleted:true})

      
    
    res.status(200).json({
      message: "Your slot was deleted",
      data:softdelete
    });

  }
  catch (error) {
    res.status(400).json({
      error: error
    });
  }
};


export { addModel, getApp, send, getSE ,ondays,GetAppointment,updateSlot,softDelete,bookingSlots,updateBooking,getBookingsByEmail,getDaysByEmail }
