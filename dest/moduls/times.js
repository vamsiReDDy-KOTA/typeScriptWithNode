"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const timesSchema = new mongoose_1.Schema({
    startTime: {
        type: String,
        required: true
    },
    endTime: {
        type: String,
        required: true
    }
});
exports.default = (0, mongoose_1.model)("TimesModel", timesSchema);
