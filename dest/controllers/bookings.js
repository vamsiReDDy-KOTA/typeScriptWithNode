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
exports.getBookingsByEmail = exports.updateBooking = exports.bookingSlots = exports.softDelete = void 0;
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const days_1 = __importDefault(require("../moduls/days"));
const bookingModel_1 = __importDefault(require("../moduls/bookingModel"));
const nodemailer_1 = __importDefault(require("nodemailer"));
// user booking API
/**
 * @api {post} /booking booking slots
 * @apiGroup Booking
 * @apiBody (Request body) {String} TimeZone which timezone he is present
 * @apiBody (Request body) {String} email user email
 * @apiBody (Request body) {String} SlotsTime user Slot time
 * @apiBody (Request body) {Array} Service user service
 * @apiBody (Request body) {String} AppointmentDate user date Appointment
 * @apiBody (Request body) {String} name user name
 * @apiBody (Request body) {String} Duerication user Duerication of slot
 * @apiHeader {String} x-token Users unique access-key

 
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
    const user = yield bookingModel_1.default.find({ TimeZone: req.body.TimeZone, AppointmentDate: req.body.AppointmentDate, email: req.body.email }, { "SlotsTime": "$SlotsTime" });
    const daysdata = yield days_1.default.findOne({ email: req.body.email });
    if (!daysdata) {
        return res.status(404).json({
            status: false,
            message: "user is not present"
        });
    }
    const date = (0, moment_timezone_1.default)().tz(req.body.TimeZone).format('YYYY-MM-DD');
    console.log(date);
    const enterdat = (0, moment_timezone_1.default)(req.body.AppointmentDate).format('YYYY-MM-DD');
    console.log(enterdat);
    if (date > enterdat) {
        return res.status(400).json({
            status: false,
            message: "date is grater or equal to  today"
        });
    }
    //console.log(user)
    const allslots = [];
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
    try {
        const BookingModels = new bookingModel_1.default({
            TimeZone: req.body.TimeZone,
            SlotsTime: req.body.SlotsTime,
            Service: req.body.Service,
            email: req.body.email,
            Name: req.body.Name,
            Duerication: req.body.Duerication,
            AppointmentDate: req.body.AppointmentDate
        });
        const slot = yield BookingModels.save();
        const transporters = nodemailer_1.default.createTransport({
            service: 'gmail',
            auth: {
                user: "kotavamsi16@gmail.com",
                pass: "mbjypwpxtpswciyp",
            },
            tls: {
                rejectUnauthorized: true,
            },
        });
        const mailOptions = {
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
 * @api {put} /updateBooking update booking details
 * @apiGroup Booking
 * @apiBody (Request body) {String} email user email
 * @apiBody (Request body) {String} SlotsTime user Slot time
 * @apiBody (Request body) {Array} Service user service
 * @apiBody (Request body) {String} AppointmentDate user date Appointment
 * @apiBody (Request body) {String} name user name
 * @apiBody (Request body) {String} Duerication user Duerication of slot
 *
 * @apiHeader {String} x-token Users unique access-key

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
        // eslint-disable-next-line prefer-const
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
        const daysdata = yield days_1.default.findOne({ email: req.body.email });
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
        const date = (0, moment_timezone_1.default)().tz(users.TimeZone).format('YYYY-MM-DD');
        console.log(date);
        const enterdat = (0, moment_timezone_1.default)(req.body.AppointmentDate).format('YYYY-MM-DD');
        console.log(enterdat);
        if (date > enterdat) {
            return res.status(400).json({
                status: false,
                message: "date is grater then today"
            });
        }
        const user = yield bookingModel_1.default.find({ TimeZone: users.TimeZone, email: req.body.email, AppointmentDate: req.body.AppointmentDate }, { "SlotsTime": "$SlotsTime" });
        //console.log(user)
        const allslots = [];
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
        const newUserData = {
            TimeZone: users.TimeZone,
            SlotsTime: req.body.SlotsTime || users.SlotsTime,
            Service: req.body.Service || users.Service,
            email: req.body.email || users.email,
            Name: req.body.Name || users.Name,
            Duerication: req.body.Duerication || users.Duerication,
            AppointmentDate: req.body.AppointmentDate || users.AppointmentDate
        };
        const data = yield bookingModel_1.default.findByIdAndUpdate({ _id: req.query.id }, newUserData, {
            new: true,
            runValidators: false,
            userFindAndModify: true,
        });
        const transporters = nodemailer_1.default.createTransport({
            service: 'gmail',
            auth: {
                user: "kotavamsi16@gmail.com",
                pass: "mbjypwpxtpswciyp",
            },
            tls: {
                rejectUnauthorized: true,
            },
        });
        const mailOptions = {
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
 * @api {get} /getBookingsByEmail get booking details
 * @apiGroup Booking
 *
 * @apiHeader {String} x-token Users unique access-key


 * @apiParamExample {json} Request-Example:
 *     {
 *       "email": " "
 *     }
 *
 * @apiQuery {String} email email is in the string format
 
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
        const user = yield bookingModel_1.default.find({ email: req.query.email, isDeleted: false });
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
// user softDelete API
/**
 * @api {delete} /DeleteBooking/:id delete bookings
 * @apiGroup Booking
 * @apiHeader {String} x-token Users unique access-key

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
 *@apiSampleRequest /DeleteBooking/:id
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
        const transporters = nodemailer_1.default.createTransport({
            service: 'gmail',
            auth: {
                user: "kotavamsi16@gmail.com",
                pass: "mbjypwpxtpswciyp",
            },
            tls: {
                rejectUnauthorized: true,
            },
        });
        const mailOptions = {
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
