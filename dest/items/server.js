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
exports.getDaysByEmail = exports.getBookingsByEmail = exports.signin = exports.getallstaffs = exports.deleteuser = exports.logingetuser = exports.updateuser = exports.signup = exports.updateBooking = exports.bookingSlots = exports.softDelete = exports.DaysSoftDelete = exports.updateSlot = exports.GetAppointment = exports.ondays = void 0;
const moment_timezone_1 = __importDefault(require("moment-timezone"));
//import { Times } from "../moduls/timesInterface";
const days_1 = __importDefault(require("../moduls/days"));
const signup_1 = __importDefault(require("../moduls/signup"));
const bookingModel_1 = __importDefault(require("../moduls/bookingModel"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
//signup api
/**
 * @api {post} /Signup create a new user
 * @apiGroup users
 * @apiBody (Request body) {String} fristname first name of the user
 * @apiBody (Request body) {String} lastname of the user
 * @apiBody (Request body) {String} email user email
 * @apiBody (Request body) {String} password user password
 * @apiBody (Request body) {String} confirmPassword user name
 *
 * @apiSampleRequest /Signup
 * @apiSuccessExample {json} Success-Response
 * HTTP/1.1 200 OK
 * {
 *       message: "user successfully regester",
 *
 * }
 * @apiErrorExample {json} Error-Response:
 *   HTTP/1.1 404 Not Found
 *     {
 *       "message": "User is already present"
 *     }
 *
 *  HTTP/1.1 400
 *  {
 *    "message":"password and confirmpassword should be same"
 *  }
 *  HTTP/1.1 500
 * {
 * "message":"Internal Server Error"
 * }
 *
 */
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const salt = bcrypt_1.default.genSaltSync(10);
        const { firstname, lastname, email, password, confirmPassword } = req.body;
        //const {image} =  req.file.filename
        const hass = bcrypt_1.default.hashSync(password, salt);
        const conHass = bcrypt_1.default.hashSync(confirmPassword, salt);
        let exist = yield signup_1.default.findOne({ email });
        if (exist) {
            return res.status(404).json({ "message": "User is already present" });
        }
        if (password !== confirmPassword) {
            return res
                .status(400)
                .json({ "message": " password and confirmpassword should be same" });
        }
        let newUser = new signup_1.default({
            firstname,
            lastname,
            email,
            password: hass,
            confirmPassword: conHass,
        });
        yield newUser.save();
        return res.status(200).json({
            message: "user successfully regester"
        });
    }
    catch (error) {
        console.log(error);
        return res.send(500).json({
            message: "internal server error"
        });
    }
});
exports.signup = signup;
//Signin
/**
 * @api {post} /Signin signin user
 * @apiGroup users
 * @apiBody (Request body) {String} email user email
 * @apiBody (Request body) {String} password user password
 *
 * @apiSampleRequest /Signin
 * @apiSuccessExample {json} Success-Response
 * HTTP/1.1 200 OK
 * {
 *      "token": " ",
 *      "id": " ",
 *      "email": "",
 *      "isAdmin": "",
 *
 * }
 * @apiErrorExample {json} Error-Response:
 *   HTTP/1.1 404 Not Found
 *     {
 *       "message": "user is not present in our Database"
 *     }
 *
 *  HTTP/1.1 400
 *  {
 *    "message":"password went wrong"
 *  }
 *  HTTP/1.1 500
 * {
 * "message":"Internal Server Error"
 * }
 *
 */
