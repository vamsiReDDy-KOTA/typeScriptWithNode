"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const daysSchema = new mongoose_1.Schema({
    TimeZone: {
        type: String,
        required: true
    },
    Monday: [
        {
            startTime: {
                type: String,
                required: true
            },
            endTime: {
                type: String,
                required: true
            }
        }
    ],
    Tuesday: [
        {
            startTime: {
                type: String,
                required: true
            },
            endTime: {
                type: String,
                required: true
            }
        }
    ],
    Wednesday: [
        {
            startTime: {
                type: String,
                required: true
            },
            endTime: {
                type: String,
                required: true
            }
        }
    ],
    Thursday: [
        {
            startTime: {
                type: String,
                required: true
            },
            endTime: {
                type: String,
                required: true
            }
        }
    ],
    Friday: [
        {
            startTime: {
                type: String,
                required: true
            },
            endTime: {
                type: String,
                required: true
            }
        }
    ],
    saturday: [
        {
            startTime: {
                type: String,
                required: true
            },
            endTime: {
                type: String,
                required: true
            }
        }
    ],
    sunday: [
        {
            startTime: {
                type: String,
                required: true
            },
            endTime: {
                type: String,
                required: true
            }
        }
    ]
    //sunday : {
    //          type: mongoose.Schema.Types.ObjectId,
    //        ref:times,
    //required:true
    //}
});
exports.default = (0, mongoose_1.model)("DaysModel", daysSchema);
