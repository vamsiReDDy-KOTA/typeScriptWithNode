"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.itemsRouter = void 0;
const express_1 = __importDefault(require("express"));
const ItemService = __importStar(require("./server"));
const joi_1 = __importDefault(require("joi"));
exports.itemsRouter = express_1.default.Router();
exports.itemsRouter.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const AS = /^[a-z ]+$/i;
    try {
        const item = req.body;
        const nDate = new Date().toLocaleString('en-US', {
            timeZone: req.body.DateYouBooked
        });
        console.log(nDate);
        const schema = joi_1.default.object().keys({
            name: joi_1.default.string().regex(AS).min(3).max(30).required(),
            bookingId: joi_1.default.number().required(),
            StartTime: joi_1.default.string(),
            EndTime: joi_1.default.string(),
            dateOfAppointment: joi_1.default.date().required().min(nDate),
            DateYouBooked: joi_1.default.string()
        });
        schema
            .validateAsync(item)
            .then((val) => {
            req.body = val;
            const item = {
                DateYouBooked: new Date().toLocaleString('en-US', {
                    timeZone: req.body.DateYouBooked
                }),
                dateOfAppointment: req.body.dateOfAppointment,
                name: req.body.name,
                StartTime: req.body.StartTime,
                EndTime: req.body.EndTime,
                bookingId: req.body.bookingId
            };
            const vams = ItemService.create(item);
            res.status(200).send("you have booked appointment");
        })
            .catch((err) => {
            res.status(400).send("Failed to validate input " + err);
            console.log(err);
        });
    }
    catch (e) {
        res.status(500).send("internal error");
    }
}));