const signin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        let exist = yield signup_1.default.findOne({ email });
        if (!exist) {
            return res.status(404).json({ "Message": "user is not present in our Database" });
        }
        const isPasswordCorrect = bcrypt_1.default.compare(password, exist.password);
        //console.log(exist)
        if (!isPasswordCorrect) {
            return res.status(400).json({ "message": "password went wrong" });
        }
        let payload = {
            user: {
                id: exist.id,
            },
        };
        jsonwebtoken_1.default.sign(payload, "vamsi", { expiresIn: 60 * 60 * 1000 }, (err, token) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                console.log(err);
            }
            return yield res.json({
                token: token,
                id: exist._id,
                email: exist.email,
                isAdmin: exist.isAdmin,
            });
        }));
        //return res.json(exist)
    }
    catch (error) {
        console.log(error);
        return res.send(500).json({ "message": "Internal server" });
    }
});
exports.signin = signin;
//update user
/**
 * @api {put} /updateuser update user
 * @apiGroup users
 * @apiBody (Request body) {String} firstname user firstname
 * @apiBody (Request body) {String} lastname user lastname
 * @apiBody (Request body) {String} password user password
 * @apiBody (Request body) {String} confirmPassword user confirmPassword
 *
 * @apiSampleRequest /updateuser
 *
 * @apiQuery {String} email email is in the string format
 * @apiHeader {String} x-token Users unique access-key
 *
 * @apiSuccessExample {json} Success-Response
 * HTTP/1.1 200 OK
 * {
 *    "message":"user update sucessfully"
 *              " result ": {
 *              "firstname": " ",
 *              "lastname": " ",
 *              "password": " ",
 *              "confirmPassword": " "
 *    }
 *
 * }
 * @apiErrorExample {json} Error-Response:
 *   HTTP/1.1 404 Not Found
 *     {
 *       "message": "user is not present in our Database"
 *     }
 *
 *  HTTP/1.1 400
 *  {
 *    "message":"password and confirmpassword should be same"
 *  }
 *  HTTP/1.1 500
 * {
 * "message":"Internal Server Error"
 * }
 *
 */
