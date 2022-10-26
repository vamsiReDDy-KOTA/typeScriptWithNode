import express, { Request, Response } from "express";
import * as ItemService from "./server";
import { BaseItem, Item } from "./module";
import Joi, { any } from "joi";
import * as Fs from "fs";
import { addModel, getApp, getSE, ondays, send,GetAppointment } from "./server";


export const itemsRouter = express.Router();

itemsRouter.post('/Days',ondays)
itemsRouter.get('/GetAppointment',GetAppointment)