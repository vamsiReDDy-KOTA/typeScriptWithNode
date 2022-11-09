"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const daysSchema = new mongoose_1.Schema({
    TimeZone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    phoneNo: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    StartDate: {
        type: Date,
        required: true
    },
    repectForWeek: {
        type: Boolean,
        default: false
    },
    Monday: [
        {
            startTime: {
                type: Array,
                required: true
            },
            endTime: {
                type: Array,
                required: true
            },
            breakTime: {
                type: Array,
                required: true
            },
            available: { type: Boolean, default: false }
        }
    ],
    Tuesday: [
        {
            startTime: {
                type: Array,
                required: true
            },
            endTime: {
                type: Array,
                required: true
            },
            breakTime: {
                type: Array,
                required: true
            },
            available: { type: Boolean, default: false }
        }
    ],
    Wednesday: [
        {
            startTime: {
                type: Array,
                required: true
            },
            endTime: {
                type: Array,
                required: true
            },
            breakTime: {
                type: Array,
                required: true
            },
            available: { type: Boolean, default: false }
        }
    ],
    Thursday: [
        {
            startTime: {
                type: Array,
                required: true
            },
            endTime: {
                type: Array,
                required: true
            },
            breakTime: {
                type: Array,
                required: true
            },
            available: { type: Boolean, default: false }
        }
    ],
    Friday: [
        {
            startTime: {
                type: Array,
                required: true
            },
            endTime: {
                type: Array,
                required: true
            },
            breakTime: {
                type: Array,
                required: true
            },
            available: { type: Boolean, default: false }
        }
    ],
    Saturday: [
        {
            startTime: {
                type: Array,
                required: true
            },
            endTime: {
                type: Array,
                required: true
            },
            breakTime: {
                type: Array,
                required: true
            },
            available: { type: Boolean, default: false }
        }
    ],
    Sunday: [
        {
            startTime: {
                type: Array,
                required: true
            },
            endTime: {
                type: Array,
                required: true
            },
            breakTime: {
                type: Array,
                required: true
            },
            available: { type: Boolean, default: false }
        }
    ],
    isDeleted: {
        type: Boolean,
        default: false
    }
});
exports.default = (0, mongoose_1.model)("DaysModel", daysSchema);
