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
            }
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
            }
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
            }
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
            }
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
            }
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
            }
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
            }
        }
    ],
    isDeleted: {
        type: Boolean,
        //enum:[true,false],
        default: false
        //enum:[true,false]
    }
});
exports.default = (0, mongoose_1.model)("DaysModel", daysSchema);
