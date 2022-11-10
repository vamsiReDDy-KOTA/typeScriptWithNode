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
exports.isStaff = exports.isAdmin = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const signup_1 = __importDefault(require("../moduls/signup"));
const login_1 = __importDefault(require("../moduls/login"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // 401 Unauthorized
    // 403 Forbidden 
    const token = req.header('x-token');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const decode = jsonwebtoken_1.default.verify(token, 'vamsi');
    // console.log(decode)
    req.user = yield signup_1.default.findById(decode.user.id);
    //console.log(req.user)
    if (req.user.role != 'admin')
        return res.status(403).send('Access denied');
    next();
});
exports.isAdmin = isAdmin;
const isStaff = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.header('x-token');
    const decode = jsonwebtoken_1.default.verify(token, 'vamsi');
    // console.log(decode)
    req.user = yield login_1.default.findById(decode.user.id);
    if (req.user.role != 'staff')
        return res.status(403).send('Access denied');
    next();
});
exports.isStaff = isStaff;
