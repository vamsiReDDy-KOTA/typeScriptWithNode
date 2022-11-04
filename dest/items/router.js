"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.itemsRouter = void 0;
const express_1 = __importDefault(require("express"));
const token_1 = __importDefault(require("../mid/token"));
const roles_1 = require("../mid/roles");
const server_1 = require("./server");
exports.itemsRouter = express_1.default.Router();
//user
exports.itemsRouter.post('/Signup', server_1.signup);
exports.itemsRouter.post('/Signin', server_1.signin);
exports.itemsRouter.put('/updateuser', token_1.default, server_1.updateuser);
exports.itemsRouter.get('/logingetuser', token_1.default, server_1.logingetuser);
exports.itemsRouter.delete('/deleteuser/:id', token_1.default, server_1.deleteuser);
//Admin
exports.itemsRouter.get('/getallstaffs', token_1.default, roles_1.isAdmin, server_1.getallstaffs);
exports.itemsRouter.get('/getallusers', token_1.default, roles_1.isAdmin, server_1.getallusers);
exports.itemsRouter.put('/updatealluser', token_1.default, roles_1.isAdmin, server_1.updatealluser);
//staff
exports.itemsRouter.post('/Days', token_1.default, roles_1.isStaff, server_1.ondays);
exports.itemsRouter.put('/updateSlot', token_1.default, roles_1.isStaff, server_1.updateSlot);
exports.itemsRouter.delete('/DeleteStaff/:id', token_1.default, roles_1.isStaff, server_1.DaysSoftDelete);
exports.itemsRouter.get('/getDaysByEmail', token_1.default, roles_1.isStaff, server_1.getDaysByEmail);
exports.itemsRouter.get('/getAppointment', token_1.default, server_1.GetAppointment);
//booking
exports.itemsRouter.post('/booking', token_1.default, server_1.bookingSlots);
exports.itemsRouter.put('/updateBooking', token_1.default, server_1.updateBooking);
exports.itemsRouter.get('/getBookingsByEmail', token_1.default, server_1.getBookingsByEmail);
exports.itemsRouter.delete('/DeleteBooking/:id', token_1.default, server_1.softDelete);
