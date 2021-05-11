const express = require("express")
import { Response, Request } from "express"
const router = express.Router()
var aws = require("aws-sdk")
var multer = require("multer")
var multerS3 = require("multer-s3")

aws.config.update({
    secretAcccessKey: process.env.SECRET_ACCESS_KEY,
    accessKeyId: process.env.ACCESS_KEY_ID,
    region: process.env.REGION,
})

//CREATING S3 INSTANCE
var s3 = new aws.S3()

var upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: "iecses-forms-bucket",
        metadata: function (req: Request, file:any, cb:any) {
            cb(null, { fieldName: "TESTING" })
        },
        key: function (req: Request, file:any, cb:any) {
            cb(null, Date.now().toString())
        },
    }),
})

// app.post("/upload", upload.array("photos", 3), function (req, res, next) {
//     res.send("Successfully uploaded " + req.files.length + " files!")
// })

module.exports = upload
