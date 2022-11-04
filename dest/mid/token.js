"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const token = (req, res, next) => {
    try {
        let token = req.header('x-token');
        if (!token) {
            return res.status(400).send('Token Not Found');
        }
        let decode = jsonwebtoken_1.default.verify(token, 'vamsi');
        req.user = decode.user;
        next();
    }
    catch (error) {
        console.log(error);
        return res.status(500).send('token is not valied');
    }
};
exports.default = token;
