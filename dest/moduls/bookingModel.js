"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const bookingmodels = new mongoose_1.Schema({
    TimeZone: {
        type: String,
        required: true
    },
    SlotsTime: {
        type: Array,
        required: true
    },
    Service: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    Name: {
        type: String,
        required: true
    },
    Duerication: {
        type: String,
        required: true
    },
    AppointmentDate: {
        type: String,
        required: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
});
exports.default = (0, mongoose_1.model)("BookingModel", bookingmodels);
