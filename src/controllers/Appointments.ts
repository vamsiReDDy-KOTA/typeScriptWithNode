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
      let date = req.query.date

      //let da = await DaysModel.findOne({ email: req.query.email })
      
      let slots = await DaysModel.findOne({ email: req.query.email })
      let timeZn: any = slots?.TimeZone
      let da :any = slots?.repect
      let va = moment().startOf('isoWeek').add(1, da ).format("DD-MM-YYYY");
      let ptz = moment(date).format('DD-MM-YYYY')
      
      let userDt = moment().tz(timeZn).format("DD-MM-YYYY")
      console.log(userDt)
      let userEnteredDt = moment(date).format("YYYY-MM-DD")
      
      let userEnteredDay = moment(userEnteredDt).format('dddd')
      let currentTime = moment().tz(timeZn).format('HH:mm')
      
      
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

      if (userDt <= ptz) {
       
        if(ptz < va){
        
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
                MallendTime.push(startt.format("hh:mm A DD-MM-YYYY" ));
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

