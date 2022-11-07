"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const SignupSchema = new mongoose_1.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    image: {
        krishna: String,
        contentType: String,
        //default:"none"
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    confirmPassword: {
        type: String,
        required: true
    },
    // isAdmin: {
    //       type:Boolean,
    //       default: false,
    // },
    role: {
        type: String,
        enum: ['user', 'admin', 'staff'],
        default: 'staff'
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
});
exports.default = (0, mongoose_1.model)("SignupDt", SignupSchema);