const updateuser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let users = yield signup_1.default.findOne({ email: req.query.email });
        if (!users) {
            return res.status(404).json({
                success: false,
                message: "user is not present",
            });
        }
        if (users === null || users === void 0 ? void 0 : users.isDeleted) {
            return res.status(404).json({
                message: "user is not present"
            });
        }
        const salt = bcrypt_1.default.genSaltSync(10);
        let password = req.body.password || users.password;
        let confirmPassword = req.body.confirmPassword || users.confirmPassword;
        if (password !== confirmPassword) {
            return res
                .status(400)
                .send(" password and confirmpassword should be same");
        }
        const hass = bcrypt_1.default.hashSync(password, salt);
        const conHass = bcrypt_1.default.hashSync(confirmPassword, salt);
        const newUserData = {
            email: users.email,
            firstname: req.body.firstname || users.firstname,
            lastname: req.body.lastname || users.lastname,
            password: hass,
            confirmPassword: conHass
        };
        const user = yield signup_1.default.findOneAndUpdate({ email: req.query.email }, newUserData, {
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
exports.updateuser = updateuser;
//logingetuser
/**
 * @api {get} /logingetuser get user detiles
 * @apiGroup users
 *
 * @apiSampleRequest /logingetuser
 *
 * @apiQuery {String} email email is in the string format
 * @apiHeader {String} x-token Users unique access-key
 *
 * @apiSuccessExample {json} Success-Response
 * HTTP/1.1 200 OK
 * {
 *    "message":"data"
 *     "result ": {
 *              "id":" ",
 *              "firstname": " ",
 *              "lastname": " ",
 *              "password": " ",
 *              "confirmPassword": " ",
 *              "isAdmin":" "
 *    }
 *
 * }
 * @apiErrorExample {json} Error-Response:
 *   HTTP/1.1 404 Not Found
 *     {
 *       "message": "user is not present"
 *     }
 *
 *  HTTP/1.1 500
 * {
 * "message":"Internal Server Error"
 * "error":" "
 * }
 *
 */
const logingetuser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let user = yield signup_1.default.find({ email: req.query.email, isDeleted: false });
        if (!user) {
            return res.status(404).json({
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
exports.logingetuser = logingetuser;
/**
 * @api {delete} /deleteuser/:id delete a user
 * @apiGroup users
 *
 * @apiSampleRequest /deleteuser/:id
 *
 * @apiParam {Number} id Users unique ID.

 * @apiParamExample {json} Request-Example:
 *     {
 *       "id": " "
 *     }
 *
 * @apiHeader {String} x-token Users unique access-key
 *
 * @apiSuccessExample {json} Success-Response
 * HTTP/1.1 200 OK
 * {
 *    "message":"deleted successfully"
 *
 * }
 * @apiErrorExample {json} Error-Response:
 *   HTTP/1.1 404 Not Found
 *     {
 *       "message": "user is not present"
 *     }
 *
 *  HTTP/1.1 500
 * {
 * "message":"Internal Server Error"
 * "error":" "
 * }
 *
 */
const deleteuser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let users = yield signup_1.default.findById(req.params.id);
        console.log(users);
        if (!users) {
            return res.status(404).json({
                "success": false,
                error: "user not present"
            });
        }
        if (users.isDeleted === true) {
            return res.status(404).json({
                "success": false,
                error: "user not present"
            });
        }
        let softdelete = yield signup_1.default.findOneAndUpdate({ _id: users._id }, { isDeleted: true });
        res.status(200).json({
            message: "deleted successfully",
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
            error: error
        });
    }
});
exports.deleteuser = deleteuser;
// Staff Days API
/**
 * @api {post} /Days post staff availability days
 * @apiGroup Staff
 * @apiBody (Request body) {String} TimeZone which timezone he is present
 * @apiBody (Request body) {String} email Staff email
 * @apiBody (Request body) {String} phoneNo Staff phoneNo
 * @apiBody (Request body) {String} name Staff name
 * @apiBody (Request body) {Array} [Monday] [startTime][endTime][breakTime] Times that the staff will be avalibul on monday
 * @apiBody (Request body) {Array} [Tuesday] [startTime][endTime][breakTime] Times that the staff will be avalibul on Tuesday
 * @apiBody (Request body) {Array} [Wednesday] [startTime][endTime][breakTime] Times that the staff will be avalibul on Wednesday
 * @apiBody (Request body) {Array} [Thursday] [startTime][endTime][breakTime] Times that the staff will be avalibul on Thursday
 * @apiBody (Request body) {Array} [Friday] [startTime][endTime][breakTime] Times that the staff will be avalibul on Friday
 * @apiBody (Request body) {Array} [Saturday] [startTime][endTime][breakTime] Times that the staff will be avalibul on Saturday
 * @apiBody (Request body) {Array} [Sunday] [startTime][endTime][breakTime] Times that the staff will be avalibul on Sunday
 *
 * @apiSuccessExample {json} Success-Response
 * HTTP/1.1 200 OK
 * {
 *       message: "successfully posted",
 *        result: { }
 * }
 *@apiSampleRequest /Days
 *@apiErrorExample {json} Error-Response:
 *   HTTP/1.1 404 Not Found
 *     {
 *       "message": "User is already present"
 *     }
 *
 * HTTP/1.1 500 Internal Server Error
 */
const ondays = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let user = yield days_1.default.findOne({ email: req.body.email });
        if (user) {
            return res.status(404).json({
                message: "user is already present"
            });
        }
        const DaysModels = new days_1.default({
            TimeZone: req.body.TimeZone,
            email: req.body.email,
            phoneNo: req.body.phoneNo,
            name: req.body.name,
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
            message: "successfully posted",
            result: newDays
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: "internal server error"
        });
    }
});
exports.ondays = ondays;
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
        let slots = yield days_1.default.findOne({ email: req.query.email });
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
        let timeZn = slots === null || slots === void 0 ? void 0 : slots.TimeZone;
        let userDt = (0, moment_timezone_1.default)().tz(timeZn).format("DD-MM-YYYY");
        let userEnteredDt = (0, moment_timezone_1.default)(date).format("YYYY-MM-DD");
        let ptz = (0, moment_timezone_1.default)(date).format('DD-MM-YYYY');
        let userEnteredDay = (0, moment_timezone_1.default)(userEnteredDt).format('dddd');
        let currentTime = (0, moment_timezone_1.default)().tz(timeZn).format('HH:mm');
        if (userDt <= ptz) {
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
    catch (error) {
        res.status(400).send("Internal Server Error");
        console.log(error);
    }
});
exports.GetAppointment = GetAppointment;
// Staff updateSlot API
/**
 * @api {put} /updateSlot update staff availability time
 * @apiGroup Staff
 * @apiBody (Request body) {String} TimeZone which timezone he is present
 * @apiBody (Request body) {String} email Staff email
 * @apiBody (Request body) {String} phoneNo Staff phoneNo
 * @apiBody (Request body) {String} name Staff name
 * @apiBody (Request body) {Array} [Monday] [startTime][endTime][breakTime] Times that the staff will be avalibul on monday
 * @apiBody (Request body) {Array} [Tuesday] [startTime][endTime][breakTime] Times that the staff will be avalibul on Tuesday
 * @apiBody (Request body) {Array} [Wednesday] [startTime][endTime][breakTime] Times that the staff will be avalibul on Wednesday
 * @apiBody (Request body) {Array} [Thursday] [startTime][endTime][breakTime] Times that the staff will be avalibul on Thursday
 * @apiBody (Request body) {Array} [Friday] [startTime][endTime][breakTime] Times that the staff will be avalibul on Friday
 * @apiBody (Request body) {Array} [Saturday] [startTime][endTime][breakTime] Times that the staff will be avalibul on Saturday
 * @apiBody (Request body) {Array} [Sunday] [startTime][endTime][breakTime] Times that the staff will be avalibul on Sunday
 *
 * @apiParamExample {json} Request-Example:
 *     {
 *       "email": " "
 *     }
 *
 * @apiQuery {String} email email is in the string format
 
 
 * @apiSuccessExample {json} Success-Response
 * HTTP/1.1 200 OK
 * {
 *         message: "user updated sucessfully",
 *         result: {  }
 * }
 *@apiSampleRequest /updateSlot
 *@apiErrorExample {json} Error-Response:
 *   HTTP/1.1 404 Not Found
 *     {
 *       "message": "User is not present"
 *     }
 *
 * HTTP/1.1 500 Internal Server Error
 */
