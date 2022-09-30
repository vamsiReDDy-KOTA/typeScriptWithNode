"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.ondays = exports.getSE = exports.send = exports.getApp = exports.addModel = exports.create = void 0;
const Fs = __importStar(require("fs"));
const appointment_1 = __importDefault(require("../moduls/appointment"));
const appointMentDetals_1 = __importDefault(require("../moduls/appointMentDetals"));
const appointment_2 = __importDefault(require("../moduls/appointment"));
const moment_timezone_1 = __importDefault(require("moment-timezone"));
//import { Times } from "../moduls/timesInterface";
const days_1 = __importDefault(require("../moduls/days"));
let items = [];
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
            hold = newEndTime;
        }
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
            hold = newEndTime;
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
const create = (newItem) => __awaiter(void 0, void 0, void 0, function* () {
    const id = new Date().valueOf();
    items[id] = Object.assign({ id }, newItem);
    const vamsi = items[id];
    Fs.readFile('fil.json', 'utf-8', function (err, data) {
        if (err)
            throw err;
        var arrayOfObjects = JSON.parse(data);
        arrayOfObjects.push(vamsi);
        Fs.writeFile('fil.json', JSON.stringify(arrayOfObjects), 'utf-8', function (err) {
            if (err)
                throw err;
            console.log('Done!');
        });
    });
    return items[id];
});
exports.create = create;
