const express = require("express")
import { Response, Request } from "express"
const router = express.Router()
const uploads = require("../utils/uploadfile")

const singleUpload = uploads.single("image")

export async function imageUpload(req: Request, res: Response) {
    singleUpload(req, res, () => {
        return res.json({
            // imageUrl: req.file.location,
        })
    })
}

module.exports = router
