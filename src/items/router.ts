import express, { Request, Response } from "express";
import * as ItemService from "./server";
import { BaseItem, Item } from "./module";
import Joi, { any } from "joi";
import * as Fs from "fs";


export const itemsRouter = express.Router();

itemsRouter.post("/", async (req: Request, res: Response) => {
   
    const AS = /^[a-z ]+$/i;
    try {
      const item: BaseItem = req.body;
      const nDate = new Date().toLocaleString('en-US', {
        timeZone: req.body.DateYouBooked
      });
      console.log(nDate);
      const schema = Joi.object().keys({
        name: Joi.string().regex(AS).min(3).max(30).required(),
        bookingId: Joi.number().required(),
        StartTime:Joi.string(),
        EndTime:Joi.string(),
        dateOfAppointment: Joi.date().required().min(nDate),
        DateYouBooked:Joi.string()
      });
      
      schema
        .validateAsync(item)
        .then((val) => {
          req.body = val;
          const item = {
            DateYouBooked:new Date().toLocaleString('en-US', {
                timeZone: req.body.DateYouBooked
              }),
            dateOfAppointment:req.body.dateOfAppointment,
            name: req.body.name,
            StartTime:req.body.StartTime,
            EndTime:req.body.EndTime,
            bookingId:req.body.bookingId
          };
          const vams = ItemService.create(item);
          res.status(200).send("you have booked appointment");
        })
        .catch((err) => {
          res.status(400).send("Failed to validate input " + err);
          console.log(err);
        });
    } catch (e) {
      res.status(500).send("internal error");
    }
  })