"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
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
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
const upload = (0, multer_1.default)({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 15 * 2,
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" ||
            file.mimetype == "image/jpg" ||
            file.mimetype == "image/jpeg") {
            cb(null, true);
        }
        else {
            cb(null, false);
            return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
        }
    },
}).single("image");
exports.upload = upload;
