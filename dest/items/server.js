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
exports.getDaysByEmail = exports.getBookingsByEmail = exports.updateBooking = exports.bookingSlots = exports.softDelete = exports.DaysSoftDelete = exports.updateSlot = exports.GetAppointment = exports.ondays = void 0;
const moment_timezone_1 = __importDefault(require("moment-timezone"));
//import { Times } from "../moduls/timesInterface";
const days_1 = __importDefault(require("../moduls/days"));
const bookingModel_1 = __importDefault(require("../moduls/bookingModel"));
const nodemailer_1 = __importDefault(require("nodemailer"));
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
            Saturday: req.body.Saturday,
            Sunday: req.body.Sunday,
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
const GetAppointment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let date = req.query.date;
        let slots = yield days_1.default.findOne({ email: req.query.email });
        if (slots === null || slots === void 0 ? void 0 : slots.isDeleted) {
            return res.status(400).json({
                message: "user is not there in our database"
            });
        }
        let timeZn = slots === null || slots === void 0 ? void 0 : slots.TimeZone;
        let userDt = (0, moment_timezone_1.default)().tz(timeZn).format("DD-MM-YYYY");
        let userTime = (0, moment_timezone_1.default)().tz(timeZn).format("hh:mm A");
        let userDay = (0, moment_timezone_1.default)().tz(timeZn).format('dddd');
        let userEnteredDt = (0, moment_timezone_1.default)(date).format("YYYY-MM-DD");
        let ptz = (0, moment_timezone_1.default)(date).format('DD-MM-YYYY');
        let userEnteredDay = (0, moment_timezone_1.default)(userEnteredDt).format('dddd');
        let currentTime = (0, moment_timezone_1.default)().tz(timeZn).format('HH:mm');
        let startti = slots === null || slots === void 0 ? void 0 : slots.Thursday[0].startTime[0];
        if (currentTime >= startti) {
            startti = currentTime;
            let h = (0, moment_timezone_1.default)(startti, 'HH:mm').format('HH');
            let m = (0, moment_timezone_1.default)(startti, 'HH:mm').format('mm');
            if (m >= '1' && m <= '29') {
                m = '00';
            }
            else if (m >= '31' && m <= '59') {
                m = '30';
            }
            let ti = `${h}:${m}`;
            let st = (0, moment_timezone_1.default)(ti, 'HH:mm').format('HH:mm');
            // console.log(st);
        }
        if (userDt <= ptz) {
            console.log("vamsi");
            //let tiz = moment(ptz).format('YYYY-MM-DD')
            //console.log(tiz)
            const slot = yield bookingModel_1.default.find({
                AppointmentDate: userEnteredDt,
                email: req.query.email
            }, {
                "SlotsTime": "$SlotsTime"
            });
            console.log(slot);
            let allslots = [];
            for (let i = 0; i < slot.length; i++) {
                allslots.push(slot[i].SlotsTime);
            }
            // console.log(allslots.flat())
            //console.log(slot[0].SlotsTime)
            switch (userEnteredDay) {
                case "Monday":
                    console.log("Monday");
                    if (!(slots === null || slots === void 0 ? void 0 : slots.Monday[0])) {
                        return res.status(400).send("slots are not there");
                    }
                    let MbreakTime = slots === null || slots === void 0 ? void 0 : slots.Monday[0].breakTime;
                    let MStartbreakTime = MbreakTime.filter((_, i) => !(i % 2));
                    console.log("rii");
                    let MEndbreakTime = MbreakTime.filter((_, i) => (i % 2));
                    let MstartTime = slots === null || slots === void 0 ? void 0 : slots.Monday[0].startTime;
                    let MendTime = slots === null || slots === void 0 ? void 0 : slots.Monday[0].endTime;
                    let MallTime = [];
                    let MallendTime = [];
                    let Mstartti = slots === null || slots === void 0 ? void 0 : slots.Monday[0].startTime[0];
                    console.log(Mstartti);
                    let Mall = [];
                    for (let i = 0; i < MstartTime.length; i++) {
                        let startt = (0, moment_timezone_1.default)(MstartTime[i], "HH:mm");
                        let endt = (0, moment_timezone_1.default)(MendTime[i], "HH:mm");
                        while (startt < endt) {
                            Mall.push(startt.format("hh:mm A"));
                            startt.add(30, 'minutes');
                        }
                    }
                    if (userDt === ptz) {
                        if (currentTime >= Mstartti) {
                            console.log("first");
                            for (let i = 0; i < MstartTime.length; i++) {
                                let startt = (0, moment_timezone_1.default)(MstartTime[i], "HH:mm");
                                let starttt = (0, moment_timezone_1.default)(startt).format('HH:mm');
                                starttt = currentTime;
                                let endt = (0, moment_timezone_1.default)(MendTime[i], "HH:mm");
                                let h = (0, moment_timezone_1.default)(starttt, 'HH:mm').format('HH');
                                let m = (0, moment_timezone_1.default)(starttt, 'HH:mm').format('mm');
                                if (m >= '1' && m <= '29') {
                                    m = '00';
                                }
                                else if (m >= '31' && m <= '59') {
                                    m = '30';
                                }
                                let ti = `${h}:${m}`;
                                let st = (0, moment_timezone_1.default)(ti, 'HH:mm');
                                //console.log(st);
                                while (st < endt) {
                                    MallTime.push(st.format("hh:mm A"));
                                    st.add(30, 'minutes');
                                }
                            }
                            console.log(MallTime);
                            let AFallTime = MallTime.filter(v => !all.includes(v));
                            for (let i = 0; i < MStartbreakTime.length; i++) {
                                let startt = (0, moment_timezone_1.default)(MStartbreakTime[i], "HH:mm");
                                let endt = (0, moment_timezone_1.default)(MEndbreakTime[i], "HH:mm");
                                while (startt < endt) {
                                    MallendTime.push(startt.format("hh:mm A"));
                                    startt.add(30, 'minutes');
                                }
                            }
                            //console.log(allendTime)
                            let removingslots = MallendTime.concat(allslots.flat(), AFallTime);
                            //console.log(removingslots)
                            MallTime = MallTime.filter(v => !removingslots.includes(v));
                            MallTime.shift();
                            if (MallTime.length === 0) {
                                return res.status(400).json({
                                    status: false,
                                    message: "slota are not present"
                                });
                            }
                            return res.status(200).json({
                                message: "slots",
                                result: MallTime
                            });
                        }
                        else if (currentTime < Mstartti) {
                            console.log('else if');
                            for (let i = 0; i < MstartTime.length; i++) {
                                let startt = (0, moment_timezone_1.default)(MstartTime[i], "HH:mm");
                                let endt = (0, moment_timezone_1.default)(MendTime[i], "HH:mm");
                                while (startt < endt) {
                                    MallTime.push(startt.format("hh:mm A"));
                                    startt.add(30, 'minutes');
                                }
                            }
                            for (let i = 0; i < MStartbreakTime.length; i++) {
                                let startt = (0, moment_timezone_1.default)(MStartbreakTime[i], "HH:mm");
                                let endt = (0, moment_timezone_1.default)(MEndbreakTime[i], "HH:mm");
                                while (startt < endt) {
                                    MallendTime.push(startt.format("hh:mm A"));
                                    startt.add(30, 'minutes');
                                }
                            }
                            //console.log(allendTime)
                            MallTime = MallTime.filter(v => !MallendTime.includes(v));
                            return res.status(200).json({
                                message: "slots",
                                result: MallTime
                            });
                        }
                    }
                    else {
                        console.log("else");
                        for (let i = 0; i < MstartTime.length; i++) {
                            let startt = (0, moment_timezone_1.default)(MstartTime[i], "HH:mm");
                            let endt = (0, moment_timezone_1.default)(MendTime[i], "HH:mm");
                            while (startt < endt) {
                                MallTime.push(startt.format("hh:mm A"));
                                startt.add(30, 'minutes');
                            }
                        }
                        for (let i = 0; i < MStartbreakTime.length; i++) {
                            let startt = (0, moment_timezone_1.default)(MStartbreakTime[i], "HH:mm");
                            let endt = (0, moment_timezone_1.default)(MEndbreakTime[i], "HH:mm");
                            while (startt < endt) {
                                MallendTime.push(startt.format("hh:mm A"));
                                startt.add(30, 'minutes');
                            }
                        }
                        //console.log(allendTime)
                        MallTime = MallTime.filter(v => !MallendTime.includes(v));
                        return res.status(200).json({
                            message: "slots",
                            result: MallTime
                        });
                    }
                    break;
                case "Tuesday":
                    console.log("thuesday");
                    if (!(slots === null || slots === void 0 ? void 0 : slots.Tuesday[0])) {
                        return res.status(400).send("slots are not there");
                    }
                    let TubreakTime = slots === null || slots === void 0 ? void 0 : slots.Saturday[0].breakTime;
                    let TuStartbreakTime = TubreakTime.filter((_, i) => !(i % 2));
                    console.log("rii");
                    let TuEndbreakTime = TubreakTime.filter((_, i) => (i % 2));
                    let TustartTime = slots === null || slots === void 0 ? void 0 : slots.Saturday[0].startTime;
                    let TuendTime = slots === null || slots === void 0 ? void 0 : slots.Saturday[0].endTime;
                    let TuallTime = [];
                    let TuallendTime = [];
                    let Tustartti = slots === null || slots === void 0 ? void 0 : slots.Saturday[0].startTime[0];
                    console.log(Tustartti);
                    let Tuall = [];
                    for (let i = 0; i < TustartTime.length; i++) {
                        let startt = (0, moment_timezone_1.default)(TustartTime[i], "HH:mm");
                        let endt = (0, moment_timezone_1.default)(TuendTime[i], "HH:mm");
                        while (startt < endt) {
                            Tuall.push(startt.format("hh:mm A"));
                            startt.add(30, 'minutes');
                        }
                    }
                    if (userDt === ptz) {
                        if (currentTime >= Tustartti) {
                            console.log("first");
                            for (let i = 0; i < TustartTime.length; i++) {
                                let startt = (0, moment_timezone_1.default)(TustartTime[i], "HH:mm");
                                let starttt = (0, moment_timezone_1.default)(startt).format('HH:mm');
                                starttt = currentTime;
                                let endt = (0, moment_timezone_1.default)(TuendTime[i], "HH:mm");
                                let h = (0, moment_timezone_1.default)(starttt, 'HH:mm').format('HH');
                                let m = (0, moment_timezone_1.default)(starttt, 'HH:mm').format('mm');
                                if (m >= '1' && m <= '29') {
                                    m = '00';
                                }
                                else if (m >= '31' && m <= '59') {
                                    m = '30';
                                }
                                let ti = `${h}:${m}`;
                                let st = (0, moment_timezone_1.default)(ti, 'HH:mm');
                                //console.log(st);
                                while (st < endt) {
                                    TuallTime.push(st.format("hh:mm A"));
                                    st.add(30, 'minutes');
                                }
                            }
                            console.log(TuallTime);
                            let AFallTime = TuallTime.filter(v => !Tuall.includes(v));
                            for (let i = 0; i < TuStartbreakTime.length; i++) {
                                let startt = (0, moment_timezone_1.default)(TuStartbreakTime[i], "HH:mm");
                                let endt = (0, moment_timezone_1.default)(TuEndbreakTime[i], "HH:mm");
                                while (startt < endt) {
                                    TuallendTime.push(startt.format("hh:mm A"));
                                    startt.add(30, 'minutes');
                                }
                            }
                            //console.log(allendTime)
                            let removingslots = TuallendTime.concat(allslots.flat(), AFallTime);
                            //console.log(removingslots)
                            TuallTime = TuallTime.filter(v => !removingslots.includes(v));
                            TuallTime.shift();
                            if (TuallTime.length === 0) {
                                return res.status(400).json({
                                    status: false,
                                    message: "slota are not present"
                                });
                            }
                            return res.status(200).json({
                                message: "slots",
                                result: TuallTime
                            });
                        }
                        else if (currentTime < Tustartti) {
                            console.log('else if');
                            for (let i = 0; i < TustartTime.length; i++) {
                                let startt = (0, moment_timezone_1.default)(TustartTime[i], "HH:mm");
                                let endt = (0, moment_timezone_1.default)(TuendTime[i], "HH:mm");
                                while (startt < endt) {
                                    TuallTime.push(startt.format("hh:mm A"));
                                    startt.add(30, 'minutes');
                                }
                            }
                            for (let i = 0; i < TuStartbreakTime.length; i++) {
                                let startt = (0, moment_timezone_1.default)(TuStartbreakTime[i], "HH:mm");
                                let endt = (0, moment_timezone_1.default)(TuEndbreakTime[i], "HH:mm");
                                while (startt < endt) {
                                    TuallendTime.push(startt.format("hh:mm A"));
                                    startt.add(30, 'minutes');
                                }
                            }
                            //console.log(allendTime)
                            TuallTime = TuallTime.filter(v => !TuallendTime.includes(v));
                            return res.status(200).json({
                                message: "slots",
                                result: TuallTime
                            });
                        }
                    }
                    else {
                        console.log("else");
                        for (let i = 0; i < TustartTime.length; i++) {
                            let startt = (0, moment_timezone_1.default)(TustartTime[i], "HH:mm");
                            let endt = (0, moment_timezone_1.default)(TuendTime[i], "HH:mm");
                            while (startt < endt) {
                                TuallTime.push(startt.format("hh:mm A"));
                                startt.add(30, 'minutes');
                            }
                        }
                        for (let i = 0; i < TuStartbreakTime.length; i++) {
                            let startt = (0, moment_timezone_1.default)(TuStartbreakTime[i], "HH:mm");
                            let endt = (0, moment_timezone_1.default)(TuEndbreakTime[i], "HH:mm");
                            while (startt < endt) {
                                TuallendTime.push(startt.format("hh:mm A"));
                                startt.add(30, 'minutes');
                            }
                        }
                        //console.log(allendTime)
                        TuallTime = TuallTime.filter(v => !TuallendTime.includes(v));
                        return res.status(200).json({
                            message: "slots",
                            result: TuallTime
                        });
                    }
                    break;
                case "Wednesday":
                    console.log(" This is wednesday");
                    if (!(slots === null || slots === void 0 ? void 0 : slots.Wednesday[0])) {
                        return res.status(400).send("slots are not there");
                    }
                    let WbreakTime = slots === null || slots === void 0 ? void 0 : slots.Wednesday[0].breakTime;
                    let WStartbreakTime = WbreakTime.filter((_, i) => !(i % 2));
                    console.log("rii");
                    let WEndbreakTime = WbreakTime.filter((_, i) => (i % 2));
                    let WstartTime = slots === null || slots === void 0 ? void 0 : slots.Wednesday[0].startTime;
                    let WendTime = slots === null || slots === void 0 ? void 0 : slots.Wednesday[0].endTime;
                    let WallTime = [];
                    let WallendTime = [];
                    let Wstartti = slots === null || slots === void 0 ? void 0 : slots.Wednesday[0].startTime[0];
                    console.log(Wstartti);
                    let Wall = [];
                    for (let i = 0; i < WstartTime.length; i++) {
                        let startt = (0, moment_timezone_1.default)(WstartTime[i], "HH:mm");
                        let endt = (0, moment_timezone_1.default)(WendTime[i], "HH:mm");
                        while (startt < endt) {
                            Wall.push(startt.format("hh:mm A"));
                            startt.add(30, 'minutes');
                        }
                    }
                    if (userDt === ptz) {
                        if (currentTime >= Wstartti) {
                            console.log("first");
                            for (let i = 0; i < WstartTime.length; i++) {
                                let startt = (0, moment_timezone_1.default)(WstartTime[i], "HH:mm");
                                let starttt = (0, moment_timezone_1.default)(startt).format('HH:mm');
                                starttt = currentTime;
                                let endt = (0, moment_timezone_1.default)(WendTime[i], "HH:mm");
                                let h = (0, moment_timezone_1.default)(starttt, 'HH:mm').format('HH');
                                let m = (0, moment_timezone_1.default)(starttt, 'HH:mm').format('mm');
                                if (m >= '1' && m <= '29') {
                                    m = '00';
                                }
                                else if (m >= '31' && m <= '59') {
                                    m = '30';
                                }
                                let ti = `${h}:${m}`;
                                let st = (0, moment_timezone_1.default)(ti, 'HH:mm');
                                //console.log(st);
                                while (st < endt) {
                                    WallTime.push(st.format("hh:mm A"));
                                    st.add(30, 'minutes');
                                }
                            }
                            let AFallTime = WallTime.filter(v => !all.includes(v));
                            for (let i = 0; i < WStartbreakTime.length; i++) {
                                let startt = (0, moment_timezone_1.default)(WStartbreakTime[i], "HH:mm");
                                let endt = (0, moment_timezone_1.default)(WEndbreakTime[i], "HH:mm");
                                while (startt < endt) {
                                    WallendTime.push(startt.format("hh:mm A"));
                                    startt.add(30, 'minutes');
                                }
                            }
                            let removingslots = WallendTime.concat(allslots.flat(), AFallTime);
                            //console.log(removingslots)
                            WallTime = WallTime.filter(v => !removingslots.includes(v));
                            WallTime.shift();
                            if (WallTime.length === 0) {
                                return res.status(400).json({
                                    status: false,
                                    message: "slota are not present"
                                });
                            }
                            return res.status(200).json({
                                message: "slots",
                                result: WallTime
                            });
                        }
                        else if (currentTime < Wstartti) {
                            console.log('else if');
                            for (let i = 0; i < WstartTime.length; i++) {
                                let startt = (0, moment_timezone_1.default)(WstartTime[i], "HH:mm");
                                let endt = (0, moment_timezone_1.default)(WendTime[i], "HH:mm");
                                while (startt < endt) {
                                    WallTime.push(startt.format("hh:mm A"));
                                    startt.add(30, 'minutes');
                                }
                            }
                            for (let i = 0; i < WStartbreakTime.length; i++) {
                                let startt = (0, moment_timezone_1.default)(WStartbreakTime[i], "HH:mm");
                                let endt = (0, moment_timezone_1.default)(WEndbreakTime[i], "HH:mm");
                                while (startt < endt) {
                                    WallendTime.push(startt.format("hh:mm A"));
                                    startt.add(30, 'minutes');
                                }
                            }
                            //console.log(allendTime)
                            WallTime = WallTime.filter(v => !WallendTime.includes(v));
                            return res.status(200).json({
                                message: "slots",
                                result: WallTime
                            });
                        }
                    }
                    else {
                        console.log("else");
                        for (let i = 0; i < WstartTime.length; i++) {
                            let startt = (0, moment_timezone_1.default)(WstartTime[i], "HH:mm");
                            let endt = (0, moment_timezone_1.default)(WendTime[i], "HH:mm");
                            while (startt < endt) {
                                WallTime.push(startt.format("hh:mm A"));
                                startt.add(30, 'minutes');
                            }
                        }
                        for (let i = 0; i < WStartbreakTime.length; i++) {
                            let startt = (0, moment_timezone_1.default)(WStartbreakTime[i], "HH:mm");
                            let endt = (0, moment_timezone_1.default)(WEndbreakTime[i], "HH:mm");
                            while (startt < endt) {
                                WallendTime.push(startt.format("hh:mm A"));
                                startt.add(30, 'minutes');
                            }
                        }
                        //console.log(allendTime)
                        WallTime = WallTime.filter(v => !WallendTime.includes(v));
                        return res.status(200).json({
                            message: "slots",
                            result: WallTime
                        });
                    }
                    break;
                case "Thursday":
                    console.log("thursday");
                    if (!(slots === null || slots === void 0 ? void 0 : slots.Thursday[0])) {
                        return res.status(400).send("slots are not there");
                    }
                    let breakTime = slots === null || slots === void 0 ? void 0 : slots.Thursday[0].breakTime;
                    let StartbreakTime = breakTime.filter((_, i) => !(i % 2));
                    let EndbreakTime = breakTime.filter((_, i) => (i % 2));
                    let startTime = slots === null || slots === void 0 ? void 0 : slots.Thursday[0].startTime;
                    let endTime = slots === null || slots === void 0 ? void 0 : slots.Thursday[0].endTime;
                    let allTime = [];
                    let allendTime = [];
                    let startti = slots === null || slots === void 0 ? void 0 : slots.Thursday[0].startTime[0];
                    let Tall = [];
                    for (let i = 0; i < startTime.length; i++) {
                        let startt = (0, moment_timezone_1.default)(startTime[i], "HH:mm");
                        let endt = (0, moment_timezone_1.default)(endTime[i], "HH:mm");
                        while (startt < endt) {
                            Tall.push(startt.format("hh:mm A"));
                            startt.add(30, 'minutes');
                        }
                    }
                    if (userDt === ptz) {
                        if (currentTime >= startti) {
                            console.log("first");
                            for (let i = 0; i < startTime.length; i++) {
                                let startt = (0, moment_timezone_1.default)(startTime[i], "HH:mm");
                                let starttt = (0, moment_timezone_1.default)(startt).format('HH:mm');
                                starttt = currentTime;
                                //startt=currentTime
                                let endt = (0, moment_timezone_1.default)(endTime[i], "HH:mm");
                                let h = (0, moment_timezone_1.default)(starttt, 'HH:mm').format('HH');
                                let m = (0, moment_timezone_1.default)(starttt, 'HH:mm').format('mm');
                                if (m >= '1' && m <= '29') {
                                    m = '00';
                                }
                                else if (m >= '31' && m <= '59') {
                                    m = '30';
                                }
                                let ti = `${h}:${m}`;
                                let st = (0, moment_timezone_1.default)(ti, 'HH:mm');
                                //console.log(st);
                                while (st < endt) {
                                    allTime.push(st.format("hh:mm A"));
                                    st.add(30, 'minutes');
                                }
                            }
                            console.log(allTime);
                            let AFallTime = allTime.filter(v => !all.includes(v));
                            for (let i = 0; i < StartbreakTime.length; i++) {
                                let startt = (0, moment_timezone_1.default)(StartbreakTime[i], "HH:mm");
                                let endt = (0, moment_timezone_1.default)(EndbreakTime[i], "HH:mm");
                                while (startt < endt) {
                                    allendTime.push(startt.format("hh:mm A"));
                                    startt.add(30, 'minutes');
                                }
                            }
                            //console.log(allendTime)
                            let removingslots = allendTime.concat(allslots.flat(), AFallTime);
                            console.log(removingslots);
                            allTime = allTime.filter(v => !removingslots.includes(v));
                            allTime.shift();
                            if (allTime.length === 0) {
                                return res.status(400).json({
                                    status: false,
                                    message: "slota are not present"
                                });
                            }
                            return res.status(200).json({
                                message: "slots",
                                result: allTime
                            });
                        }
                        else if (currentTime < startti) {
                            console.log("else if");
                            for (let i = 0; i < startTime.length; i++) {
                                let startt = (0, moment_timezone_1.default)(startTime[i], "HH:mm");
                                let endt = (0, moment_timezone_1.default)(endTime[i], "HH:mm");
                                while (startt < endt) {
                                    allTime.push(startt.format("hh:mm A"));
                                    startt.add(30, 'minutes');
                                }
                            }
                            for (let i = 0; i < StartbreakTime.length; i++) {
                                let startt = (0, moment_timezone_1.default)(StartbreakTime[i], "HH:mm");
                                let endt = (0, moment_timezone_1.default)(EndbreakTime[i], "HH:mm");
                                while (startt < endt) {
                                    allendTime.push(startt.format("hh:mm A"));
                                    startt.add(30, 'minutes');
                                }
                            }
                            //console.log(allendTime)
                            allTime = allTime.filter(v => !allendTime.includes(v));
                            return res.status(200).json({
                                message: "slots",
                                result: allTime
                            });
                        }
                    }
                    else {
                        for (let i = 0; i < startTime.length; i++) {
                            let startt = (0, moment_timezone_1.default)(startTime[i], "HH:mm");
                            let endt = (0, moment_timezone_1.default)(endTime[i], "HH:mm");
                            while (startt < endt) {
                                allTime.push(startt.format("hh:mm A"));
                                startt.add(30, 'minutes');
                            }
                        }
                        for (let i = 0; i < StartbreakTime.length; i++) {
                            let startt = (0, moment_timezone_1.default)(StartbreakTime[i], "HH:mm");
                            let endt = (0, moment_timezone_1.default)(EndbreakTime[i], "HH:mm");
                            while (startt < endt) {
                                allendTime.push(startt.format("hh:mm A"));
                                startt.add(30, 'minutes');
                            }
                        }
                        //console.log(allendTime)
                        let removingslots = allendTime.concat(allslots.flat());
                        console.log(removingslots);
                        allTime = allTime.filter(v => !removingslots.includes(v));
                        return res.status(200).json({
                            message: "slots",
                            result: allTime
                        });
                    }
                    break;
                case "Friday":
                    console.log("friday");
                    if (!(slots === null || slots === void 0 ? void 0 : slots.Friday[0])) {
                        return res.status(400).send("slots are not there");
                    }
                    let FbreakTime = slots === null || slots === void 0 ? void 0 : slots.Friday[0].breakTime;
                    let FStartbreakTime = FbreakTime.filter((_, i) => !(i % 2));
                    let FEndbreakTime = FbreakTime.filter((_, i) => (i % 2));
                    let FstartTime = slots === null || slots === void 0 ? void 0 : slots.Friday[0].startTime;
                    let FendTime = slots === null || slots === void 0 ? void 0 : slots.Friday[0].endTime;
                    let FallTime = [];
                    let FallendTime = [];
                    let Fstartti = slots === null || slots === void 0 ? void 0 : slots.Friday[0].startTime[0];
                    console.log(Fstartti);
                    let all = [];
                    for (let i = 0; i < FstartTime.length; i++) {
                        let startt = (0, moment_timezone_1.default)(FstartTime[i], "HH:mm");
                        let endt = (0, moment_timezone_1.default)(FendTime[i], "HH:mm");
                        while (startt < endt) {
                            all.push(startt.format("hh:mm A"));
                            startt.add(30, 'minutes');
                        }
                    }
                    // console.log("alll");
                    //console.log(all)
                    if (userDt === ptz) {
                        if (currentTime >= Fstartti) {
                            console.log("first");
                            for (let i = 0; i < FstartTime.length; i++) {
                                let startt = (0, moment_timezone_1.default)(FstartTime[i], "HH:mm");
                                let endt = (0, moment_timezone_1.default)(FendTime[i], "HH:mm");
                                let starttt = (0, moment_timezone_1.default)(startt).format('HH:mm');
                                starttt = currentTime;
                                console.log("hello");
                                let h = (0, moment_timezone_1.default)(starttt, 'HH:mm').format('HH');
                                let m = (0, moment_timezone_1.default)(starttt, 'HH:mm').format('mm');
                                if (m >= '1' && m <= '29') {
                                    m = '00';
                                }
                                else if (m >= '31' && m <= '59') {
                                    m = '30';
                                }
                                let ti = `${h}:${m}`;
                                let st = (0, moment_timezone_1.default)(ti, 'HH:mm');
                                //console.log(st)
                                while (st < endt) {
                                    FallTime.push(st.format("hh:mm A"));
                                    st.add(30, 'm');
                                }
                            }
                            let AFallTime = FallTime.filter(v => !all.includes(v));
                            // console.log(AFallTime)
                            for (let i = 0; i < FStartbreakTime.length; i++) {
                                let startt = (0, moment_timezone_1.default)(FStartbreakTime[i], "HH:mm");
                                let endt = (0, moment_timezone_1.default)(FEndbreakTime[i], "HH:mm");
                                while (startt < endt) {
                                    FallendTime.push(startt.format("hh:mm A"));
                                    startt.add(30, 'minutes');
                                }
                            }
                            //console.log(allendTime)
                            let removingslots = FallendTime.concat(allslots.flat(), AFallTime);
                            //console.log(removingslots)
                            FallTime = FallTime.filter(v => !removingslots.includes(v));
                            FallTime.shift();
                            if (FallTime.length === 0) {
                                return res.status(400).json({
                                    status: false,
                                    message: "slota are not present"
                                });
                            }
                            return res.status(200).json({
                                message: "slots",
                                result: FallTime
                            });
                        }
                        else if (currentTime < Fstartti) {
                            console.log('else if');
                            for (let i = 0; i < FstartTime.length; i++) {
                                let startt = (0, moment_timezone_1.default)(FstartTime[i], "HH:mm");
                                let endt = (0, moment_timezone_1.default)(FendTime[i], "HH:mm");
                                while (startt < endt) {
                                    FallTime.push(startt.format("hh:mm A"));
                                    startt.add(30, 'minutes');
                                }
                            }
                            for (let i = 0; i < FStartbreakTime.length; i++) {
                                let startt = (0, moment_timezone_1.default)(FStartbreakTime[i], "HH:mm");
                                let endt = (0, moment_timezone_1.default)(FEndbreakTime[i], "HH:mm");
                                while (startt < endt) {
                                    FallendTime.push(startt.format("hh:mm A"));
                                    startt.add(30, 'minutes');
                                }
                            }
                            //console.log(allendTime)
                            let removingslots = FallendTime.concat(allslots.flat());
                            console.log(removingslots);
                            FallTime = FallTime.filter(v => !removingslots.includes(v));
                            return res.status(200).json({
                                message: "slots",
                                result: FallTime
                            });
                        }
                    }
                    else {
                        console.log("else");
                        for (let i = 0; i < FstartTime.length; i++) {
                            let startt = (0, moment_timezone_1.default)(FstartTime[i], "HH:mm");
                            let endt = (0, moment_timezone_1.default)(FendTime[i], "HH:mm");
                            while (startt < endt) {
                                FallTime.push(startt.format("hh:mm A"));
                                startt.add(30, 'minutes');
                            }
                        }
                        for (let i = 0; i < FStartbreakTime.length; i++) {
                            let startt = (0, moment_timezone_1.default)(FStartbreakTime[i], "HH:mm");
                            let endt = (0, moment_timezone_1.default)(FEndbreakTime[i], "HH:mm");
                            while (startt < endt) {
                                FallendTime.push(startt.format("hh:mm A"));
                                startt.add(30, 'minutes');
                            }
                        }
                        //console.log(allendTime)
                        let removingslots = FallendTime.concat(allslots.flat());
                        console.log(removingslots);
                        FallTime = FallTime.filter(v => !removingslots.includes(v));
                        return res.status(200).json({
                            message: "slots",
                            result: FallTime
                        });
                    }
                    break;
                case "Saturday":
                    console.log("saturday");
                    if (!(slots === null || slots === void 0 ? void 0 : slots.Saturday[0])) {
                        return res.status(400).send("slots are not there");
                    }
                    let SbreakTime = slots === null || slots === void 0 ? void 0 : slots.Saturday[0].breakTime;
                    let SStartbreakTime = SbreakTime.filter((_, i) => !(i % 2));
                    console.log("rii");
                    let SEndbreakTime = SbreakTime.filter((_, i) => (i % 2));
                    let SstartTime = slots === null || slots === void 0 ? void 0 : slots.Saturday[0].startTime;
                    let SendTime = slots === null || slots === void 0 ? void 0 : slots.Saturday[0].endTime;
                    let SallTime = [];
                    let SallendTime = [];
                    let Sstartti = slots === null || slots === void 0 ? void 0 : slots.Saturday[0].startTime[0];
                    console.log(Sstartti);
                    let Sall = [];
                    for (let i = 0; i < SstartTime.length; i++) {
                        let startt = (0, moment_timezone_1.default)(SstartTime[i], "HH:mm");
                        let endt = (0, moment_timezone_1.default)(SendTime[i], "HH:mm");
                        while (startt < endt) {
                            Sall.push(startt.format("hh:mm A"));
                            startt.add(30, 'minutes');
                        }
                    }
                    if (userDt === ptz) {
                        if (currentTime >= Sstartti) {
                            console.log("first");
                            for (let i = 0; i < SstartTime.length; i++) {
                                let startt = (0, moment_timezone_1.default)(SstartTime[i], "HH:mm");
                                let starttt = (0, moment_timezone_1.default)(startt).format('HH:mm');
                                starttt = currentTime;
                                let endt = (0, moment_timezone_1.default)(SendTime[i], "HH:mm");
                                let h = (0, moment_timezone_1.default)(starttt, 'HH:mm').format('HH');
                                let m = (0, moment_timezone_1.default)(starttt, 'HH:mm').format('mm');
                                if (m >= '1' && m <= '29') {
                                    m = '00';
                                }
                                else if (m >= '31' && m <= '59') {
                                    m = '30';
                                }
                                let ti = `${h}:${m}`;
                                let st = (0, moment_timezone_1.default)(ti, 'HH:mm');
                                //console.log(st);
                                while (st < endt) {
                                    SallTime.push(st.format("hh:mm A"));
                                    st.add(30, 'minutes');
                                }
                            }
                            console.log(SallTime);
                            // let start = moment(startti,'HH:mm').format('HH:mm')
                            let AFallTime = SallTime.filter(v => !Sall.includes(v));
                            // console.log(AFallTime)
                            for (let i = 0; i < SStartbreakTime.length; i++) {
                                let startt = (0, moment_timezone_1.default)(SStartbreakTime[i], "HH:mm");
                                let endt = (0, moment_timezone_1.default)(SEndbreakTime[i], "HH:mm");
                                while (startt < endt) {
                                    SallendTime.push(startt.format("hh:mm A"));
                                    startt.add(30, 'minutes');
                                }
                            }
                            //console.log(allendTime)
                            let removingslots = FallendTime.concat(allslots.flat(), AFallTime);
                            //console.log(removingslots)
                            SallTime = SallTime.filter(v => !removingslots.includes(v));
                            SallTime.shift();
                            if (SallTime.length === 0) {
                                return res.status(400).json({
                                    status: false,
                                    message: "slota are not present"
                                });
                            }
                            return res.status(200).json({
                                message: "slots",
                                result: SallTime
                            });
                        }
                        else if (currentTime < Sstartti) {
                            console.log('else if');
                            for (let i = 0; i < SstartTime.length; i++) {
                                let startt = (0, moment_timezone_1.default)(SstartTime[i], "HH:mm");
                                let endt = (0, moment_timezone_1.default)(SendTime[i], "HH:mm");
                                while (startt < endt) {
                                    SallTime.push(startt.format("hh:mm A"));
                                    startt.add(30, 'minutes');
                                }
                            }
                            for (let i = 0; i < SStartbreakTime.length; i++) {
                                let startt = (0, moment_timezone_1.default)(SStartbreakTime[i], "HH:mm");
                                let endt = (0, moment_timezone_1.default)(SEndbreakTime[i], "HH:mm");
                                while (startt < endt) {
                                    SallendTime.push(startt.format("hh:mm A"));
                                    startt.add(30, 'minutes');
                                }
                            }
                            //console.log(allendTime)
                            let removingslots = SallendTime.concat(allslots.flat());
                            console.log(removingslots);
                            SallTime = SallTime.filter(v => !removingslots.includes(v));
                            return res.status(200).json({
                                message: "slots",
                                result: SallTime
                            });
                        }
                    }
                    else {
                        console.log("else");
                        for (let i = 0; i < SstartTime.length; i++) {
                            let startt = (0, moment_timezone_1.default)(SstartTime[i], "HH:mm");
                            let endt = (0, moment_timezone_1.default)(SendTime[i], "HH:mm");
                            while (startt < endt) {
                                SallTime.push(startt.format("hh:mm A"));
                                startt.add(30, 'minutes');
                            }
                        }
                        for (let i = 0; i < SStartbreakTime.length; i++) {
                            let startt = (0, moment_timezone_1.default)(SStartbreakTime[i], "HH:mm");
                            let endt = (0, moment_timezone_1.default)(SEndbreakTime[i], "HH:mm");
                            while (startt < endt) {
                                SallendTime.push(startt.format("hh:mm A"));
                                startt.add(30, 'minutes');
                            }
                        }
                        let removingslots = SallendTime.concat(allslots.flat());
                        console.log(removingslots);
                        //console.log(allendTime)
                        SallTime = SallTime.filter(v => !removingslots.includes(v));
                        return res.status(200).json({
                            message: "slots",
                            result: SallTime
                        });
                    }
                    break;
                case "Sunday":
                    if (!(slots === null || slots === void 0 ? void 0 : slots.Sunday[0])) {
                        return res.status(400).send("slots are not there");
                    }
                    let SnbreakTime = slots === null || slots === void 0 ? void 0 : slots.Sunday[0].breakTime;
                    let SnStartbreakTime = SnbreakTime.filter((_, i) => !(i % 2));
                    console.log("rii");
                    let SnEndbreakTime = SnbreakTime.filter((_, i) => (i % 2));
                    let SnstartTime = slots === null || slots === void 0 ? void 0 : slots.Saturday[0].startTime;
                    let SnendTime = slots === null || slots === void 0 ? void 0 : slots.Saturday[0].endTime;
                    let SnallTime = [];
                    let SnallendTime = [];
                    let Snstartti = slots === null || slots === void 0 ? void 0 : slots.Saturday[0].startTime[0];
                    console.log(Sstartti);
                    let Snall = [];
                    for (let i = 0; i < SnstartTime.length; i++) {
                        let startt = (0, moment_timezone_1.default)(SnstartTime[i], "HH:mm");
                        let endt = (0, moment_timezone_1.default)(SnendTime[i], "HH:mm");
                        while (startt < endt) {
                            Snall.push(startt.format("hh:mm A"));
                            startt.add(30, 'minutes');
                        }
                    }
                    if (userDt === ptz) {
                        if (currentTime >= Sstartti) {
                            console.log("first");
                            for (let i = 0; i < SnstartTime.length; i++) {
                                let startt = (0, moment_timezone_1.default)(SnstartTime[i], "HH:mm");
                                let starttt = (0, moment_timezone_1.default)(startt).format('HH:mm');
                                starttt = currentTime;
                                let endt = (0, moment_timezone_1.default)(SnendTime[i], "HH:mm");
                                let h = (0, moment_timezone_1.default)(starttt, 'HH:mm').format('HH');
                                let m = (0, moment_timezone_1.default)(starttt, 'HH:mm').format('mm');
                                if (m >= '1' && m <= '29') {
                                    m = '00';
                                }
                                else if (m >= '31' && m <= '59') {
                                    m = '30';
                                }
                                let ti = `${h}:${m}`;
                                let st = (0, moment_timezone_1.default)(ti, 'HH:mm');
                                //console.log(st);
                                while (st < endt) {
                                    SnallTime.push(st.format("hh:mm A"));
                                    st.add(30, 'minutes');
                                }
                            }
                            console.log(SnallTime);
                            let AFallTime = SnallTime.filter(v => !all.includes(v));
                            // console.log(AFallTime)
                            for (let i = 0; i < SnStartbreakTime.length; i++) {
                                let startt = (0, moment_timezone_1.default)(SnStartbreakTime[i], "HH:mm");
                                let endt = (0, moment_timezone_1.default)(SnEndbreakTime[i], "HH:mm");
                                while (startt < endt) {
                                    SnallendTime.push(startt.format("hh:mm A"));
                                    startt.add(30, 'minutes');
                                }
                            }
                            //console.log(allendTime)
                            let removingslots = SnallendTime.concat(allslots.flat(), AFallTime);
                            //console.log(removingslots)
                            SnallTime = SnallTime.filter(v => !removingslots.includes(v));
                            SnallTime.shift();
                            if (SnallTime.length === 0) {
                                return res.status(400).json({
                                    status: false,
                                    message: "slota are not present"
                                });
                            }
                            return res.status(200).json({
                                message: "slots",
                                result: SnallTime
                            });
                        }
                        else if (currentTime < Snstartti) {
                            console.log('else if');
                            for (let i = 0; i < SnstartTime.length; i++) {
                                let startt = (0, moment_timezone_1.default)(SnstartTime[i], "HH:mm");
                                let endt = (0, moment_timezone_1.default)(SnendTime[i], "HH:mm");
                                while (startt < endt) {
                                    SnallTime.push(startt.format("hh:mm A"));
                                    startt.add(30, 'minutes');
                                }
                            }
                            for (let i = 0; i < SnStartbreakTime.length; i++) {
                                let startt = (0, moment_timezone_1.default)(SnStartbreakTime[i], "HH:mm");
                                let endt = (0, moment_timezone_1.default)(SnEndbreakTime[i], "HH:mm");
                                while (startt < endt) {
                                    SnallendTime.push(startt.format("hh:mm A"));
                                    startt.add(30, 'minutes');
                                }
                            }
                            //console.log(allendTime)
                            SnallTime = SnallTime.filter(v => !SnallendTime.includes(v));
                            return res.status(200).json({
                                message: "slots",
                                result: SnallTime
                            });
                        }
                    }
                    else {
                        console.log("else");
                        for (let i = 0; i < SnstartTime.length; i++) {
                            let startt = (0, moment_timezone_1.default)(SnstartTime[i], "HH:mm");
                            let endt = (0, moment_timezone_1.default)(SnendTime[i], "HH:mm");
                            while (startt < endt) {
                                SnallTime.push(startt.format("hh:mm A"));
                                startt.add(30, 'minutes');
                            }
                        }
                        for (let i = 0; i < SnStartbreakTime.length; i++) {
                            let startt = (0, moment_timezone_1.default)(SnStartbreakTime[i], "HH:mm");
                            let endt = (0, moment_timezone_1.default)(SnEndbreakTime[i], "HH:mm");
                            while (startt < endt) {
                                SnallendTime.push(startt.format("hh:mm A"));
                                startt.add(30, 'minutes');
                            }
                        }
                        //console.log(allendTime)
                        SnallTime = SnallTime.filter(v => !SnallendTime.includes(v));
                        return res.status(200).json({
                            message: "slots",
                            result: SnallTime
                        });
                    }
                    console.log("sunday");
                    break;
            }
        }
        else {
            return res.status(400).json({
                message: "slots are not present"
            });
        }
    }
    catch (error) {
        res.status(400).send(error);
        console.log(error);
    }
});
exports.GetAppointment = GetAppointment;
const updateSlot = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let users = yield days_1.default.findOne({ email: req.query.email });
        if (!users) {
            return res.status(500).json({
                success: false,
                message: "user is not presnt",
            });
        }
        if (users === null || users === void 0 ? void 0 : users.isDeleted) {
            return res.status(400).json({
                message: "user is not there in our database"
            });
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
        const user = yield days_1.default.findOneAndUpdate({ email: req.query.email }, newUserData, {
            new: true,
            runValidators: false,
            userFindAndModify: true,
        });
        return res.status(200).json({
            message: "user updated sucessfully",
            result: user
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).send("Internal server");
    }
});
exports.updateSlot = updateSlot;
const bookingSlots = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let user = yield bookingModel_1.default.find({ TimeZone: req.body.TimeZone, AppointmentDate: req.body.AppointmentDate, email: req.body.email }, { "SlotsTime": "$SlotsTime" });
    let daysdata = yield days_1.default.findOne({ email: req.body.email });
    if (!daysdata) {
        return res.status(400).json({
            status: false,
            message: "user is not present"
        });
    }
    let date = (0, moment_timezone_1.default)().tz(req.body.TimeZone).format('YYYY-MM-DD');
    console.log(date);
    let enterdat = (0, moment_timezone_1.default)(req.body.AppointmentDate).format('YYYY-MM-DD');
    console.log(enterdat);
    if (date === enterdat) {
        console.log("vamsi");
    }
    if (date > enterdat) {
        return res.status(400).json({
            status: false,
            message: "date is grater or equalto  today"
        });
    }
    //console.log(user)
    let allslots = [];
    for (let i = 0; i < user.length; i++) {
        allslots.push(user[i].SlotsTime);
    }
    console.log(allslots.flat());
    const found = allslots.flat().some((r) => req.body.SlotsTime.indexOf(r) >= 0);
    //console.log(found)
    if (found) {
        return res.status(400).json({
            Status: false,
            message: 'Slot is already Booked'
        });
    }
    ;
    try {
        let BookingModels = new bookingModel_1.default({
            TimeZone: req.body.TimeZone,
            SlotsTime: req.body.SlotsTime,
            Service: req.body.Service,
            email: req.body.email,
            Name: req.body.Name,
            Duerication: req.body.Duerication,
            AppointmentDate: req.body.AppointmentDate
        });
        let slot = yield BookingModels.save();
        let transporters = nodemailer_1.default.createTransport({
            service: 'gmail',
            auth: {
                user: "kotavamsi16@gmail.com",
                pass: "mbjypwpxtpswciyp",
            },
            tls: {
                rejectUnauthorized: true,
            },
        });
        let mailOptions = {
            from: "kotavamsi16@gmail.com",
            to: "vamsi.1255237@gmail.com",
            subject: "slot booked",
            text: `Hello ${slot.Name} your slot has been updated to ${slot.AppointmentDate} and slots will be at ${slot.SlotsTime} `,
        };
        transporters.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            }
            console.log('Message sent: ' + info.response);
        });
        return res.status(200).json({
            message: "slot booking sucess",
            result: slot
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
});
exports.bookingSlots = bookingSlots;
const updateBooking = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let users = yield bookingModel_1.default.findById(req.query.id);
        console.log(users.TimeZone);
        //console.log(use)
        if (!users) {
            //console.log("hello")
            return res.status(400).json({
                success: false,
                message: "user is not presnt",
            });
        }
        let daysdata = yield days_1.default.findOne({ email: req.body.email });
        console.log("hello");
        //console.log(daysdata)
        if (!daysdata) {
            return res.status(400).json({
                status: false,
                message: "user is not present"
            });
        }
        if (users === null || users === void 0 ? void 0 : users.isDeleted) {
            return res.status(400).json({
                message: "user is not there in our database"
            });
        }
        let date = (0, moment_timezone_1.default)().tz(req.body.TimeZone).format('YYYY-MM-DD');
        console.log(date);
        let enterdat = (0, moment_timezone_1.default)(req.body.AppointmentDate).format('YYYY-MM-DD');
        console.log(enterdat);
        if (date > enterdat) {
            return res.status(400).json({
                status: false,
                message: "date is grater then today"
            });
        }
        let user = yield bookingModel_1.default.find({ TimeZone: users.TimeZone, email: req.body.email, AppointmentDate: req.body.AppointmentDate }, { "SlotsTime": "$SlotsTime" });
        //console.log(user)
        let allslots = [];
        for (let i = 0; i < user.length; i++) {
            allslots.push(user[i].SlotsTime);
        }
        console.log(allslots.flat());
        const found = allslots.flat().some((r) => req.body.SlotsTime.indexOf(r) >= 0);
        console.log(found);
        if (found) {
            return res.status(400).json({
                Status: false,
                message: 'Slot is already Booked'
            });
        }
        ;
        const newUserData = {
            TimeZone: users.TimeZone,
            SlotsTime: req.body.SlotsTime || users.SlotsTime,
            Service: req.body.Service || users.Service,
            email: req.body.email || users.email,
            Name: req.body.Name || users.Name,
            Duerication: req.body.Duerication || users.Duerication,
            AppointmentDate: req.body.AppointmentDate || users.AppointmentDate
        };
        let data = yield bookingModel_1.default.findByIdAndUpdate({ _id: req.query.id }, newUserData, {
            new: true,
            runValidators: false,
            userFindAndModify: true,
        });
        let transporters = nodemailer_1.default.createTransport({
            service: 'gmail',
            auth: {
                user: "kotavamsi16@gmail.com",
                pass: "mbjypwpxtpswciyp",
            },
            tls: {
                rejectUnauthorized: true,
            },
        });
        let mailOptions = {
            from: "kotavamsi16@gmail.com",
            to: "vamsi.1255237@gmail.com",
            subject: "your slot has been updated",
            text: `Hello ${data.Name} your slot has been updated to ${data.AppointmentDate} and slots will be at ${data.SlotsTime} `
        };
        transporters.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            }
            console.log('Message sent: ' + info.response);
        });
        return res.status(200).json({
            message: "user updated sucessfully",
            result: data
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).send("Hello Internal server");
    }
});
exports.updateBooking = updateBooking;
const getBookingsByEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let user = yield bookingModel_1.default.find({ email: req.query.email, isDeleted: false });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "user is not presnt",
            });
        }
        res.status(200).json({
            message: "data",
            result: user
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: "internal error",
            error: error
        });
    }
});
exports.getBookingsByEmail = getBookingsByEmail;
const getDaysByEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let user = yield days_1.default.find({ email: req.query.email, isDeleted: false });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "user is not presnt",
            });
        }
        res.status(200).json({
            message: "data",
            result: user
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: "internal error",
            error: error
        });
    }
});
exports.getDaysByEmail = getDaysByEmail;
const softDelete = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    debugger;
    try {
        const users = yield bookingModel_1.default.findById(req.params.id);
        console.log(users);
        if (users.isDeleted === true) {
            return res.status(404).json({
                error: 'Requested category does not exist'
            });
        }
        const softdelete = yield bookingModel_1.default.findOneAndUpdate({ _id: users._id }, { isDeleted: true });
        let transporters = nodemailer_1.default.createTransport({
            service: 'gmail',
            auth: {
                user: "kotavamsi16@gmail.com",
                pass: "mbjypwpxtpswciyp",
            },
            tls: {
                rejectUnauthorized: true,
            },
        });
        let mailOptions = {
            from: "kotavamsi16@gmail.com",
            to: "vamsi.1255237@gmail.com",
            subject: "your slot deleted",
            text: `Hello ${users.Name} your slot has been deleted`,
        };
        transporters.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            }
            console.log('Message sent: ' + info.response);
        });
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
});
exports.softDelete = softDelete;
const DaysSoftDelete = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield days_1.default.findById(req.params.id);
        console.log(users);
        if (users.isDeleted === true) {
            return res.status(404).json({
                error: 'Requested category does not exist'
            });
        }
        const softdelete = yield days_1.default.findOneAndUpdate({ _id: users._id }, { isDeleted: true });
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
});
exports.DaysSoftDelete = DaysSoftDelete;
