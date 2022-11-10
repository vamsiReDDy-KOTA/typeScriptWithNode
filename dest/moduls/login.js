"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const SigninSchema = new mongoose_1.Schema({
    image: {
        type: String,
        default: 'null'
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
    role: {
        type: String,
        enum: ['user', 'admin', 'staff'],
        default: 'staff'
    },
    tokens: [{
            accessToken: {
                type: String,
                required: false
            },
            refreshToken: {
                type: String,
                required: false
            }
        }]
});
exports.default = (0, mongoose_1.model)("SigninDt", SigninSchema);
