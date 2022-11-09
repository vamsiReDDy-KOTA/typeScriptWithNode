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
        let date = req.query.date;
        //let da = await DaysModel.findOne({ email: req.query.email })
        let slots = yield days_1.default.findOne({ email: req.query.email });
        let timeZn = slots === null || slots === void 0 ? void 0 : slots.TimeZone;
        let da = slots === null || slots === void 0 ? void 0 : slots.repectForWeek;
        let va = (0, moment_timezone_1.default)().startOf('isoWeek').add(1, da).format("DD-MM-YYYY");
        let ptz = (0, moment_timezone_1.default)(date).format('DD-MM-YYYY');
        let userDt = (0, moment_timezone_1.default)().tz(timeZn).format("DD-MM-YYYY");
        console.log(userDt);
        let userEnteredDt = (0, moment_timezone_1.default)(date).format("YYYY-MM-DD");
        let userEnteredDay = (0, moment_timezone_1.default)(userEnteredDt).format('dddd');
        let currentTime = (0, moment_timezone_1.default)().tz(timeZn).format('HH:mm');
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
        if (userDt <= ptz) {
            if (ptz < va) {
                const slot = yield bookingModel_1.default.find({ AppointmentDate: userEnteredDt, email: req.query.email }, { "SlotsTime": "$SlotsTime" });
                console.log(slot);
                let allslots = [];
                for (let i = 0; i < slot.length; i++) {
                    allslots.push(slot[i].SlotsTime);
                }
                switch (userEnteredDay) {
                    case "Monday":
                        if (!(slots === null || slots === void 0 ? void 0 : slots.Monday[0])) {
                            return res.status(400).send("slots are not there");
                        }
                        let MbreakTime = slots === null || slots === void 0 ? void 0 : slots.Monday[0].breakTime;
                        let MStartbreakTime = MbreakTime.filter((_, i) => !(i % 2));
                        let MEndbreakTime = MbreakTime.filter((_, i) => (i % 2));
                        let MstartTime = slots === null || slots === void 0 ? void 0 : slots.Monday[0].startTime;
                        let MendTime = slots === null || slots === void 0 ? void 0 : slots.Monday[0].endTime;
                        let MallTime = [];
                        let MallendTime = [];
                        let Mstartti = slots === null || slots === void 0 ? void 0 : slots.Monday[0].startTime[0];
                        let Mall = [];
                        for (let i = 0; i < MstartTime.length; i++) {
                            let startt = (0, moment_timezone_1.default)(MstartTime[i], "HH:mm");
                            let endt = (0, moment_timezone_1.default)(MendTime[i], "HH:mm");
                            while (startt < endt) {
                                Mall.push(startt.format("hh:mm A"));
                                startt.add(30, 'minutes');
                            }
                        }
                        for (let i = 0; i < MStartbreakTime.length; i++) {
                            let startt = (0, moment_timezone_1.default)(MStartbreakTime[i], "HH:mm");
                            let endt = (0, moment_timezone_1.default)(MEndbreakTime[i], "HH:mm");
                            while (startt < endt) {
                                MallendTime.push(startt.format("hh:mm A DD-MM-YYYY"));
                                startt.add(30, 'minutes');
                            }
                        }
                        //console.log(allendTime)
                        let Mremovingslots = MallendTime.concat(allslots.flat());
                        Mall = Mall.filter((v) => !Mremovingslots.includes(v));
                        //console.log(Mall)
                        if (userDt === ptz) {
                            if (currentTime > Mstartti) {
                                console.log("first");
                                for (let i = 0; i < MstartTime.length; i++) {
                                    let startt = (0, moment_timezone_1.default)(MstartTime[i], "HH:mm");
                                    let endt = (0, moment_timezone_1.default)(MendTime[i], "HH:mm");
                                    while (startt < endt) {
                                        MallTime.push(startt.add(30, 'm').format("hh:mm A"));
                                    }
                                }
                                let h = (0, moment_timezone_1.default)(currentTime, 'HH:mm').format('HH');
                                let m = (0, moment_timezone_1.default)(currentTime, 'HH:mm').format('mm');
                                if (m >= '1' && m <= '29') {
                                    m = '00';
                                }
                                else if (m >= '31' && m <= '59') {
                                    m = '30';
                                }
                                let ti = `${h}:${m}`;
                                let st = (0, moment_timezone_1.default)(ti, 'HH:mm');
                                let startt = (0, moment_timezone_1.default)(Mstartti, "HH:mm");
                                console.log(startt);
                                let hello = [];
                                while (startt < st) {
                                    hello.push(startt.add(30, 'minutes').format('hh:mm A'));
                                }
                                let hii = MallTime.filter((k) => !hello.includes(k));
                                let removingslots = MallendTime.concat(allslots.flat());
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
                        let TubreakTime = slots === null || slots === void 0 ? void 0 : slots.Tuesday[0].breakTime;
                        let TuStartbreakTime = TubreakTime.filter((_, i) => !(i % 2));
                        let TuEndbreakTime = TubreakTime.filter((_, i) => (i % 2));
                        let TustartTime = slots === null || slots === void 0 ? void 0 : slots.Tuesday[0].startTime;
                        let TuendTime = slots === null || slots === void 0 ? void 0 : slots.Tuesday[0].endTime;
                        let TuallTime = [];
                        let TuallendTime = [];
                        let Tustartti = slots === null || slots === void 0 ? void 0 : slots.Tuesday[0].startTime[0];
                        let Tuall = [];
                        for (let i = 0; i < TustartTime.length; i++) {
                            let startt = (0, moment_timezone_1.default)(TustartTime[i], "HH:mm");
                            let endt = (0, moment_timezone_1.default)(TuendTime[i], "HH:mm");
                            while (startt < endt) {
                                Tuall.push(startt.format("hh:mm A"));
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
                        // console.log(TuallendTime)
                        let Turemovingslots = TuallendTime.concat(allslots.flat());
                        Tuall = Tuall.filter((v) => !Turemovingslots.includes(v));
                        if (userDt === ptz) {
                            if (currentTime > Tustartti) {
                                console.log("first");
                                for (let i = 0; i < TustartTime.length; i++) {
                                    let startt = (0, moment_timezone_1.default)(TustartTime[i], "HH:mm");
                                    let endt = (0, moment_timezone_1.default)(TuendTime[i], "HH:mm");
                                    while (startt < endt) {
                                        TuallTime.push(startt.add(30, 'm').format("hh:mm A"));
                                    }
                                }
                                // let AFallTime = TuallTime.filter(v => !Tuall.includes(v))
                                let h = (0, moment_timezone_1.default)(currentTime, 'HH:mm').format('HH');
                                let m = (0, moment_timezone_1.default)(currentTime, 'HH:mm').format('mm');
                                if (m >= '1' && m <= '29') {
                                    m = '00';
                                }
                                else if (m >= '31' && m <= '59') {
                                    m = '30';
                                }
                                let ti = `${h}:${m}`;
                                let st = (0, moment_timezone_1.default)(ti, 'HH:mm');
                                let startt = (0, moment_timezone_1.default)(Tustartti, "HH:mm");
                                console.log(startt);
                                let hello = [];
                                while (startt < st) {
                                    hello.push(startt.add(30, 'minutes').format('hh:mm A'));
                                }
                                let hii = TuallTime.filter((k) => !hello.includes(k));
                                let removingslots = TuallendTime.concat(allslots.flat());
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
                        let WbreakTime = slots === null || slots === void 0 ? void 0 : slots.Wednesday[0].breakTime;
                        let WStartbreakTime = WbreakTime.filter((_, i) => !(i % 2));
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
                        for (let i = 0; i < WStartbreakTime.length; i++) {
                            let startt = (0, moment_timezone_1.default)(WStartbreakTime[i], "HH:mm");
                            let endt = (0, moment_timezone_1.default)(WEndbreakTime[i], "HH:mm");
                            while (startt < endt) {
                                WallendTime.push(startt.format("hh:mm A"));
                                startt.add(30, 'minutes');
                            }
                        }
                        //console.log(Wall)
                        let removingslots = WallendTime.concat(allslots.flat());
                        Wall = Wall.filter((v) => !removingslots.includes(v));
                        if (userDt === ptz) {
                            if (currentTime > Wstartti) {
                                console.log("first");
                                for (let i = 0; i < WstartTime.length; i++) {
                                    let startt = (0, moment_timezone_1.default)(WstartTime[i], "HH:mm");
                                    let endt = (0, moment_timezone_1.default)(WendTime[i], "HH:mm");
                                    while (startt < endt) {
                                        WallTime.push(startt.add(30, 'minutes').format('hh:mm A'));
                                    }
                                }
                                let h = (0, moment_timezone_1.default)(currentTime, 'HH:mm').format('HH');
                                let m = (0, moment_timezone_1.default)(currentTime, 'HH:mm').format('mm');
                                if (m >= '1' && m <= '29') {
                                    m = '00';
                                }
                                else if (m >= '31' && m <= '59') {
                                    m = '30';
                                }
                                let ti = `${h}:${m}`;
                                let st = (0, moment_timezone_1.default)(ti, 'HH:mm');
                                let startt = (0, moment_timezone_1.default)(Wstartti, "HH:mm");
                                console.log(startt);
                                let hello = [];
                                while (startt < st) {
                                    hello.push(startt.add(30, 'minutes').format('hh:mm A'));
                                }
                                let hii = WallTime.filter((k) => !hello.includes(k));
                                let removingslots = WallendTime.concat(allslots.flat());
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
                        for (let i = 0; i < StartbreakTime.length; i++) {
                            let startt = (0, moment_timezone_1.default)(StartbreakTime[i], "HH:mm");
                            let endt = (0, moment_timezone_1.default)(EndbreakTime[i], "HH:mm");
                            while (startt < endt) {
                                allendTime.push(startt.format("hh:mm A"));
                                startt.add(30, 'minutes');
                            }
                        }
                        //console.log(allendTime)
                        let thremovingslots = allendTime.concat(allslots.flat());
                        Tall = Tall.filter((v) => !thremovingslots.includes(v));
                        if (userDt === ptz) {
                            if (currentTime > startti) {
                                console.log("first");
                                for (let i = 0; i < startTime.length; i++) {
                                    let startt = (0, moment_timezone_1.default)(startTime[i], "HH:mm");
                                    let endt = (0, moment_timezone_1.default)(endTime[i], "HH:mm");
                                    while (startt < endt) {
                                        allTime.push(startt.add(30, 'm').format("hh:mm A"));
                                    }
                                }
                                let h = (0, moment_timezone_1.default)(currentTime, 'HH:mm').format('HH');
                                let m = (0, moment_timezone_1.default)(currentTime, 'HH:mm').format('mm');
                                if (m >= '1' && m <= '29') {
                                    m = '00';
                                }
                                else if (m >= '31' && m <= '59') {
                                    m = '30';
                                }
                                let ti = `${h}:${m}`;
                                let st = (0, moment_timezone_1.default)(ti, 'HH:mm');
                                let startt = (0, moment_timezone_1.default)(startti, "HH:mm");
                                console.log(startt);
                                let hello = [];
                                while (startt < st) {
                                    hello.push(startt.add(30, 'minutes').format('hh:mm A'));
                                }
                                let hii = allTime.filter((k) => !hello.includes(k));
                                let removingslots = allendTime.concat(allslots.flat(), EndbreakTime.flat());
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
                        for (let i = 0; i < FStartbreakTime.length; i++) {
                            let startt = (0, moment_timezone_1.default)(FStartbreakTime[i], "HH:mm");
                            let endt = (0, moment_timezone_1.default)(FEndbreakTime[i], "HH:mm");
                            while (startt < endt) {
                                FallendTime.push(startt.format("hh:mm A"));
                                startt.add(30, 'minutes');
                            }
                        }
                        //console.log(allendTime)
                        let Faremovingslots = FallendTime.concat(allslots.flat());
                        //console.log(removingslots)
                        all = all.filter((v) => !Faremovingslots.includes(v));
                        if (userDt === ptz) {
                            if (currentTime > Fstartti) {
                                console.log("first");
                                for (let i = 0; i < FstartTime.length; i++) {
                                    let startt = (0, moment_timezone_1.default)(FstartTime[i], "HH:mm");
                                    let endt = (0, moment_timezone_1.default)(FendTime[i], "HH:mm");
                                    while (startt < endt) {
                                        FallTime.push(startt.format("hh:mm A"));
                                        startt.add(30, 'm');
                                    }
                                }
                                let h = (0, moment_timezone_1.default)(currentTime, 'HH:mm').format('HH');
                                let m = (0, moment_timezone_1.default)(currentTime, 'HH:mm').format('mm');
                                if (m >= '1' && m <= '29') {
                                    m = '00';
                                }
                                else if (m >= '31' && m <= '59') {
                                    m = '30';
                                }
                                let ti = `${h}:${m}`;
                                let st = (0, moment_timezone_1.default)(ti, 'HH:mm');
                                let startt = (0, moment_timezone_1.default)(Fstartti, "HH:mm");
                                console.log(startt);
                                let hello = [];
                                while (startt < st) {
                                    hello.push(startt.add(30, 'minutes').format('hh:mm A'));
                                }
                                let hii = FallTime.filter((k) => !hello.includes(k));
                                // let AFallTime = FallTime.filter(v => !all.includes(v))
                                let removingslots = FallendTime.concat(allslots.flat());
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
                        for (let i = 0; i < SStartbreakTime.length; i++) {
                            let startt = (0, moment_timezone_1.default)(SStartbreakTime[i], "HH:mm");
                            let endt = (0, moment_timezone_1.default)(SEndbreakTime[i], "HH:mm");
                            while (startt < endt) {
                                SallendTime.push(startt.format("hh:mm A"));
                                startt.add(30, 'minutes');
                            }
                        }
                        //console.log(allendTime)
                        let saremovingslots = SallendTime.concat(allslots.flat());
                        console.log(removingslots);
                        Sall = Sall.filter((v) => !saremovingslots.includes(v));
                        if (userDt === ptz) {
                            if (currentTime > Sstartti) {
                                console.log("first");
                                for (let i = 0; i < SstartTime.length; i++) {
                                    let startt = (0, moment_timezone_1.default)(SstartTime[i], "HH:mm");
                                    let endt = (0, moment_timezone_1.default)(SendTime[i], "HH:mm");
                                    while (startt < endt) {
                                        SallTime.push(startt.format("hh:mm A"));
                                        startt.add(30, 'minutes');
                                    }
                                }
                                let h = (0, moment_timezone_1.default)(currentTime, 'HH:mm').format('HH');
                                let m = (0, moment_timezone_1.default)(currentTime, 'HH:mm').format('mm');
                                if (m >= '1' && m <= '29') {
                                    m = '00';
                                }
                                else if (m >= '31' && m <= '59') {
                                    m = '30';
                                }
                                let ti = `${h}:${m}`;
                                let st = (0, moment_timezone_1.default)(ti, 'HH:mm');
                                let startt = (0, moment_timezone_1.default)(Sstartti, "HH:mm");
                                console.log(startt);
                                let hello = [];
                                while (startt < st) {
                                    hello.push(startt.add(30, 'minutes').format('hh:mm A'));
                                }
                                let hii = SallTime.filter((k) => !hello.includes(k));
                                let removingslots = FallendTime.concat(allslots.flat());
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
                        for (let i = 0; i < SnStartbreakTime.length; i++) {
                            let startt = (0, moment_timezone_1.default)(SnStartbreakTime[i], "HH:mm");
                            let endt = (0, moment_timezone_1.default)(SnEndbreakTime[i], "HH:mm");
                            while (startt < endt) {
                                SnallendTime.push(startt.format("hh:mm A"));
                                startt.add(30, 'minutes');
                            }
                        }
                        //console.log(allendTime)
                        let Snremovingslots = SnallendTime.concat(allslots.flat());
                        Snall = Snall.filter((v) => !Snremovingslots.includes(v));
                        if (userDt === ptz) {
                            if (currentTime > Snstartti) {
                                console.log("first");
                                for (let i = 0; i < SnstartTime.length; i++) {
                                    let startt = (0, moment_timezone_1.default)(SnstartTime[i], "HH:mm");
                                    let endt = (0, moment_timezone_1.default)(SnendTime[i], "HH:mm");
                                    while (startt < endt) {
                                        SnallTime.push(startt.format("hh:mm A"));
                                        startt.add(30, 'minutes');
                                    }
                                }
                                let h = (0, moment_timezone_1.default)(currentTime, 'HH:mm').format('HH');
                                let m = (0, moment_timezone_1.default)(currentTime, 'HH:mm').format('mm');
                                if (m >= '1' && m <= '29') {
                                    m = '00';
                                }
                                else if (m >= '31' && m <= '59') {
                                    m = '30';
                                }
                                let ti = `${h}:${m}`;
                                let st = (0, moment_timezone_1.default)(ti, 'HH:mm');
                                let startt = (0, moment_timezone_1.default)(Snstartti, "HH:mm");
                                console.log(startt);
                                let hello = [];
                                while (startt < st) {
                                    hello.push(startt.add(30, 'minutes').format('hh:mm A'));
                                }
                                let hii = SnallTime.filter((k) => !hello.includes(k));
                                // console.log(SnallTime)
                                // let AFallTime = SnallTime.filter(v => !all.includes(v))
                                // console.log(AFallTime)
                                let removingslots = SnallendTime.concat(allslots.flat());
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
                    message: "slots are not present"
                });
            }
        }
        else {
            return res.status(400).json({
                message: "slots are not present"
            });
        }
    }
    catch (error) {
        res.status(400).send("Internal Server Error");
        console.log(error);
    }
});
exports.GetAppointment = GetAppointment;
