"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.itemsRouter = void 0;
const express_1 = __importDefault(require("express"));
const server_1 = require("./server");
exports.itemsRouter = express_1.default.Router();
exports.itemsRouter.post('/Days', server_1.ondays);
exports.itemsRouter.get('/GetAppointment', server_1.GetAppointment);
