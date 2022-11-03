"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.itemsRouter = void 0;
const express_1 = __importDefault(require("express"));
const token_1 = __importDefault(require("../mid/token"));
const isAdmin_1 = __importDefault(require("../mid/isAdmin"));
const server_1 = require("./server");
exports.itemsRouter = express_1.default.Router();
exports.itemsRouter.post('/Signup', server_1.signup);
exports.itemsRouter.post('/Signin', server_1.signin);
exports.itemsRouter.put('/updateuser', token_1.default, server_1.updateuser);
exports.itemsRouter.get('/logingetuser', server_1.logingetuser);
exports.itemsRouter.get('/getallstaffs', token_1.default, isAdmin_1.default, server_1.getallstaffs);
exports.itemsRouter.delete('deleteuser', server_1.deleteuser);
exports.itemsRouter.post('/Days', server_1.ondays);
exports.itemsRouter.get('/GetAppointment', server_1.GetAppointment);
exports.itemsRouter.put('/updateSlot', server_1.updateSlot);
exports.itemsRouter.post('/booking', server_1.bookingSlots);
exports.itemsRouter.put('/updateBooking', server_1.updateBooking);
exports.itemsRouter.get('/getBookingsByEmail', server_1.getBookingsByEmail);
exports.itemsRouter.get('/getDaysByEmail', server_1.getDaysByEmail);
exports.itemsRouter.delete('/DeleteBooking/:id', server_1.softDelete);
exports.itemsRouter.delete('/DeleteStaff/:id', server_1.DaysSoftDelete);