const updateSlot = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let users = yield days_1.default.findOne({ email: req.query.email });
        if (!users) {
            return res.status(404).json({
                success: false,
                message: "user is not present",
            });
        }
        if (users === null || users === void 0 ? void 0 : users.isDeleted) {
            return res.status(404).json({
                message: "user is not present"
            });
        }
        const newUserData = {
            TimeZone: req.body.TimeZone || users.TimeZone,
            email: users.email,
            phoneNo: req.body.phoneNo || users.phoneNo,
            name: req.body.name || users.name,
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
            message: "staff updated sucessfully",
            result: user
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).send("Internal server");
    }
});
exports.updateSlot = updateSlot;
// Staff booking API
/**
 * @api {post} /booking It post when the staff is avalbul
 * @apiGroup Booking
 * @apiBody (Request body) {String} TimeZone which timezone he is present
 * @apiBody (Request body) {String} email user email
 * @apiBody (Request body) {String} SlotsTime user Slot time
 * @apiBody (Request body) {Array} Service user service
 * @apiBody (Request body) {String} AppointmentDate user date Appointment
 * @apiBody (Request body) {String} name user name
 * @apiBody (Request body) {String} Duerication user Duerication of slot
 
 * @apiSuccessExample {json} Success-Response
 * HTTP/1.1 200 OK
 * {
 *           message: "slot booking sucess",
 *           result: { }
 * }
 *@apiSampleRequest /updateSlot
 *@apiErrorExample {json} Error-Response:
 *   HTTP/1.1 404 Not Found
 *     {
 *       "message": "User is not present"
 *     }
 *
 *  HTTP/1.1 400
 * {
 *  status: false,
 * message: "date is grater then today"
 * }
 * HTTP/1.1 500 Internal Server Error
 */
