//import multer from "multer";
import { Request } from 'express'
import { mkdir } from 'fs'
import multer, { FileFilterCallback } from 'multer'

type DestinationCallback = (error: Error | null, destination: string) => void
type FileNameCallback = (error: Error | null, filename: string) => void
/** 
const storages = multer.diskStorage({
    destination: (req:Request, file:any, cb:any) => {
      cb(null, "./uploads/");
    },
    filename: (req:Request, file:any, cb:any) => {
      //const fileName = file.originalname.toLowerCase().split(" ").join("-");
      cb(null, file.originalname);
    },
  });
  var uploaed = multer({
    storages: storages,
    limits: {
      fileSize: 1024 * 1024 * 15 * 2,
    },
    fileFilter: (req, file, cb) => {
      if (
        file.mimetype == "image/png" ||
        file.mimetype == "image/jpg" ||
        file.mimetype == "image/jpeg"
      ) {
        cb(null, true);
      } else {
        cb(null, false);
        return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
      }
    },
  }).single("image");

  */

const storage = multer.diskStorage({
    destination: function (req: Request, _file: any, cb: any) {
        const dir = './uploads/';
        filename: (req:Request, file:any, cb:any) => {
            cb(null, dir)
        };
    },
    filename: function (_req: Request, file: any, cb: any) {
        cb(null, file.originalname)
    }
});

const upload = multer({
    storage: storage,

    limits: {
        fileSize: 1024 * 1024 * 15 * 2,
      },
      fileFilter: (req, file, cb) => {
        if (
          file.mimetype == "image/png" ||
          file.mimetype == "image/jpg" ||
          file.mimetype == "image/jpeg"
        ) {
          cb(null, true);
        } else {
          cb(null, false);
          return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
        }
      },
}).single("image");

/**
 * 
 
export const fileStorage = multer.diskStorage({
    destination: (
        request: Request,
        file: Express.Multer.File,
        callback: DestinationCallback
    ): void => {
        // ...Do your stuff here.
    },

    filename: (
        req: Request, 
        file: Express.Multer.File, 
        callback: FileNameCallback
    ): void => {
        // ...Do your stuff here.
    }
})
export const fileFilter = (
    request: Request,
    file: Express.Multer.File,
    callback: FileFilterCallback
): void => {
    if (
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg'
    ) {
        callback(null, true)
    } else {
        callback(null, false)
    }
}
*/

  export {upload}