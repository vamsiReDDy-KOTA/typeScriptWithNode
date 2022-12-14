"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.itemsRouter = void 0;
/* eslint-disable @typescript-eslint/no-unused-vars */
const express_1 = __importDefault(require("express"));
const token_1 = __importDefault(require("../mid/token"));
const roles_1 = require("../mid/roles");
const profile_1 = require("../mid/profile");
const bookings_1 = require("../controllers/bookings");
const admin_1 = require("../controllers/admin");
const user_1 = require("../controllers/user");
const staff_1 = require("../controllers/staff");
const Appointments_1 = require("../controllers/Appointments");
exports.itemsRouter = express_1.default.Router();
//user
exports.itemsRouter.post('/Signup', user_1.signup);
exports.itemsRouter.post('/Signin', user_1.signin);
exports.itemsRouter.put('/updateuser', token_1.default, user_1.updateuser);
exports.itemsRouter.delete('/logout', token_1.default, user_1.logout);
exports.itemsRouter.put('/profilePic', token_1.default, profile_1.upload, user_1.profile);
exports.itemsRouter.get('/logingetuser', token_1.default, user_1.logingetuser);
exports.itemsRouter.delete('/deleteuser/:id', token_1.default, user_1.deleteuser);
//Admin
exports.itemsRouter.get('/getallstaffs', token_1.default, roles_1.isAdmin, admin_1.getallstaffs);
exports.itemsRouter.get('/getallusers', token_1.default, roles_1.isAdmin, admin_1.getallusers);
exports.itemsRouter.put('/updatealluser', token_1.default, roles_1.isAdmin, admin_1.updatealluser);
exports.itemsRouter.put('/updateallstaff', token_1.default, roles_1.isAdmin, admin_1.updateallstaff);
exports.itemsRouter.delete('/deletealluser/:id', token_1.default, roles_1.isAdmin, admin_1.deletealluser);
exports.itemsRouter.delete('/deleteallstaff/:id', token_1.default, roles_1.isAdmin, admin_1.deleteallstaff);
//staff
exports.itemsRouter.post('/StaffWorkingHours', token_1.default, roles_1.isStaff, staff_1.ondays);
exports.itemsRouter.put('/updateStaff', token_1.default, roles_1.isStaff, staff_1.updateSlot);
exports.itemsRouter.delete('/DeleteStaff/:id', token_1.default, roles_1.isStaff, staff_1.DaysSoftDelete);
exports.itemsRouter.get('/getStaff', token_1.default, roles_1.isStaff, staff_1.getDaysByEmail);
//availabul slots
exports.itemsRouter.get('/getAppointment', token_1.default, Appointments_1.GetAppointment);
//booking
exports.itemsRouter.post('/booking', token_1.default, bookings_1.bookingSlots);
exports.itemsRouter.put('/updateBooking', token_1.default, bookings_1.updateBooking);
exports.itemsRouter.get('/getBookingsByEmail', token_1.default, bookings_1.getBookingsByEmail);
exports.itemsRouter.delete('/DeleteBooking/:id', token_1.default, bookings_1.softDelete);
