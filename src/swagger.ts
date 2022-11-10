/* eslint-disable @typescript-eslint/no-unused-vars */
import express, { Request, Response } from "express";

import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from 'swagger-jsdoc'    

const app = express()

const swaggerOptions: swaggerJsdoc.Options = {
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
const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocs, { explorer: true })
);

export default swaggerDocs