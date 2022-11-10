"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
//import SignupDt from '../moduls/signup';
const token = (req, res, next) => {
    try {
        const token = req.header('x-token');
        if (!token) {
            return res.status(400).send('Token Not Found');
        }
        const decode = jsonwebtoken_1.default.verify(token, 'vamsi');
        req.user = decode.user;
        console.log(decode.user);
        console.log(req.user);
        next();
    }
    catch (error) {
        console.log(error);
        return res.status(500).send('token is not valied');
    }
};
exports.default = token;