const bookingSlots = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let user = yield bookingModel_1.default.find({ TimeZone: req.body.TimeZone, AppointmentDate: req.body.AppointmentDate, email: req.body.email }, { "SlotsTime": "$SlotsTime" });
    let daysdata = yield days_1.default.findOne({ email: req.body.email });
    if (!daysdata) {
        return res.status(404).json({
            status: false,
            message: "user is not present"
        });
    }
    let date = (0, moment_timezone_1.default)().tz(req.body.TimeZone).format('YYYY-MM-DD');
    console.log(date);
    let enterdat = (0, moment_timezone_1.default)(req.body.AppointmentDate).format('YYYY-MM-DD');
    console.log(enterdat);
    if (date > enterdat) {
        return res.status(400).json({
            status: false,
            message: "date is grater or equal to  today"
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
        res.status(500).json({
            message: "internal server error"
        });
    }
});
exports.bookingSlots = bookingSlots;
// User updateBooking API
/**
 * @api {put} /updateBooking This api will update the booking of user
 * @apiGroup Booking
 * @apiBody (Request body) {String} email user email
 * @apiBody (Request body) {String} SlotsTime user Slot time
 * @apiBody (Request body) {Array} Service user service
 * @apiBody (Request body) {String} AppointmentDate user date Appointment
 * @apiBody (Request body) {String} name user name
 * @apiBody (Request body) {String} Duerication user Duerication of slot

 * @apiParamExample {json} Request-Example:
 *     {
 *       "email": " "
 *     }
 *
 
 * @apiSuccessExample {json} Success-Response
 * HTTP/1.1 200 OK
 * {
 *           message: "slot booking sucess",
 *           result: { }
 * }
 *@apiSampleRequest /updateBooking
 *@apiErrorExample {json} Error-Response:
 *   HTTP/1.1 404 Not Found
 *     {
 *       "message": "User is not present"
 *     }
 *
 * HTTP/1.1 500 Internal Server Error
 *  HTTP/1.1 400
 * {
 *  status: false,
 * message: "date is grater then today"
 * }
 */
const updateBooking = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let users = yield bookingModel_1.default.findById(req.query.id);
        console.log(users.TimeZone);
        //console.log(use)
        if (!users) {
            //console.log("hello")
            return res.status(404).json({
                success: false,
                message: "user is not presnt",
            });
        }
        let daysdata = yield days_1.default.findOne({ email: req.body.email });
        console.log("hello");
        //console.log(daysdata)
        if (!daysdata) {
            return res.status(404).json({
                status: false,
                message: "user is not present"
            });
        }
        if (users === null || users === void 0 ? void 0 : users.isDeleted) {
            return res.status(404).json({
                message: " user is not present "
            });
        }
        let date = (0, moment_timezone_1.default)().tz(users.TimeZone).format('YYYY-MM-DD');
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
            message: "user updated successfully",
            result: data
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).send("Hello Internal server");
    }
});
exports.updateBooking = updateBooking;
// user getBookingsByEmail API
/**
 * @api {get} /getBookingsByEmail This api will get the bookings of user by email
 * @apiGroup Booking

 * @apiParamExample {json} Request-Example:
 *     {
 *       "email": " "
 *     }
 *
 
 * @apiSuccessExample {json} Success-Response
 * HTTP/1.1 200 OK
 * {
 *           message: "data",
 *           result: { }
 * }
 *@apiSampleRequest /getBookingsByEmail
 *@apiErrorExample {json} Error-Response:
 *   HTTP/1.1 404 Not Found
 *     {
 *        "success":false
 *       "message": "User is not present"
 *     }
 *
 * HTTP/1.1 500
 * {
 * message:"Internal Server Error",
 * error : { }
 * }

 */
const getBookingsByEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let user = yield bookingModel_1.default.find({ email: req.query.email, isDeleted: false });
        if (!user) {
            return res.status(404).json({
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
            message: "internal server error",
            error: error
        });
    }
});
exports.getBookingsByEmail = getBookingsByEmail;
// staff getDaysByEmail API
/**
 * @api {get} /getDaysByEmail This api will get staff by email
 * @apiGroup Staff

 * @apiParamExample {json} Request-Example:
 *     {
 *       "email": " "
 *     }
 *
 
 * @apiSuccessExample {json} Success-Response
 * HTTP/1.1 200 OK
 * {
 *           message: "data",
 *           result: { }
 * }
 *@apiSampleRequest /getDaysByEmail
 *@apiErrorExample {json} Error-Response:
 *   HTTP/1.1 404 Not Found
 *     {
 *        "success":false
 *       "message": "User is not present"
 *     }
 *
 * HTTP/1.1 500
 * {
 * message:"Internal Server Error",
 * error : { }
 * }

 */
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
// user softDelete API
/**
 * @api {delete} /softDelete/:id This api will delete user bookings by id
 * @apiGroup Booking
 
 * @apiParam {Number} id Users unique ID.

 * @apiParamExample {json} Request-Example:
 *     {
 *       "id": " "
 *     }
 *
 
 * @apiSuccessExample {json} Success-Response
 * HTTP/1.1 200 OK
 * {
 *           message: "Your slot was deleted"
 * }
 *@apiSampleRequest /softDelete/:id
 *@apiErrorExample {json} Error-Response:
 *   HTTP/1.1 404 Not Found
 *     {
 *        "success":false
 *       "message": "User is not present"
 *     }
 *
 * HTTP/1.1 500
 * {
 * message:"Internal Server Error",
 * error : { }
 * }

 */
const softDelete = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    debugger;
    try {
        const users = yield bookingModel_1.default.findById(req.params.id);
        console.log(users);
        if (!users) {
            return res.status(404).json({
                error: 'user is not present'
            });
        }
        if (users.isDeleted === true) {
            return res.status(404).json({
                error: 'user is not present'
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
            message: "Your slot was deleted"
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
            error: error
        });
    }
});
exports.softDelete = softDelete;
// user DaysSoftDelete API
/**
 * @api {delete} /DaysSoftDelete/:id This api will delete user staff by id
 * @apiGroup Staff
 
 * @apiParam {Number} id Users unique ID.

 * @apiParamExample {json} Request-Example:
 *     {
 *       "id": " "
 *     }
 *
 
 * @apiSuccessExample {json} Success-Response
 * HTTP/1.1 200 OK
 * {
 *           message: "Your slot was deleted"
 * }
 *@apiSampleRequest /DaysSoftDelete/:id
 *@apiErrorExample {json} Error-Response:
 *   HTTP/1.1 404 Not Found
 *     {
 *        "success":false
 *       "message":  "Staff dose not present"
 *     }
 *
 * HTTP/1.1 500
 * {
 * message:"Internal Server Error",
 * error : { }
 * }

 */
const DaysSoftDelete = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield days_1.default.findById(req.params.id);
        console.log(users);
        if (!users) {
            return res.status(404).json({
                "success": false,
                error: "Staff dose not present"
            });
        }
        if (users.isDeleted === true) {
            return res.status(404).json({
                "success": false,
                error: "Staff dose not present"
            });
        }
        const softdelete = yield days_1.default.findOneAndUpdate({ _id: users._id }, { isDeleted: true });
        res.status(200).json({
            message: "deleted success",
            //data: softdelete
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
            error: error
        });
    }
});
exports.DaysSoftDelete = DaysSoftDelete;
//getallstaffs
/**
 * @api {put} /getallstaffs get all staff details
 * @apiGroup Admin
 *
 * @apiSampleRequest /getallstaffs
 *
 * @apiHeader {String} x-token Users unique access-key
 *
 * @apiSuccessExample {json} Success-Response
 * HTTP/1.1 200 OK
 * {
 *    "message":"data"
 *    "result" : "get all staff details"
 *
 * }
 * @apiErrorExample {json} Error-Response:
 *
 *
 *  HTTP/1.1 403 "Access denied"
 *
 *  HTTP/1.1 500
 * {
 * "message":"Internal Server Error"
 * }
 *
 */
const getallstaffs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let user = yield days_1.default.find({ isDeleted: false });
        res.status(200).json({
            message: "data",
            result: user
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: "internal server error",
            error: error
        });
    }
});
exports.getallstaffs = getallstaffs;
