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
const signup_1 = __importDefault(require("../moduls/signup"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const isAdmin = function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        // 401 Unauthorized
        // 403 Forbidden 
        let token = req.header('x-token');
        let decode = jsonwebtoken_1.default.verify(token, 'vamsi');
        // console.log(decode)
        req.user = yield signup_1.default.findById(decode.user.id);
        //console.log(req.user)
        if (!req.user.isAdmin)
            return res.status(403).send('Access denied Admin');
        next();
    });
};
exports.default = isAdmin;
