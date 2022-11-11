"use strict";
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
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
exports.profile = exports.logout = exports.signin = exports.deleteuser = exports.logingetuser = exports.updateuser = exports.signup = void 0;
const tokenT_1 = __importDefault(require("../moduls/tokenT"));
const joi_1 = __importDefault(require("joi"));
const signup_1 = __importDefault(require("../moduls/signup"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const tokenT_2 = __importDefault(require("../moduls/tokenT"));
//signup api
/**
 * @api {post} /Signup create a new user
 * @apiGroup users
 * @apiBody (Request body) {String} firstname first name of the user
 * @apiBody (Request body) {String} lastname of the user
 * @apiBody (Request body) {String} email user email
 * @apiBody (Request body) {String} password user password
 * @apiBody (Request body) {String} confirmPassword user name
 *
 * @apiSampleRequest /Signup
 * @apiSuccessExample {json} Success-Response
 * HTTP/1.1 200 OK
 * {
 *       message: "user successfully register",
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
    const salt = bcrypt_1.default.genSaltSync(10);
    const schema = joi_1.default.object().keys({
        email: joi_1.default.string()
            .lowercase()
            .trim()
            .max(320)
            .email({ minDomainSegments: 2 })
            .required(),
        firstname: joi_1.default.string().trim().max(70).required(),
        lastname: joi_1.default.string().trim().max(70).required(),
        password: joi_1.default.string().trim().min(8).max(70).required(),
        confirmPassword: joi_1.default.string().trim().min(8).max(70).required(),
    });
    const { firstname, lastname, email, password, confirmPassword } = req.body;
    schema
        .validateAsync({ firstname, lastname, email, password, confirmPassword })
        .then((val) => __awaiter(void 0, void 0, void 0, function* () {
        req.body = val;
    }));
    // .catch((err) => {
    //   console.log("Failed to validate input " + err.details[0].message);
    //   const k: any = err.details[0].message;
    //   return res.status(400).send(k); 
    // });
    try {
        //const {image} =  req.file.filename
        const hass = bcrypt_1.default.hashSync(password, salt);
        const conHass = bcrypt_1.default.hashSync(confirmPassword, salt);
        const exist = yield signup_1.default.findOne({ email });
        if (exist) {
            return res.status(404).json({ message: "User is already present" });
        }
        if (password !== confirmPassword) {
            return res
                .status(400)
                .json({ message: " password and confirmpassword should be same" });
        }
        const newUser = new signup_1.default({
            firstname,
            lastname,
            email,
            password: hass,
            confirmPassword: conHass,
        });
        // res.status(400).send(k)
        yield newUser.save();
        return res.status(200).json({
            message: "user successfully register",
        });
    }
    catch (error) {
        console.log(error);
        return res.send(500).json({
            message: "internal server error",
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
        const exist = yield signup_1.default.findOne({ email });
        if (!exist) {
            return res
                .status(404)
                .json({ Message: "user is not present in our Database" });
        }
        const token = yield tokenT_1.default.findOneAndUpdate({ userId: exist.id }, { status: 'D' }, { sort: { _id: -1 } });
        const isPasswordCorrect = yield bcrypt_1.default.compare(password, exist.password);
        //console.log(exist)
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "password went wrong" });
        }
        const payload = {
            user: {
                id: exist.id,
            },
        };
        jsonwebtoken_1.default.sign(payload, "vamsi", { expiresIn: 60 * 60 * 1000 }, (err, token) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                console.log(err);
            }
            const user = yield tokenT_1.default.create({ token: token, userId: exist._id });
            return yield res.json({
                token: token,
                id: exist._id,
                email: exist.email,
                role: exist.role,
                data: user
            });
        }));
        //return res.json(exist)
    }
    catch (error) {
        console.log(error);
        return res.send(500).json({ message: "Internal server" });
    }
});
exports.signin = signin;
//update user
/**
 * @api {put} /updateuser update user
 * @apiGroup users
 * @apiBody (Request body) {String} firstname user firstname
 * @apiBody (Request body) {String} lastname user lastname
 *
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
 *             "email":" "
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
        const users = yield signup_1.default.findOne({ email: req.query.email });
        if (!users) {
            return res.status(404).json({
                success: false,
                message: "user is not present",
            });
        }
        if (users === null || users === void 0 ? void 0 : users.isDeleted) {
            return res.status(404).json({
                message: "user is not present",
            });
        }
        const salt = bcrypt_1.default.genSaltSync(10);
        const password = req.body.password || users.password;
        const confirmPassword = req.body.confirmPassword || users.confirmPassword;
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
        };
        const user = yield signup_1.default.findOneAndUpdate({ email: req.query.email }, newUserData, {
            new: true,
            runValidators: false,
            userFindAndModify: true,
        });
        return res.status(200).json({
            message: "user updated sucessfully",
            result: user,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).send("Internal server");
    }
});
exports.updateuser = updateuser;
//logOut
/**
 * @api {delete} /logout user logout
 * @apiGroup users
 *
 * @apiSampleRequest /logout
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
 *
 *  HTTP/1.1 500
 * {
 * "message":"Internal Server Error"
 * }
 *
 */
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield tokenT_2.default.findOneAndDelete({ token: req.header('x-token') });
        return yield res.status(200).json({
            message: "deleted successfully"
        });
    }
    catch (error) {
        return yield res.status(500).json({
            error: "internal server error"
        });
    }
});
exports.logout = logout;
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
        const user = yield signup_1.default.find({
            email: req.query.email,
            isDeleted: false,
        });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "user is not presnt",
            });
        }
        res.status(200).json({
            message: "data",
            result: user,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: "internal error",
            error: error,
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
        const users = yield signup_1.default.findById(req.params.id);
        console.log(users);
        if (!users) {
            return res.status(404).json({
                success: false,
                error: "user not present",
            });
        }
        if (users.isDeleted === true) {
            return res.status(404).json({
                success: false,
                error: "user not present",
            });
        }
        const softdelete = yield signup_1.default.findOneAndUpdate({ _id: users._id }, { isDeleted: true });
        res.status(200).json({
            message: "deleted successfully",
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
            error: error,
        });
    }
});
exports.deleteuser = deleteuser;
/**
 * @api {put} /profilePic profilePic
 * @apiGroup users
 * @apiBody (Request body) {file} image user profilePic
 *
 *
 * @apiSampleRequest /profilePic
 *
 * @apiQuery {String} email email is in the string format
 * @apiHeader {String} x-token Users unique access-key
 *
 * @apiSuccessExample {json} Success-Response
 * HTTP/1.1 200 OK
 * {
 *    "message":"profile update sucessfully"
 *              " result ": {
 *              "id":" ",
 *              "firstname": " ",
 *              "lastname": " ",
 *              "password": " ",
 *              "confirmPassword": " ",
 *              "image":" ",
 *              "role":" "
 *    }
 *
 * }
 * @apiErrorExample {json} Error-Response:
 *   HTTP/1.1 404 Not Found
 *     {
 *       "message": "user is not present in our Database"
 *     }
 *
 *
 *  HTTP/1.1 500
 * {
 * "message":"Internal Server Error"
 * }
 *
 */
const profile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userd = yield signup_1.default.findOne({ email: req.query.email });
        if (!userd) {
            return res.status(404).json({
                success: false,
                message: "user is not present in our Database",
            });
        }
        //console.log(req.params.id)
        // console.log(req.file.filename)
        //image:req.file.filename
        const user = yield signup_1.default.findOneAndUpdate({ email: req.query.email }, { image: req.file.filename }, {
            new: true,
            runValidators: true,
            userFindAndModify: false,
        });
        res.status(200).send({
            message: "profile update sucessfully",
            result: user,
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
        });
    }
});
exports.profile = profile;
