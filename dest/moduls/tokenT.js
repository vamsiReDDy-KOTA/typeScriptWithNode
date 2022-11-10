"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const TokenSchema = new mongoose_1.Schema({
    token: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['A', 'D'],
        default: 'A'
    },
    userId: {
        type: String,
        required: true
    },
});
exports.default = (0, mongoose_1.model)("TokenDt", TokenSchema);
