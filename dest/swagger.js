"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const app = (0, express_1.default)();
const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "REST API Docs",
            version: '1.0',
        },
        components: {
            securitySchemas: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ['src/apis/**/*.controller.ts', 'src/schemas/*.schema.ts'],
};
const swaggerDocs = (0, swagger_jsdoc_1.default)(swaggerOptions);
app.use("/docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocs, { explorer: true }));
exports.default = swaggerDocs;
