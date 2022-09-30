"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
//import { string } from "joi";
//const {} = mongoose.Schema;
const menuSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    //type : Schema.Types.ObjectId,
    references: { type: [mongoose_1.Schema.Types.ObjectId], refPath: 'days' },
    model_type: { type: String, enum: ['days'] }
    //ref:days
    ,
    description: {
        type: String,
        required: true,
    },
    dateOfAppointment: {
        type: String,
        required: true
    },
    DateYouBooked: {
        type: Date,
        required: true
    },
    conformBooking: {
        type: String,
        required: true
    }
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("AppointModel", menuSchema);
