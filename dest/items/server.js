"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAppointment = exports.ondays = exports.getSE = exports.send = exports.getApp = exports.addModel = void 0;
const appointment_1 = __importDefault(require("../moduls/appointment"));
const appointMentDetals_1 = __importDefault(require("../moduls/appointMentDetals"));
const appointment_2 = __importDefault(require("../moduls/appointment"));
const moment_timezone_1 = __importDefault(require("moment-timezone"));
//import { Times } from "../moduls/timesInterface";
const days_1 = __importDefault(require("../moduls/days"));
const addModel = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const date = new Date().toLocaleString('en-US', {
            timeZone: req.body.DateYouBooked
        });
        const Data = days_1.default.find({}).populate({ path: "DaysModel", strictPopulate: false }).exec((err, result) => {
            if (err) {
                console.log({ error: err });
            }
            return result;
        });
        console.log(Date);
        //const body = req.body as Pick<Appoint, "name" | "description" | "price" | "startTime" | "endTime" | "DateYouBooked" | "bookedID" | "dateOfAppointment"| "date" >;
        const Appointment = new appointment_1.default({
            name: req.body.name,
            description: req.body.description,
            references: yield days_1.default.findById({ _id: "6335a5bade9a1a748447d6d4" }),
            //daysModel:Data,
            startTime: req.body.startTime,
            endTime: req.body.endTime,
            DateYouBooked: (0, moment_timezone_1.default)().tz(req.body.DateYouBooked).format(),
            dateOfAppointment: req.body.dateOfAppointment,
            conformBooking: req.body.conformBooking
        });
        const newAppoint = yield Appointment.save();
        //const allAppoint : Appoint[] = await Appointment.find()
        const Adates = (0, moment_timezone_1.default)().tz("Asia/Kolkata").format();
        console.log(Adates);
        res.status(201).json({
            message: 'appointment was booked',
            deatels: newAppoint
        });
    }
    catch (err) {
        console.log(err);
    }
});
exports.addModel = addModel;
const getApp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allAppoint = yield appointment_2.default.find({
            dateOfAppointment: "27-9-2022"
        }, {
            "startTime": "$startTime",
            "endTime": "$endTime"
        });
        //console.log(dates)
        const date = (0, moment_timezone_1.default)().tz("America/Los_Angeles").format();
        console.log(date);
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
        console.log("vamsi");
        console.log(chunks);
        const all = allAppoint.map(o => o.startTime);
        //console.log(all)
        const startTime = all.forEach(element => {
            console.log({ "startTime": element });
        });
        const endt = allAppoint.map(o => o.endTime);
        const endTime = endt.forEach(element => {
            console.log({ "endTime": element });
        });
        //var arrayToString = JSON.stringify(Object.assign({},all));
        //var stringToJsonObject = JSON.parse(arrayToString);
        //console.log(stringToJsonObject)
        res.status(201).json({
            message: 'booked time slots on the date',
            deatels: allAppoint,
            //StartTimeSlotsBooked:startTime , endTime
        });
    }
    catch (error) {
        console.log(error);
    }
});
exports.getApp = getApp;
const getSE = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        appointment_2.default.findOne({ _id: req.params.id }, (err, doc) => {
            if (err) {
                console.log(err);
            }
            else {
                res.status(200).json({
                    "msg": "based on id you will get data",
                    "result": doc
                });
            }
        });
        //console.log(OneAppoint)
        const date = new Date('09/29/2022 04:12:00').toISOString();
        console.log(date);
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
        console.log(chunks);
    }
    catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
});
exports.getSE = getSE;
const ondays = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const DaysModels = new days_1.default({
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
            saturday: req.body.saturday,
            sunday: req.body.sunday,
        });
        const newDays = yield DaysModels.save();
        res.status(200).json({
            message: "this is date and time",
            result: newDays
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
});
exports.ondays = ondays;
const send = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deate = new appointMentDetals_1.default({ name: req.body.name });
        const newdet = yield deate.save();
        res.status(201).json({
            message: 'appointment was booked',
            deatels: newdet
        });
    }
    catch (err) {
        res.status(400).send(err);
    }
});
exports.send = send;
const GetAppointment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let date = req.query.date;
        let slots = yield days_1.default.findOne({ email: req.query.email });
        let timeZn = slots.TimeZone;
        //console.log(timeZn)
        let userDt = (0, moment_timezone_1.default)().tz(timeZn).format("DD-MM-YYYY");
        let userTime = (0, moment_timezone_1.default)().tz(timeZn).format("hh:mm A");
        let userDay = (0, moment_timezone_1.default)().tz(timeZn).format('dddd');
        console.log(userDay);
        //console.log(date)
        //console.log(userTime);
        let startTime = slots.Monday[0].startTime;
        console.log(startTime);
        let endTime = slots.Monday[0].endTime;
        console.log(endTime);
        console.log(startTime.length);
        let allTimes = [];
        let allTime = [];
        for (let i = 0; i < startTime.length; i++) {
            let startt = (0, moment_timezone_1.default)(startTime[i], "HH:mm");
            let endt = (0, moment_timezone_1.default)(endTime[i], "HH:mm");
            while (startt < endt) {
                allTime.push(startt.format("hh:mm A"));
                startt.add(30, 'minutes');
            }
        }
        console.log(allTime);
        let breakTime = slots === null || slots === void 0 ? void 0 : slots.Monday[0].breakTime;
        console.log(breakTime);
        let StartbreakTime = breakTime.filter((_, i) => !(i % 2));
        console.log(StartbreakTime);
        let EndbreakTime = breakTime.filter((_, i) => (i % 2));
        console.log(EndbreakTime);
        let allendTime = [];
        for (let i = 0; i < StartbreakTime.length; i++) {
            let startt = (0, moment_timezone_1.default)(StartbreakTime[i], "HH:mm");
            let endt = (0, moment_timezone_1.default)(EndbreakTime[i], "HH:mm");
            while (startt < endt) {
                allendTime.push(startt.format("hh:mm A"));
                startt.add(30, 'minutes');
            }
        }
        console.log(allendTime);
        allTime = allTime.filter(v => !allendTime.includes(v));
        console.log(allTime);
        // let startt = moment(startTime, "HH:mm");
        // let endt = moment(endTime, "HH:mm");
        // while (startt < endt) {
        //   allTimes.push(startt.format("hh:mm A"));
        //   startt.add(30, 'minutes');
        // }
        //console.log(allTimes)
        let userEnteredDt = (0, moment_timezone_1.default)(date).format("YYYY-MM-DD");
        let ptz = (0, moment_timezone_1.default)(userEnteredDt).tz(timeZn).format('dddd DD-MM-YYYY');
        let userEnteredDay = (0, moment_timezone_1.default)(userEnteredDt).tz(timeZn).format('dddd');
        console.log(userEnteredDay);
        console.log(ptz);
        if (userDt <= ptz) {
            console.log("hello");
        }
        else {
            return res.status(400).json({
                message: "slots are not present"
            });
        }
        //  console.log(userEnteredDt)
        //  console.log(userDt)
        return res.status(200).json({
            message: "slots time",
            result: allTime
        });
    }
    catch (error) {
        res.status(400).send(error);
        console.log(error);
    }
});
exports.GetAppointment = GetAppointment;
