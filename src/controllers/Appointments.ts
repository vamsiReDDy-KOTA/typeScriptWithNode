/* eslint-disable no-case-declarations */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import moment from 'moment-timezone';
import Moments from 'moment'

import DaysModel from "../moduls/days"
import Joi from 'joi';
import SignupDt from '../moduls/signup';
import BookingModel from "../moduls/bookingModel"
import Days from "../moduls/daysInterface"

// Staff getAppointment API

/**
 * @api {get}/getAppointment availabul slots 
 * @apiGroup Appointment
 * 
 * @apiHeader {String} x-token Users unique access-key
 * @apiQuery {String} email email is in the string format
 * @apiQuery {String} date data format will be YYYY-MM-DD and it is in string format
 * @apiSuccessExample {json} Success-Response
 * HTTP/1.1 200 OK
 * {
 * message: "slots",
 * result: " "
 * }
 *@apiSampleRequest /getAppointment
 *@apiErrorExample {json} Error-Response:
 *   HTTP/1.1 404 Not Found
 *     {
 *       "message": "user is not present in our database"
 *     }
 *    HTTP/1.1 400 
 *    {
 *        "message": "slots are not present"
 *    }
 * 
 *    HTTP/1.1 500 Internal Server Error
 */

 const GetAppointment = async (req: any, res: any) => {
    try {
      const date = req.query.date

      //let da = await DaysModel.findOne({ email: req.query.email })
      
      const slots = await DaysModel.findOne({ email: req.query.email })
      const timeZn: any = slots?.TimeZone
      const da :any = slots?.repectForWeek
      const startdat = slots?.StartDate      
      const va =  moment.utc(startdat).format("DD-MM-YYYY");

      console.log(va)
      console.log("hello")
      const ptz = moment.utc(date).format('DD-MM-YYYY')
      
      const userDt = moment.utc().format("DD-MM-YYYY")
      const userEnteredDt = moment.utc(date).format("YYYY-MM-DD")
      
      const userEnteredDay = moment.utc(userEnteredDt).format('dddd')
      const currentTime = moment.utc().format('HH:mm')
      
      
      if(!slots){
        return res.status(404).json({
          Message : "user is not present in our database"
        })
      }
      if (slots?.isDeleted) {
        return res.status(404).json({
          message: "user is not present in our database"
        })
      }
     
      console.log(userDt)
      console.log(ptz)
      

      if (userDt <= ptz) {

        if(ptz < va){
        
        const slot = await BookingModel.find({ AppointmentDate: userEnteredDt, email: req.query.email }, { "SlotsTime": "$SlotsTime" })

        console.log(slot)

        const allslots: any = []
        for (let i = 0; i < slot.length; i++) {
          allslots.push(slot[i].SlotsTime)
        }
  
        switch (userEnteredDay) {
          case "Monday":
            if (!slots?.Monday[0]) {
              return res.status(400).send("slots are not there")
            }
            const MbreakTime = slots?.Monday[0].breakTime
            const MStartbreakTime = MbreakTime.filter((_: any, i: any) => !(i % 2));
            const MEndbreakTime = MbreakTime.filter((_: any, i: any) => (i % 2));
            const MstartTime: any = slots?.Monday[0].startTime
            const MendTime: any = slots?.Monday[0].endTime
            const MallTime: any[] = [];
            const MallendTime: any = []
            const Mstartti = slots?.Monday[0].startTime[0]
            let Mall: any = []
            for (let i = 0; i < MstartTime.length; i++) {
              const startt = moment.utc(MstartTime[i], "HH:mm");
              const endt = moment.utc(MendTime[i], "HH:mm");
              while (startt < endt) {
                Mall.push(startt.format("hh:mm A"));
                startt.add(30, 'minutes');
              }
            }
            for (let i = 0; i < MStartbreakTime.length; i++) {
              const startt = moment.utc(MStartbreakTime[i], "HH:mm");
              const endt = moment.utc(MEndbreakTime[i], "HH:mm");
              while (startt < endt) {
                MallendTime.push(startt.format("hh:mm A DD-MM-YYYY" ));
                startt.add(30, 'minutes');
              }
            }
            //console.log(allendTime)
            const Mremovingslots = MallendTime.concat(allslots.flat())
  
            Mall = Mall.filter((v: any) => !Mremovingslots.includes(v))
  
            //console.log(Mall)
            if (userDt === ptz) {
              if (currentTime > Mstartti) {
                console.log("first")
                for (let i = 0; i < MstartTime.length; i++) {
                  const startt = moment(MstartTime[i], "HH:mm")
                  const endt = moment(MendTime[i], "HH:mm");
                  while (startt < endt) {
                    MallTime.push(startt.add(30,'m').format("hh:mm A"));
                  }
                }
                const h = moment(currentTime, 'HH:mm').format('HH')
                let m = moment(currentTime, 'HH:mm').format('mm')
                if (m >= '1' && m <= '29') {
                  m = '00'
                }
                else if (m >= '31' && m <= '59') {
                  m = '30'
                }
                const ti = `${h}:${m}`
                const st = moment(ti, 'HH:mm')
                const startt = moment(Mstartti, "HH:mm")
                console.log(startt)
                const hello :any[] = []
             
                while (startt < st) {
                  hello.push(startt.add(30, 'minutes').format('hh:mm A'));
                }
                let hii = MallTime.filter((k:any)=>!hello.includes(k))
                const removingslots = MallendTime.concat(allslots.flat())
        
                hii = hii.filter((v: any) => !removingslots.includes(v))
  
                if (hii.length === 0) {
                  return res.status(400).json({
                    status: false,
                    message: "slots are not present" 
                  })
                }
                return res.status(200).json({
                  message: "slots",
                  result: hii
                })
              }
              else if (currentTime <= Mstartti) {
                console.log('else if')
                if (Mall.length === 0) {
                  return res.status(400).json({
                    status: false,
                    message: "slot are not present"
                  })
                }
                return res.status(200).json({
                  message: "slots",
                  result: Mall
                })
  
              }
            }
            else {
              console.log("else")
              if (Mall.length === 0) {
                return res.status(400).json({
                  status: false,
                  message: "slot are not present"
                })
              }
              return res.status(200).json({
                message: "slots",
                result: Mall
              })
  
            }
            break;
          case "Tuesday":
            console.log("tuesday")
            if (!slots?.Tuesday[0]) {
              return res.status(400).send("slots are not there")
            }
            const TubreakTime = slots?.Tuesday[0].breakTime
            const TuStartbreakTime = TubreakTime.filter((_: any, i: any) => !(i % 2));
            const TuEndbreakTime = TubreakTime.filter((_: any, i: any) => (i % 2));
            const TustartTime: any = slots?.Tuesday[0].startTime
            const TuendTime: any = slots?.Tuesday[0].endTime
            const TuallTime: any[] = [];
            const TuallendTime: any = []
            const Tustartti = slots?.Tuesday[0].startTime[0]
  
            let Tuall: any = []
            for (let i = 0; i < TustartTime.length; i++) {
              const startt = moment(TustartTime[i], "HH:mm");
              const endt = moment(TuendTime[i], "HH:mm");
              while (startt < endt) {
                Tuall.push(startt.format("hh:mm A"));
                startt.add(30, 'minutes');
              }
            }
  
            for (let i = 0; i < TuStartbreakTime.length; i++) {
              const startt = moment(TuStartbreakTime[i], "HH:mm");
              const endt = moment(TuEndbreakTime[i], "HH:mm");
              while (startt < endt) {
                TuallendTime.push(startt.format("hh:mm A"));
                startt.add(30, 'minutes');
              }
            }
            // console.log(TuallendTime)
            const Turemovingslots = TuallendTime.concat(allslots.flat())
            Tuall = Tuall.filter((v: any) => !Turemovingslots.includes(v))
  
            if (userDt === ptz) {
  
              if (currentTime > Tustartti) {
                console.log("first")
                for (let i = 0; i < TustartTime.length; i++) {
                  const startt = moment(TustartTime[i], "HH:mm");
                  const endt = moment(TuendTime[i], "HH:mm");
                   while (startt < endt) {
                    TuallTime.push(startt.add(30,'m').format("hh:mm A"));
                              }
                }
                // let AFallTime = TuallTime.filter(v => !Tuall.includes(v))
                const h = moment(currentTime, 'HH:mm').format('HH')
                let m = moment(currentTime, 'HH:mm').format('mm')
                if (m >= '1' && m <= '29') {
                  m = '00'
                }
                else if (m >= '31' && m <= '59') {
                  m = '30'
                }
                const ti = `${h}:${m}`
                const st = moment(ti, 'HH:mm')
                const startt = moment(Tustartti, "HH:mm")
                console.log(startt)
                const hello :any[] = []
             
                while (startt < st) {
                  hello.push(startt.add(30, 'minutes').format('hh:mm A'));
                }
                let hii = TuallTime.filter((k:any)=>!hello.includes(k))
                const removingslots = TuallendTime.concat(allslots.flat())
                console.log(removingslots)
                hii = hii.filter((v: any) => !removingslots.includes(v))
                hii.shift()
                if (hii.length === 0) {
                  return res.status(400).json({
                    status: false,
                    message: "slots are not present"
                  })
                }
                return res.status(200).json({
                  message: "slots",
                  result: hii
                })
  
              }
              else if (currentTime <= Tustartti) {
                console.log('else if')
                if (Tuall.length === 0) {
                  return res.status(400).json({
                    status: false,
                    message: "slot are not present"
                  })
                }
                return res.status(200).json({
                  message: "slots",
                  result: Tuall
                })
  
              }
            }
            else {
              console.log("else")
              if (Tuall.length === 0) {
                return res.status(400).json({
                  status: false,
                  message: "slot are not present"
                })
              }
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
            const WbreakTime:any = slots?.Wednesday[0].breakTime
            const WStartbreakTime = WbreakTime.filter((_: any, i: any) => !(i % 2));
            const WEndbreakTime = WbreakTime.filter((_: any, i: any) => (i % 2));
            const WstartTime: any = slots?.Wednesday[0].startTime
            const WendTime: any = slots?.Wednesday[0].endTime
            const WallTime: any[] = [];
            const WallendTime: any = []
            const Wstartti = slots?.Wednesday[0].startTime[0]
            console.log(Wstartti)
  
            let Wall: any = []
            for (let i = 0; i < WstartTime.length; i++) {
              const startt = moment(WstartTime[i], "HH:mm");
              const endt = moment(WendTime[i], "HH:mm");
                  while (startt < endt) {
                            Wall.push(startt.format("hh:mm A"));
                startt.add(30, 'minutes');
              }
            }
  
            for (let i = 0; i < WStartbreakTime.length; i++) {
              const startt = moment(WStartbreakTime[i], "HH:mm");
              const endt = moment(WEndbreakTime[i], "HH:mm");
              while (startt < endt) {
                WallendTime.push(startt.format("hh:mm A"));
                startt.add(30, 'minutes');
              }
            }
            //console.log(Wall)
            const removingslots = WallendTime.concat(allslots.flat())
            Wall = Wall.filter((v: any) => !removingslots.includes(v))
  
            if (userDt === ptz) {
  
  
              if (currentTime > Wstartti) {
                console.log("first")
                for (let i = 0; i < WstartTime.length; i++) {
                  const startt = moment(WstartTime[i], "HH:mm")
                  const endt = moment(WendTime[i], "HH:mm");
                  while (startt < endt) {
                    WallTime.push(startt.add(30, 'minutes').format('hh:mm A'));
                  }
                }
                  const h = moment(currentTime, 'HH:mm').format('HH')
                  let m = moment(currentTime, 'HH:mm').format('mm')
                  if (m >= '1' && m <= '29') {
                    m = '00'
                  }
                  else if (m >= '31' && m <= '59') {
                    m = '30'
                  }
                  const ti = `${h}:${m}`
                  const st = moment(ti, 'HH:mm')
                  const startt = moment(Wstartti, "HH:mm")
                  console.log(startt)
                  const hello :any[] = []
               
                  while (startt < st) {
                    hello.push(startt.add(30, 'minutes').format('hh:mm A'));
                  }
                  let hii = WallTime.filter((k:any)=>!hello.includes(k))
                const removingslots = WallendTime.concat(allslots.flat())
                hii = hii.filter((v: any) => !removingslots.includes(v))
                
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
  
  
              else if (currentTime <= Wstartti) {
                console.log('else if')
                if (Wall.length === 0) {
                  return res.status(400).json({
                    status: false,
                    message: "slota are not present"
                  })
                }
                return res.status(200).json({
                  message: "slots",
                  result: Wall
                })
  
              }
            }
            else {
              console.log("else")
              if (Wall.length === 0) {
                return res.status(400).json({
                  status: false,
                  message: "slota are not present"
                })
              }
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
            const breakTime = slots?.Thursday[0].breakTime
            const StartbreakTime = breakTime.filter((_: any, i: any) => !(i % 2));
            const EndbreakTime = breakTime.filter((_: any, i: any) => (i % 2));
            const startTime: any = slots?.Thursday[0].startTime
            const endTime: any = slots?.Thursday[0].endTime
            const allTime: any[] = [];
            const allendTime: any = []
            const startti = slots?.Thursday[0].startTime[0]
  
            let Tall: any = []
            for (let i = 0; i < startTime.length; i++) {
              const startt = moment(startTime[i], "HH:mm");
              const endt = moment(endTime[i], "HH:mm");
              while (startt < endt) {
                Tall.push(startt.format("hh:mm A"));
                startt.add(30, 'minutes');
              }
            }
  
  
            for (let i = 0; i < StartbreakTime.length; i++) {
              const startt = moment(StartbreakTime[i], "HH:mm");
              const endt = moment(EndbreakTime[i], "HH:mm");
              while (startt < endt) {
                allendTime.push(startt.format("hh:mm A"));
                startt.add(30, 'minutes');
              }
            }
            //console.log(allendTime)
            const thremovingslots = allendTime.concat(allslots.flat())
            Tall = Tall.filter((v: any) => !thremovingslots.includes(v))
  
            if (userDt === ptz) {
              if (currentTime > startti) {
                console.log("first")
                for (let i = 0; i < startTime.length; i++) {
                  const startt: any = moment(startTime[i], "HH:mm");
                  const endt = moment(endTime[i], "HH:mm");
                  while (startt < endt) {
                    allTime.push(startt.add(30,'m').format("hh:mm A"));
                    }
                }
                const h = moment(currentTime, 'HH:mm').format('HH')
                let m = moment(currentTime, 'HH:mm').format('mm')
                if (m >= '1' && m <= '29') {
                  m = '00'
                }
                else if (m >= '31' && m <= '59') {
                  m = '30'
                }
                const ti = `${h}:${m}`
                const st = moment(ti, 'HH:mm')
                const startt = moment(startti, "HH:mm")
                console.log(startt)
                const hello :any[] = []
             
                while (startt < st) {
                  hello.push(startt.add(30, 'minutes').format('hh:mm A'));
                }
                let hii = allTime.filter((k:any)=>!hello.includes(k))
                const removingslots  = allendTime.concat(allslots.flat(), EndbreakTime.flat())
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
                if (Tall.length === 0) {
                  return res.status(400).json({
                    status: false,
                    message: "slot are not present"
                  })
                }
                return res.status(200).json({
                  message: "slots",
                  result: Tall
                })
  
              }
            }
            else {
              console.log('elif')
              if (Tall.length === 0) {
                return res.status(400).json({
                  status: false,
                  message: "slot are not present"
                })
              }
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
  
            const FbreakTime = slots?.Friday[0].breakTime
            const FStartbreakTime = FbreakTime.filter((_: any, i: any) => !(i % 2));
            const FEndbreakTime = FbreakTime.filter((_: any, i: any) => (i % 2));
            const FstartTime: any = slots?.Friday[0].startTime
            const FendTime: any = slots?.Friday[0].endTime
            const FallTime: any[] = [];
            const FallendTime: any = []
            const Fstartti = slots?.Friday[0].startTime[0]
            console.log(Fstartti)
  
            let all: any = []
            for (let i = 0; i < FstartTime.length; i++) {
              const startt = moment(FstartTime[i], "HH:mm");
              const endt = moment(FendTime[i], "HH:mm");
              while (startt < endt) {
                all.push(startt.format("hh:mm A"));
                startt.add(30, 'minutes');
              }
            }
  
            for (let i = 0; i < FStartbreakTime.length; i++) {
              const startt = moment(FStartbreakTime[i], "HH:mm");
              const endt = moment(FEndbreakTime[i], "HH:mm");
              while (startt < endt) {
                FallendTime.push(startt.format("hh:mm A"));
                startt.add(30, 'minutes');
              }
            }
            //console.log(allendTime)
            const Faremovingslots = FallendTime.concat(allslots.flat())
            //console.log(removingslots)
            all = all.filter((v: any) => !Faremovingslots.includes(v))
  
            if (userDt === ptz) {
  
              if (currentTime > Fstartti) {
                console.log("first")
                for (let i = 0; i < FstartTime.length; i++) {
                  const startt = moment(FstartTime[i], "HH:mm")
                  const endt = moment(FendTime[i], "HH:mm");
                 while (startt < endt) {
                    FallTime.push(startt.format("hh:mm A"));
                    startt.add(30, 'm');
                  }
                }
  
                const h = moment(currentTime, 'HH:mm').format('HH')
                let m = moment(currentTime, 'HH:mm').format('mm')
                if (m >= '1' && m <= '29') {
                  m = '00'
                }
                else if (m >= '31' && m <= '59') {
                  m = '30'
                }
                const ti = `${h}:${m}`
                const st = moment(ti, 'HH:mm')
                const startt = moment(Fstartti, "HH:mm")
                console.log(startt)
                const hello :any[] = []
             
                while (startt < st) {
                  hello.push(startt.add(30, 'minutes').format('hh:mm A'));
                }
                let hii = FallTime.filter((k:any)=>!hello.includes(k))
                // let AFallTime = FallTime.filter(v => !all.includes(v))
  
                const removingslots = FallendTime.concat(allslots.flat())
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
                if (all.length === 0) {
                  return res.status(400).json({
                    status: false,
                    message: "slot are not present"
                  })
                }
                return res.status(200).json({
                  message: "slots",
                  result: all
                })
  
              }
            }
            else {
              console.log("else")
              if (all.length === 0) {
                return res.status(400).json({
                  status: false,
                  message: "slot are not present"
                })
              }
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
            const SbreakTime = slots?.Saturday[0].breakTime
            const SStartbreakTime = SbreakTime.filter((_: any, i: any) => !(i % 2));
            console.log("rii")
            const SEndbreakTime = SbreakTime.filter((_: any, i: any) => (i % 2));
            const SstartTime: any = slots?.Saturday[0].startTime
            const SendTime: any = slots?.Saturday[0].endTime
            const SallTime: any[] = [];
            const SallendTime: any = []
            const Sstartti = slots?.Saturday[0].startTime[0]
            console.log(Sstartti)
  
            let Sall: any = []
            for (let i = 0; i < SstartTime.length; i++) {
              const startt = moment(SstartTime[i], "HH:mm");
              const endt = moment(SendTime[i], "HH:mm");
              while (startt < endt) {
                Sall.push(startt.format("hh:mm A"));
                startt.add(30, 'minutes');
              }
            }
  
            for (let i = 0; i < SStartbreakTime.length; i++) {
              const startt = moment(SStartbreakTime[i], "HH:mm");
              const endt = moment(SEndbreakTime[i], "HH:mm");
              while (startt < endt) {
                SallendTime.push(startt.format("hh:mm A"));
                startt.add(30, 'minutes');
              }
            }
            //console.log(allendTime)
            const saremovingslots = SallendTime.concat(allslots.flat())
            console.log(removingslots)
            Sall = Sall.filter((v: any) => !saremovingslots.includes(v))
  
  
            if (userDt === ptz) {
              if (currentTime > Sstartti) {
                console.log("first")
                for (let i = 0; i < SstartTime.length; i++) {
                  const startt = moment(SstartTime[i], "HH:mm");
                  const endt = moment(SendTime[i], "HH:mm");
                  while (startt < endt) {
                    SallTime.push(startt.format("hh:mm A"));
                    startt.add(30, 'minutes');
                  }
                }
                const h = moment(currentTime, 'HH:mm').format('HH')
                let m = moment(currentTime, 'HH:mm').format('mm')
                if (m >= '1' && m <= '29') {
                  m = '00'
                }
                else if (m >= '31' && m <= '59') {
                  m = '30'
                }
                const ti = `${h}:${m}`
                const st = moment(ti, 'HH:mm')
                const startt = moment(Sstartti, "HH:mm")
                console.log(startt)
                const hello :any[] = []
             
                while (startt < st) {
                  hello.push(startt.add(30, 'minutes').format('hh:mm A'));
                }
                let hii = SallTime.filter((k:any)=>!hello.includes(k))
  
                const removingslots = FallendTime.concat(allslots.flat())
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
                if (Sall.length === 0) {
                  return res.status(400).json({
                    status: false,
                    message: "slot are not present"
                  })
                }
                return res.status(200).json({
                  message: "slots",
                  result: Sall
                })
  
              }
            }
            else {
              console.log("else")
              if (Sall.length === 0) {
                return res.status(400).json({
                  status: false,
                  message: "slot are not present"
                })
              }
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
            const SnbreakTime = slots?.Sunday[0].breakTime
            const SnStartbreakTime = SnbreakTime.filter((_: any, i: any) => !(i % 2));
            console.log("rii")
            const SnEndbreakTime = SnbreakTime.filter((_: any, i: any) => (i % 2));
            const SnstartTime: any = slots?.Saturday[0].startTime
            const SnendTime: any = slots?.Saturday[0].endTime
            const SnallTime: any[] = [];
            const SnallendTime: any = []
            const Snstartti = slots?.Saturday[0].startTime[0]
            console.log(Sstartti)
            let Snall: any = []
            for (let i = 0; i < SnstartTime.length; i++) {
              const startt = moment(SnstartTime[i], "HH:mm");
              const endt = moment(SnendTime[i], "HH:mm");
              while (startt < endt) {
                Snall.push(startt.format("hh:mm A"));
                startt.add(30, 'minutes');
              }
            }
  
            for (let i = 0; i < SnStartbreakTime.length; i++) {
              const startt = moment(SnStartbreakTime[i], "HH:mm");
              const endt = moment(SnEndbreakTime[i], "HH:mm");
              while (startt < endt) {
                SnallendTime.push(startt.format("hh:mm A"));
                startt.add(30, 'minutes');
              }
            }
            //console.log(allendTime)
            const Snremovingslots = SnallendTime.concat(allslots.flat())
            Snall = Snall.filter((v: any) => !Snremovingslots.includes(v))
            if (userDt === ptz) {
              if (currentTime > Snstartti) {
                console.log("first")
                for (let i = 0; i < SnstartTime.length; i++) {
                  const startt = moment(SnstartTime[i], "HH:mm")
                  const endt = moment(SnendTime[i], "HH:mm");
                  while (startt < endt) {
                    SnallTime.push(startt.format("hh:mm A"));
                    startt.add(30, 'minutes');
                  }
                }
                const h = moment(currentTime, 'HH:mm').format('HH')
                let m = moment(currentTime, 'HH:mm').format('mm')
                if (m >= '1' && m <= '29') {
                  m = '00'
                }
                else if (m >= '31' && m <= '59') {
                  m = '30'
                }
                const ti = `${h}:${m}`
                const st = moment(ti, 'HH:mm')
                const startt = moment(Snstartti, "HH:mm")
                console.log(startt)
                const hello :any[] = []
             
                while (startt < st) {
                  hello.push(startt.add(30, 'minutes').format('hh:mm A'));
                }
                let hii = SnallTime.filter((k:any)=>!hello.includes(k))
                // console.log(SnallTime)
                // let AFallTime = SnallTime.filter(v => !all.includes(v))
                // console.log(AFallTime)
                const removingslots = SnallendTime.concat(allslots.flat())
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
                if (Snall.length === 0) {
                  return res.status(400).json({
                    status: false,
                    message: "slot are not present"
                  })
                }
                return res.status(200).json({
                  message: "slots",
                  result: Snall
                })
  
              }
            }
            else {
              console.log("else")
              if (Snall.length === 0) {
                return res.status(400).json({
                  status: false,
                  message: "slot are not present"
                })
              }
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
          message: "slots are not present"
        })
      }
      }
  
      else {
        return res.status(400).json({
          message: "slots are not present"
        })
      }
    } catch (error) {
      res.status(400).send("Internal Server Error")
      console.log(error)
    }
  }

  

  export { GetAppointment }

