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
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const tokent_1 = __importDefault(require("../moduls/tokent"));
//import SignupDt from '../moduls/signup';
const token = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.header('x-token');
        if (!token) {
            return res.status(400).send('Token Not Found');
        }
        const user = yield tokent_1.default.findOne({ token: req.header('x-token') }, { status: 'A' });
        if (!user) {
            res.status(401).send('your acount is not in Active pleace login');
        }
        const decode = jsonwebtoken_1.default.verify(token, 'vamsi');
        req.user = decode.user;
        console.log("hello");
        next();
    }
    catch (error) {
        console.log(error);
        return res.status(500).send('token is not valied');
    }
});
exports.default = token;
