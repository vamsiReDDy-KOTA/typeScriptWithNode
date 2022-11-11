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
exports.getDaysByEmail = exports.DaysSoftDelete = exports.updateSlot = exports.ondays = void 0;
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const days_1 = __importDefault(require("../moduls/days"));
const signup_1 = __importDefault(require("../moduls/signup"));
// Staff Days API
/**
 * @api {post} /StaffWorkingHours staff working hours
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
 * @apiHeader {String} x-token Users unique access-key

 * @apiSuccessExample {json} Success-Response
 * HTTP/1.1 200 OK
 * {
 *       message: "successfully posted",
 *        result: { }
 * }
 *@apiSampleRequest /StaffWorkingHours
 *@apiErrorExample {json} Error-Response:
 *   HTTP/1.1 404 Not Found
 *    {
 *      "message":"user is not present pleace signup"
 *    }
 *   HTTP/1.1 400
 *     {
 *       "message": "User is already present"
 *     }
 *
 * HTTP/1.1 500 Internal Server Error
 */
const ondays = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield signup_1.default.findOne({ email: req.body.email });
        const StartDate = moment_timezone_1.default.utc(req.body.StartDate).format("dddd");
        // console.log(StartDate)
        if (StartDate != 'Sunday') {
            return res.status(400).send("Start Date should be starting day of the week");
        }
        const Start = moment_timezone_1.default.utc(req.body.StartDate).format();
        console.log(Start);
        console.log(StartDate);
        const ds = moment_timezone_1.default.utc(req.body.StartDate).add(1, 'week').format("DD-MM-YYYY");
        const da = moment_timezone_1.default.utc(req.body.StartDate).format("DD-MM-YYYY");
        const ts = (0, moment_timezone_1.default)().tz(req.body.TimeZone).format("DD-MM-YYYY");
        console.log(ds);
        const va = ts <= da;
        //console.log(va)
        if (da < ts) {
            return res.status(400).send("upgrade the StartDate");
        }
        if (!va) {
            return res.status(400).send("date should be graterthen or equal to today");
        }
        if (!data) {
            return res.status(404).json({
                message: "user is not present pleace signup"
            });
        }
        const user = yield days_1.default.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({
                message: "user is already present"
            });
        }
        const DaysModels = new days_1.default({
            TimeZone: req.body.TimeZone,
            email: req.body.email,
            phoneNo: req.body.phoneNo,
            name: req.body.name,
            StartDate: req.body.StartDate,
            repectForWeek: req.body.repectForWeek,
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
// Staff updateSlot API
/**
 * @api {put} /updateSlot update staff working hours
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
 * @apiHeader {String} x-token Users unique access-key

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
        const users = yield days_1.default.findOne({ email: req.query.email, StartDate: req.query.StartDate });
        //console.log(users)
        const datas = users === null || users === void 0 ? void 0 : users.repectForWeek;
        if (!datas) {
            // eslint-disable-next-line no-var
            var ds = moment_timezone_1.default.utc(users.StartDate).add(1, 'week').format("DD-MM-YYYY");
        }
        console.log(ds);
        const Startdates = moment_timezone_1.default.utc(req.body.StartDate).format("DD-MM-YYYY");
        console.log(Startdates);
        const daya = Startdates < ds;
        const day = Startdates == ds;
        console.log(day);
        console.log(daya);
        if (!day) {
            return res.status(400).send("start date is grater then lastWeek");
        }
        const StartDate = moment_timezone_1.default.utc(req.body.StartDate).format("dddd");
        console.log(StartDate);
        const daa = StartDate == 'Sunday';
        console.log(daa);
        if (!daa) {
            return res.status(400).send("Start Date should be starting day of the week");
        }
        const da = moment_timezone_1.default.utc(req.body.StartDate).format("DD-MM-YYYY");
        const ts = moment_timezone_1.default.utc().tz(req.body.TimeZone).format("DD-MM-YYYY");
        const updateDate = req.query.updateDate;
        const udDate = (0, moment_timezone_1.default)(updateDate).tz(req.body.TimeZone).format("DD-MM-YYYY");
        console.log(udDate);
        // const va= ts<=da
        // console.log(va)
        // if(!va){
        //   return res.status(400).send("date should be graterthen or equal to today")
        // }
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
            StartDate: req.body.StartDate || users.StartDate,
            repectForWeek: req.body.repect || users.repectForWeek,
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
// user DaysSoftDelete API
/**
 * @api {delete} /DeleteStaff/:id  delete staff
 * @apiGroup Staff
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
 *@apiSampleRequest /DeleteStaff/:id
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
        //const users: any = await DaysModel.findById(req.params.id);
        const users = yield days_1.default.findOne({ email: req.query.email, StartDate: req.query.StartDate });
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
        const softdelete = yield days_1.default.findOneAndUpdate({ email: req.query.email }, { isDeleted: true });
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
// staff getDaysByEmail API
/**
 * @api {get} /getDaysByEmail get staff details
 * @apiGroup Staff
 * @apiHeader {String} x-token Users unique access-key

 * @apiParamExample {json} Request-Example:
 *     {
 *       "email": " "
 *     }
 *
 * @apiQuery {String} email email is in the string format
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
        // let user = await DaysModel.find({ email: req.query.email, isDeleted: false })
        const users = yield days_1.default.findOne({ email: req.query.email, StartDate: req.query.StartDate }, { isDeleted: false });
        if (!users) {
            return res.status(400).json({
                success: false,
                message: "user is not presnt",
            });
        }
        return res.status(200).json({
            message: "data",
            result: users
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
