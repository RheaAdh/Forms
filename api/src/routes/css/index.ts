const express = require("express")
const path = require("path")
import { Request, Response } from "express"

const router = express().Router()

router.get("/main", (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, "main.css"))
})

router.get("/displayForm", (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, "DisplayForms.css"))
})

export default router
