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
exports.GetAppointment = void 0;
/* eslint-disable no-var */
/* eslint-disable no-case-declarations */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const days_1 = __importDefault(require("../moduls/days"));
const bookingModel_1 = __importDefault(require("../moduls/bookingModel"));
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
const GetAppointment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const date = req.query.date;
        //let da = await DaysModel.findOne({ email: req.query.email })
        const slots = yield days_1.default.findOne({ email: req.query.email });
        const timeZn = slots === null || slots === void 0 ? void 0 : slots.TimeZone;
        const da = slots === null || slots === void 0 ? void 0 : slots.repectForWeek;
        const startdat = slots === null || slots === void 0 ? void 0 : slots.StartDate;
        const va = moment_timezone_1.default.utc(startdat).format("YYYY-MM-DD");
        console.log(va);
        const ptz = moment_timezone_1.default.utc(date).format('YYYY-MM-DD');
        const userDt = moment_timezone_1.default.utc().format("YYYY-MM-DD");
        const userEnteredDt = moment_timezone_1.default.utc(date).format("YYYY-MM-DD");
        const userEnteredDay = moment_timezone_1.default.utc(userEnteredDt).format('dddd');
        const currentTime = moment_timezone_1.default.utc().format('HH:mm');
        if (!slots) {
            return res.status(404).json({
                Message: "user is not present in our database"
            });
        }
        if (slots === null || slots === void 0 ? void 0 : slots.isDeleted) {
            return res.status(404).json({
                message: "user is not present in our database"
            });
        }
        const datas = slots === null || slots === void 0 ? void 0 : slots.repectForWeek;
        //console.log(datas)
        if (!datas) {
            // eslint-disable-next-line no-var
            var ds = moment_timezone_1.default.utc(slots.StartDate).add(1, 'week').format("YYYY-MM-DD");
        }
        else {
            var ds = [];
        }
        console.log(ds);
        const das = ds > va;
        console.log(das);
        if (ds < va) {
            console.log("hello");
            console.log("daa");
        }
        if (userDt <= ptz) {
            if (ptz > va) {
                if (das) {
                    const slot = yield bookingModel_1.default.find({ AppointmentDate: userEnteredDt, email: req.query.email }, { "SlotsTime": "$SlotsTime" });
                    console.log(slot);
                    const allslots = [];
                    for (let i = 0; i < slot.length; i++) {
                        allslots.push(slot[i].SlotsTime);
                    }
                    switch (userEnteredDay) {
                        case "Monday":
                            if (!(slots === null || slots === void 0 ? void 0 : slots.Monday[0])) {
                                return res.status(400).send("slots are not there");
                            }
                            const MbreakTime = slots === null || slots === void 0 ? void 0 : slots.Monday[0].breakTime;
                            const MStartbreakTime = MbreakTime.filter((_, i) => !(i % 2));
                            const MEndbreakTime = MbreakTime.filter((_, i) => (i % 2));
                            const MstartTime = slots === null || slots === void 0 ? void 0 : slots.Monday[0].startTime;
                            const MendTime = slots === null || slots === void 0 ? void 0 : slots.Monday[0].endTime;
                            const MallTime = [];
                            const MallendTime = [];
                            const Mstartti = slots === null || slots === void 0 ? void 0 : slots.Monday[0].startTime[0];
                            let Mall = [];
                            for (let i = 0; i < MstartTime.length; i++) {
                                const startt = moment_timezone_1.default.utc(MstartTime[i], "HH:mm");
                                const endt = moment_timezone_1.default.utc(MendTime[i], "HH:mm");
                                while (startt < endt) {
                                    Mall.push(startt.format("hh:mm A"));
                                    startt.add(30, 'minutes');
                                }
                            }
                            for (let i = 0; i < MStartbreakTime.length; i++) {
                                const startt = moment_timezone_1.default.utc(MStartbreakTime[i], "HH:mm");
                                const endt = moment_timezone_1.default.utc(MEndbreakTime[i], "HH:mm");
                                while (startt < endt) {
                                    MallendTime.push(startt.format("hh:mm A DD-MM-YYYY"));
                                    startt.add(30, 'minutes');
                                }
                            }
                            //console.log(allendTime)
                            const Mremovingslots = MallendTime.concat(allslots.flat());
                            Mall = Mall.filter((v) => !Mremovingslots.includes(v));
                            //console.log(Mall)
                            if (userDt === ptz) {
                                if (currentTime > Mstartti) {
                                    console.log("first");
                                    for (let i = 0; i < MstartTime.length; i++) {
                                        const startt = (0, moment_timezone_1.default)(MstartTime[i], "HH:mm");
                                        const endt = (0, moment_timezone_1.default)(MendTime[i], "HH:mm");
                                        while (startt < endt) {
                                            MallTime.push(startt.add(30, 'm').format("hh:mm A"));
                                        }
                                    }
                                    const h = (0, moment_timezone_1.default)(currentTime, 'HH:mm').format('HH');
                                    let m = (0, moment_timezone_1.default)(currentTime, 'HH:mm').format('mm');
                                    if (m >= '1' && m <= '29') {
                                        m = '00';
                                    }
                                    else if (m >= '31' && m <= '59') {
                                        m = '30';
                                    }
                                    const ti = `${h}:${m}`;
                                    const st = (0, moment_timezone_1.default)(ti, 'HH:mm');
                                    const startt = (0, moment_timezone_1.default)(Mstartti, "HH:mm");
                                    console.log(startt);
                                    const hello = [];
                                    while (startt < st) {
                                        hello.push(startt.add(30, 'minutes').format('hh:mm A'));
                                    }
                                    let hii = MallTime.filter((k) => !hello.includes(k));
                                    const removingslots = MallendTime.concat(allslots.flat());
                                    hii = hii.filter((v) => !removingslots.includes(v));
                                    if (hii.length === 0) {
                                        return res.status(400).json({
                                            status: false,
                                            message: "slots are not present"
                                        });
                                    }
                                    return res.status(200).json({
                                        message: "slots",
                                        result: hii
                                    });
                                }
                                else if (currentTime <= Mstartti) {
                                    console.log('else if');
                                    if (Mall.length === 0) {
                                        return res.status(400).json({
                                            status: false,
                                            message: "slot are not present"
                                        });
                                    }
                                    return res.status(200).json({
                                        message: "slots",
                                        result: Mall
                                    });
                                }
                            }
                            else {
                                console.log("else");
                                if (Mall.length === 0) {
                                    return res.status(400).json({
                                        status: false,
                                        message: "slot are not present"
                                    });
                                }
                                return res.status(200).json({
                                    message: "slots",
                                    result: Mall
                                });
                            }
                            break;
                        case "Tuesday":
                            console.log("tuesday");
                            if (!(slots === null || slots === void 0 ? void 0 : slots.Tuesday[0])) {
                                return res.status(400).send("slots are not there");
                            }
                            const TubreakTime = slots === null || slots === void 0 ? void 0 : slots.Tuesday[0].breakTime;
                            const TuStartbreakTime = TubreakTime.filter((_, i) => !(i % 2));
                            const TuEndbreakTime = TubreakTime.filter((_, i) => (i % 2));
                            const TustartTime = slots === null || slots === void 0 ? void 0 : slots.Tuesday[0].startTime;
                            const TuendTime = slots === null || slots === void 0 ? void 0 : slots.Tuesday[0].endTime;
                            const TuallTime = [];
                            const TuallendTime = [];
                            const Tustartti = slots === null || slots === void 0 ? void 0 : slots.Tuesday[0].startTime[0];
                            let Tuall = [];
                            for (let i = 0; i < TustartTime.length; i++) {
                                const startt = (0, moment_timezone_1.default)(TustartTime[i], "HH:mm");
                                const endt = (0, moment_timezone_1.default)(TuendTime[i], "HH:mm");
                                while (startt < endt) {
                                    Tuall.push(startt.format("hh:mm A"));
                                    startt.add(30, 'minutes');
                                }
                            }
                            for (let i = 0; i < TuStartbreakTime.length; i++) {
                                const startt = (0, moment_timezone_1.default)(TuStartbreakTime[i], "HH:mm");
                                const endt = (0, moment_timezone_1.default)(TuEndbreakTime[i], "HH:mm");
                                while (startt < endt) {
                                    TuallendTime.push(startt.format("hh:mm A"));
                                    startt.add(30, 'minutes');
                                }
                            }
                            // console.log(TuallendTime)
                            const Turemovingslots = TuallendTime.concat(allslots.flat());
                            Tuall = Tuall.filter((v) => !Turemovingslots.includes(v));
                            if (userDt === ptz) {
                                if (currentTime > Tustartti) {
                                    console.log("first");
                                    for (let i = 0; i < TustartTime.length; i++) {
                                        const startt = (0, moment_timezone_1.default)(TustartTime[i], "HH:mm");
                                        const endt = (0, moment_timezone_1.default)(TuendTime[i], "HH:mm");
                                        while (startt < endt) {
                                            TuallTime.push(startt.add(30, 'm').format("hh:mm A"));
                                        }
                                    }
                                    // let AFallTime = TuallTime.filter(v => !Tuall.includes(v))
                                    const h = (0, moment_timezone_1.default)(currentTime, 'HH:mm').format('HH');
                                    let m = (0, moment_timezone_1.default)(currentTime, 'HH:mm').format('mm');
                                    if (m >= '1' && m <= '29') {
                                        m = '00';
                                    }
                                    else if (m >= '31' && m <= '59') {
                                        m = '30';
                                    }
                                    const ti = `${h}:${m}`;
                                    const st = (0, moment_timezone_1.default)(ti, 'HH:mm');
                                    const startt = (0, moment_timezone_1.default)(Tustartti, "HH:mm");
                                    console.log(startt);
                                    const hello = [];
                                    while (startt < st) {
                                        hello.push(startt.add(30, 'minutes').format('hh:mm A'));
                                    }
                                    let hii = TuallTime.filter((k) => !hello.includes(k));
                                    const removingslots = TuallendTime.concat(allslots.flat());
                                    console.log(removingslots);
                                    hii = hii.filter((v) => !removingslots.includes(v));
                                    hii.shift();
                                    if (hii.length === 0) {
                                        return res.status(400).json({
                                            status: false,
                                            message: "slots are not present"
                                        });
                                    }
                                    return res.status(200).json({
                                        message: "slots",
                                        result: hii
                                    });
                                }
                                else if (currentTime <= Tustartti) {
                                    console.log('else if');
                                    if (Tuall.length === 0) {
                                        return res.status(400).json({
                                            status: false,
                                            message: "slot are not present"
                                        });
                                    }
                                    return res.status(200).json({
                                        message: "slots",
                                        result: Tuall
                                    });
                                }
                            }
                            else {
                                console.log("else");
                                if (Tuall.length === 0) {
                                    return res.status(400).json({
                                        status: false,
                                        message: "slot are not present"
                                    });
                                }
                                return res.status(200).json({
                                    message: "slots",
                                    result: Tuall
                                });
                            }
                            break;
                        case "Wednesday":
                            console.log(" This is wednesday");
                            if (!(slots === null || slots === void 0 ? void 0 : slots.Wednesday[0])) {
                                return res.status(400).send("slots are not there");
                            }
                            const WbreakTime = slots === null || slots === void 0 ? void 0 : slots.Wednesday[0].breakTime;
                            const WStartbreakTime = WbreakTime.filter((_, i) => !(i % 2));
                            const WEndbreakTime = WbreakTime.filter((_, i) => (i % 2));
                            const WstartTime = slots === null || slots === void 0 ? void 0 : slots.Wednesday[0].startTime;
                            const WendTime = slots === null || slots === void 0 ? void 0 : slots.Wednesday[0].endTime;
                            const WallTime = [];
                            const WallendTime = [];
                            const Wstartti = slots === null || slots === void 0 ? void 0 : slots.Wednesday[0].startTime[0];
                            console.log(Wstartti);
                            let Wall = [];
                            for (let i = 0; i < WstartTime.length; i++) {
                                const startt = (0, moment_timezone_1.default)(WstartTime[i], "HH:mm");
                                const endt = (0, moment_timezone_1.default)(WendTime[i], "HH:mm");
                                while (startt < endt) {
                                    Wall.push(startt.format("hh:mm A"));
                                    startt.add(30, 'minutes');
                                }
                            }
                            for (let i = 0; i < WStartbreakTime.length; i++) {
                                const startt = (0, moment_timezone_1.default)(WStartbreakTime[i], "HH:mm");
                                const endt = (0, moment_timezone_1.default)(WEndbreakTime[i], "HH:mm");
                                while (startt < endt) {
                                    WallendTime.push(startt.format("hh:mm A"));
                                    startt.add(30, 'minutes');
                                }
                            }
                            //console.log(Wall)
                            const removingslots = WallendTime.concat(allslots.flat());
                            Wall = Wall.filter((v) => !removingslots.includes(v));
                            if (userDt === ptz) {
                                if (currentTime > Wstartti) {
                                    console.log("first");
                                    for (let i = 0; i < WstartTime.length; i++) {
                                        const startt = (0, moment_timezone_1.default)(WstartTime[i], "HH:mm");
                                        const endt = (0, moment_timezone_1.default)(WendTime[i], "HH:mm");
                                        while (startt < endt) {
                                            WallTime.push(startt.add(30, 'minutes').format('hh:mm A'));
                                        }
                                    }
                                    const h = (0, moment_timezone_1.default)(currentTime, 'HH:mm').format('HH');
                                    let m = (0, moment_timezone_1.default)(currentTime, 'HH:mm').format('mm');
                                    if (m >= '1' && m <= '29') {
                                        m = '00';
                                    }
                                    else if (m >= '31' && m <= '59') {
                                        m = '30';
                                    }
                                    const ti = `${h}:${m}`;
                                    const st = (0, moment_timezone_1.default)(ti, 'HH:mm');
                                    const startt = (0, moment_timezone_1.default)(Wstartti, "HH:mm");
                                    console.log(startt);
                                    const hello = [];
                                    while (startt < st) {
                                        hello.push(startt.add(30, 'minutes').format('hh:mm A'));
                                    }
                                    let hii = WallTime.filter((k) => !hello.includes(k));
                                    const removingslots = WallendTime.concat(allslots.flat());
                                    hii = hii.filter((v) => !removingslots.includes(v));
                                    if (hii.length === 0) {
                                        return res.status(400).json({
                                            status: false,
                                            message: "slota are not present"
                                        });
                                    }
                                    return res.status(200).json({
                                        message: "slots",
                                        result: hii
                                    });
                                }
                                else if (currentTime <= Wstartti) {
                                    console.log('else if');
                                    if (Wall.length === 0) {
                                        return res.status(400).json({
                                            status: false,
                                            message: "slota are not present"
                                        });
                                    }
                                    return res.status(200).json({
                                        message: "slots",
                                        result: Wall
                                    });
                                }
                            }
                            else {
                                console.log("else");
                                if (Wall.length === 0) {
                                    return res.status(400).json({
                                        status: false,
                                        message: "slota are not present"
                                    });
                                }
                                return res.status(200).json({
                                    message: "slots",
                                    result: Wall
                                });
                            }
                            break;
                        case "Thursday":
                            console.log("thursday");
                            if (!(slots === null || slots === void 0 ? void 0 : slots.Thursday[0])) {
                                return res.status(400).send("slots are not there");
                            }
                            const breakTime = slots === null || slots === void 0 ? void 0 : slots.Thursday[0].breakTime;
                            const StartbreakTime = breakTime.filter((_, i) => !(i % 2));
                            const EndbreakTime = breakTime.filter((_, i) => (i % 2));
                            const startTime = slots === null || slots === void 0 ? void 0 : slots.Thursday[0].startTime;
                            const endTime = slots === null || slots === void 0 ? void 0 : slots.Thursday[0].endTime;
                            const allTime = [];
                            const allendTime = [];
                            const startti = slots === null || slots === void 0 ? void 0 : slots.Thursday[0].startTime[0];
                            let Tall = [];
                            for (let i = 0; i < startTime.length; i++) {
                                const startt = moment_timezone_1.default.utc(startTime[i], "HH:mm");
                                const endt = moment_timezone_1.default.utc(endTime[i], "HH:mm");
                                while (startt < endt) {
                                    Tall.push(startt.format("HH:mm"));
                                    startt.utc().add(30, 'minutes');
                                }
                            }
                            for (let i = 0; i < StartbreakTime.length; i++) {
                                const startt = moment_timezone_1.default.utc(StartbreakTime[i], "HH:mm");
                                const endt = moment_timezone_1.default.utc(EndbreakTime[i], "HH:mm");
                                while (startt < endt) {
                                    allendTime.push(startt.format("HH:mm"));
                                    startt.utc().add(30, 'minutes');
                                }
                            }
                            //console.log(allendTime)
                            const thremovingslots = allendTime.concat(allslots.flat());
                            Tall = Tall.filter((v) => !thremovingslots.includes(v));
                            if (userDt === ptz) {
                                if (currentTime > startti) {
                                    console.log("first");
                                    for (let i = 0; i < startTime.length; i++) {
                                        const startt = moment_timezone_1.default.utc(startTime[i], "HH:mm");
                                        const endt = moment_timezone_1.default.utc(endTime[i], "HH:mm");
                                        while (startt < endt) {
                                            allTime.push(startt.add(30, 'm').format("HH:mm"));
                                        }
                                    }
                                    const h = moment_timezone_1.default.utc(currentTime, 'HH:mm').format('HH');
                                    let m = moment_timezone_1.default.utc(currentTime, 'HH:mm').format('mm');
                                    if (m >= '1' && m <= '29') {
                                        m = '00';
                                    }
                                    else if (m >= '31' && m <= '59') {
                                        m = '30';
                                    }
                                    const ti = `${h}:${m}`;
                                    const st = moment_timezone_1.default.utc(ti, 'HH:mm');
                                    const startt = moment_timezone_1.default.utc(startti, "HH:mm");
                                    console.log(startt);
                                    const hello = [];
                                    while (startt < st) {
                                        hello.push(startt.add(30, 'minutes').format('hh:mm'));
                                    }
                                    let hii = allTime.filter((k) => !hello.includes(k));
                                    const removingslots = allendTime.concat(allslots.flat(), EndbreakTime.flat());
                                    //console.log(removingslots)
                                    hii = hii.filter((v) => !removingslots.includes(v));
                                    hii.shift();
                                    if (hii.length === 0) {
                                        return res.status(400).json({
                                            status: false,
                                            message: "slota are not present"
                                        });
                                    }
                                    return res.status(200).json({
                                        message: "slots",
                                        result: hii
                                    });
                                }
                                else if (currentTime <= startti) {
                                    console.log("else if");
                                    if (Tall.length === 0) {
                                        return res.status(400).json({
                                            status: false,
                                            message: "slot are not present"
                                        });
                                    }
                                    return res.status(200).json({
                                        message: "slots",
                                        result: Tall
                                    });
                                }
                            }
                            else {
                                console.log('elif');
                                if (Tall.length === 0) {
                                    return res.status(400).json({
                                        status: false,
                                        message: "slot are not present"
                                    });
                                }
                                return res.status(200).json({
                                    message: "slots",
                                    result: Tall
                                });
                            }
                            break;
                        case "Friday":
                            console.log("friday");
                            if (!(slots === null || slots === void 0 ? void 0 : slots.Friday[0])) {
                                return res.status(400).send("slots are not there");
                            }
                            const FbreakTime = slots === null || slots === void 0 ? void 0 : slots.Friday[0].breakTime;
                            const FStartbreakTime = FbreakTime.filter((_, i) => !(i % 2));
                            const FEndbreakTime = FbreakTime.filter((_, i) => (i % 2));
                            const FstartTime = slots === null || slots === void 0 ? void 0 : slots.Friday[0].startTime;
                            const FendTime = slots === null || slots === void 0 ? void 0 : slots.Friday[0].endTime;
                            const FallTime = [];
                            const FallendTime = [];
                            const Fstartti = slots === null || slots === void 0 ? void 0 : slots.Friday[0].startTime[0];
                            console.log(Fstartti);
                            let all = [];
                            for (let i = 0; i < FstartTime.length; i++) {
                                const startt = (0, moment_timezone_1.default)(FstartTime[i], "HH:mm");
                                const endt = (0, moment_timezone_1.default)(FendTime[i], "HH:mm");
                                while (startt < endt) {
                                    all.push(startt.format("hh:mm A"));
                                    startt.add(30, 'minutes');
                                }
                            }
                            for (let i = 0; i < FStartbreakTime.length; i++) {
                                const startt = (0, moment_timezone_1.default)(FStartbreakTime[i], "HH:mm");
                                const endt = (0, moment_timezone_1.default)(FEndbreakTime[i], "HH:mm");
                                while (startt < endt) {
                                    FallendTime.push(startt.format("hh:mm A"));
                                    startt.add(30, 'minutes');
                                }
                            }
                            //console.log(allendTime)
                            const Faremovingslots = FallendTime.concat(allslots.flat());
                            //console.log(removingslots)
                            all = all.filter((v) => !Faremovingslots.includes(v));
                            if (userDt === ptz) {
                                if (currentTime > Fstartti) {
                                    console.log("first");
                                    for (let i = 0; i < FstartTime.length; i++) {
                                        const startt = (0, moment_timezone_1.default)(FstartTime[i], "HH:mm");
                                        const endt = (0, moment_timezone_1.default)(FendTime[i], "HH:mm");
                                        while (startt < endt) {
                                            FallTime.push(startt.format("hh:mm A"));
                                            startt.add(30, 'm');
                                        }
                                    }
                                    const h = (0, moment_timezone_1.default)(currentTime, 'HH:mm').format('HH');
                                    let m = (0, moment_timezone_1.default)(currentTime, 'HH:mm').format('mm');
                                    if (m >= '1' && m <= '29') {
                                        m = '00';
                                    }
                                    else if (m >= '31' && m <= '59') {
                                        m = '30';
                                    }
                                    const ti = `${h}:${m}`;
                                    const st = (0, moment_timezone_1.default)(ti, 'HH:mm');
                                    const startt = (0, moment_timezone_1.default)(Fstartti, "HH:mm");
                                    console.log(startt);
                                    const hello = [];
                                    while (startt < st) {
                                        hello.push(startt.add(30, 'minutes').format('hh:mm A'));
                                    }
                                    let hii = FallTime.filter((k) => !hello.includes(k));
                                    // let AFallTime = FallTime.filter(v => !all.includes(v))
                                    const removingslots = FallendTime.concat(allslots.flat());
                                    //console.log(removingslots)
                                    hii = hii.filter((v) => !removingslots.includes(v));
                                    hii.shift();
                                    if (hii.length === 0) {
                                        return res.status(400).json({
                                            status: false,
                                            message: "slota are not present"
                                        });
                                    }
                                    return res.status(200).json({
                                        message: "slots",
                                        result: hii
                                    });
                                }
                                else if (currentTime <= Fstartti) {
                                    console.log('else if');
                                    if (all.length === 0) {
                                        return res.status(400).json({
                                            status: false,
                                            message: "slot are not present"
                                        });
                                    }
                                    return res.status(200).json({
                                        message: "slots",
                                        result: all
                                    });
                                }
                            }
                            else {
                                console.log("else");
                                if (all.length === 0) {
                                    return res.status(400).json({
                                        status: false,
                                        message: "slot are not present"
                                    });
                                }
                                return res.status(200).json({
                                    message: "slots",
                                    result: all
                                });
                            }
                            break;
                        case "Saturday":
                            console.log("saturday");
                            if (!(slots === null || slots === void 0 ? void 0 : slots.Saturday[0])) {
                                return res.status(400).send("slots are not there");
                            }
                            const SbreakTime = slots === null || slots === void 0 ? void 0 : slots.Saturday[0].breakTime;
                            const SStartbreakTime = SbreakTime.filter((_, i) => !(i % 2));
                            console.log("rii");
                            const SEndbreakTime = SbreakTime.filter((_, i) => (i % 2));
                            const SstartTime = slots === null || slots === void 0 ? void 0 : slots.Saturday[0].startTime;
                            const SendTime = slots === null || slots === void 0 ? void 0 : slots.Saturday[0].endTime;
                            const SallTime = [];
                            const SallendTime = [];
                            const Sstartti = slots === null || slots === void 0 ? void 0 : slots.Saturday[0].startTime[0];
                            console.log(Sstartti);
                            let Sall = [];
                            for (let i = 0; i < SstartTime.length; i++) {
                                const startt = (0, moment_timezone_1.default)(SstartTime[i], "HH:mm");
                                const endt = (0, moment_timezone_1.default)(SendTime[i], "HH:mm");
                                while (startt < endt) {
                                    Sall.push(startt.format("hh:mm A"));
                                    startt.add(30, 'minutes');
                                }
                            }
                            for (let i = 0; i < SStartbreakTime.length; i++) {
                                const startt = (0, moment_timezone_1.default)(SStartbreakTime[i], "HH:mm");
                                const endt = (0, moment_timezone_1.default)(SEndbreakTime[i], "HH:mm");
                                while (startt < endt) {
                                    SallendTime.push(startt.format("hh:mm A"));
                                    startt.add(30, 'minutes');
                                }
                            }
                            //console.log(allendTime)
                            const saremovingslots = SallendTime.concat(allslots.flat());
                            Sall = Sall.filter((v) => !saremovingslots.includes(v));
                            if (userDt === ptz) {
                                if (currentTime > Sstartti) {
                                    console.log("first");
                                    for (let i = 0; i < SstartTime.length; i++) {
                                        const startt = (0, moment_timezone_1.default)(SstartTime[i], "HH:mm");
                                        const endt = (0, moment_timezone_1.default)(SendTime[i], "HH:mm");
                                        while (startt < endt) {
                                            SallTime.push(startt.format("hh:mm A"));
                                            startt.add(30, 'minutes');
                                        }
                                    }
                                    const h = (0, moment_timezone_1.default)(currentTime, 'HH:mm').format('HH');
                                    let m = (0, moment_timezone_1.default)(currentTime, 'HH:mm').format('mm');
                                    if (m >= '1' && m <= '29') {
                                        m = '00';
                                    }
                                    else if (m >= '31' && m <= '59') {
                                        m = '30';
                                    }
                                    const ti = `${h}:${m}`;
                                    const st = (0, moment_timezone_1.default)(ti, 'HH:mm');
                                    const startt = (0, moment_timezone_1.default)(Sstartti, "HH:mm");
                                    console.log(startt);
                                    const hello = [];
                                    while (startt < st) {
                                        hello.push(startt.add(30, 'minutes').format('hh:mm A'));
                                    }
                                    let hii = SallTime.filter((k) => !hello.includes(k));
                                    const removingslots = FallendTime.concat(allslots.flat());
                                    //console.log(removingslots)
                                    hii = hii.filter((v) => !removingslots.includes(v));
                                    hii.shift();
                                    if (SallTime.length === 0) {
                                        return res.status(400).json({
                                            status: false,
                                            message: "slota are not present"
                                        });
                                    }
                                    return res.status(200).json({
                                        message: "slots",
                                        result: hii
                                    });
                                }
                                else if (currentTime <= Sstartti) {
                                    console.log('else if');
                                    if (Sall.length === 0) {
                                        return res.status(400).json({
                                            status: false,
                                            message: "slot are not present"
                                        });
                                    }
                                    return res.status(200).json({
                                        message: "slots",
                                        result: Sall
                                    });
                                }
                            }
                            else {
                                console.log("else");
                                if (Sall.length === 0) {
                                    return res.status(400).json({
                                        status: false,
                                        message: "slot are not present"
                                    });
                                }
                                return res.status(200).json({
                                    message: "slots",
                                    result: Sall
                                });
                            }
                            break;
                        case "Sunday":
                            if (!(slots === null || slots === void 0 ? void 0 : slots.Sunday[0])) {
                                return res.status(400).send("slots are not there");
                            }
                            const SnbreakTime = slots === null || slots === void 0 ? void 0 : slots.Sunday[0].breakTime;
                            const SnStartbreakTime = SnbreakTime.filter((_, i) => !(i % 2));
                            console.log("rii");
                            const SnEndbreakTime = SnbreakTime.filter((_, i) => (i % 2));
                            const SnstartTime = slots === null || slots === void 0 ? void 0 : slots.Saturday[0].startTime;
                            const SnendTime = slots === null || slots === void 0 ? void 0 : slots.Saturday[0].endTime;
                            const SnallTime = [];
                            const SnallendTime = [];
                            const Snstartti = slots === null || slots === void 0 ? void 0 : slots.Saturday[0].startTime[0];
                            let Snall = [];
                            for (let i = 0; i < SnstartTime.length; i++) {
                                const startt = (0, moment_timezone_1.default)(SnstartTime[i], "HH:mm");
                                const endt = (0, moment_timezone_1.default)(SnendTime[i], "HH:mm");
                                while (startt < endt) {
                                    Snall.push(startt.format("hh:mm A"));
                                    startt.add(30, 'minutes');
                                }
                            }
                            for (let i = 0; i < SnStartbreakTime.length; i++) {
                                const startt = (0, moment_timezone_1.default)(SnStartbreakTime[i], "HH:mm");
                                const endt = (0, moment_timezone_1.default)(SnEndbreakTime[i], "HH:mm");
                                while (startt < endt) {
                                    SnallendTime.push(startt.format("hh:mm A"));
                                    startt.add(30, 'minutes');
                                }
                            }
                            //console.log(allendTime)
                            const Snremovingslots = SnallendTime.concat(allslots.flat());
                            Snall = Snall.filter((v) => !Snremovingslots.includes(v));
                            if (userDt === ptz) {
                                if (currentTime > Snstartti) {
                                    console.log("first");
                                    for (let i = 0; i < SnstartTime.length; i++) {
                                        const startt = (0, moment_timezone_1.default)(SnstartTime[i], "HH:mm");
                                        const endt = (0, moment_timezone_1.default)(SnendTime[i], "HH:mm");
                                        while (startt < endt) {
                                            SnallTime.push(startt.format("hh:mm A"));
                                            startt.add(30, 'minutes');
                                        }
                                    }
                                    const h = (0, moment_timezone_1.default)(currentTime, 'HH:mm').format('HH');
                                    let m = (0, moment_timezone_1.default)(currentTime, 'HH:mm').format('mm');
                                    if (m >= '1' && m <= '29') {
                                        m = '00';
                                    }
                                    else if (m >= '31' && m <= '59') {
                                        m = '30';
                                    }
                                    const ti = `${h}:${m}`;
                                    const st = (0, moment_timezone_1.default)(ti, 'HH:mm');
                                    const startt = (0, moment_timezone_1.default)(Snstartti, "HH:mm");
                                    console.log(startt);
                                    const hello = [];
                                    while (startt < st) {
                                        hello.push(startt.add(30, 'minutes').format('hh:mm A'));
                                    }
                                    let hii = SnallTime.filter((k) => !hello.includes(k));
                                    // console.log(SnallTime)
                                    // let AFallTime = SnallTime.filter(v => !all.includes(v))
                                    // console.log(AFallTime)
                                    const removingslots = SnallendTime.concat(allslots.flat());
                                    //console.log(removingslots)
                                    hii = hii.filter(v => !removingslots.includes(v));
                                    hii.shift();
                                    if (hii.length === 0) {
                                        return res.status(400).json({
                                            status: false,
                                            message: "slots are not present"
                                        });
                                    }
                                    return res.status(200).json({
                                        message: "slots",
                                        result: SnallTime
                                    });
                                }
                                else if (currentTime <= Snstartti) {
                                    console.log('else if');
                                    //SnallTime = SnallTime.filter(v => !SnallendTime.includes(v))
                                    if (Snall.length === 0) {
                                        return res.status(400).json({
                                            status: false,
                                            message: "slot are not present"
                                        });
                                    }
                                    return res.status(200).json({
                                        message: "slots",
                                        result: Snall
                                    });
                                }
                            }
                            else {
                                console.log("else");
                                if (Snall.length === 0) {
                                    return res.status(400).json({
                                        status: false,
                                        message: "slot are not present"
                                    });
                                }
                                return res.status(200).json({
                                    message: "slots",
                                    result: Snall
                                });
                            }
                            console.log("sunday");
                            break;
                    }
                }
                else {
                    return res.status(400).json({
                        message: "slots are not present daa"
                    });
                }
            }
            else {
                return res.status(400).json({
                    message: "slots are not present"
                });
            }
        }
        else {
            return res.status(400).json({
                message: "slots are not present d"
            });
        }
    }
    catch (error) {
        res.status(400).send("Internal Server Error");
        console.log(error);
    }
});
exports.GetAppointment = GetAppointment;
