import mongoose, { Document, Mongoose, Schema, Types } from "mongoose"
import { Response, Request, NextFunction } from "express"
import * as mongo from "../config/mongo"
import { Theme } from "../models/theme"
import { Form } from "../models/form"
declare module "express-session" {
    interface Session {
        isAuth: boolean
        userId: Schema.Types.ObjectId
        role: String
        email: String
        username: String
    }
}
export async function getAllThemes(req: Request, res: Response) {
    try {
        let allThemes = await Theme.find({}).exec()
        return res.send({ sucess: true, data: allThemes })
    } catch (err) {
        return res.send({ sucess: false, data: err })
    }
}

export async function getTheme(req: Request, res: Response) {
    try {
        let themeId = req.params.themeId
        let selectedTheme = await Theme.find({ _id: themeId })
        return res.send({ sucess: true, data: selectedTheme })
    } catch (err) {
        return res.send({ sucess: false, data: err })
    }
}

export async function addTheme(req: any, res: Response) {
    try {
        let newTheme: any
        newTheme = new Theme({
            bgImage: req.body.bgImage,
            bgColor: req.body.bgColor,
            fontColor: req.body.fontColor,
        })
        const theme = await newTheme.save()
        return res.send({ sucess: true, data: newTheme })
    } catch (err) {
        return res.send({ sucess: false, data: err })
    }
}

export async function updateTheme(req: Request, res: Response) {
    try {
        let themeId = req.params.themeId
        console.log(req.body)

        let updatedTheme = await Theme.findOneAndUpdate(
            { _id: themeId },
            { ...req.body }
        )
        return res.send({ sucess: true, msg: "Theme updated successfully" })
    } catch (err) {
        return res.send({ sucess: false, data: err })
    }
}

export async function deleteTheme(req: Request, res: Response) {
    try {
        let themeId = req.body._id
        let deletedTheme = await Theme.deleteOne({ _id: themeId })
        return res.send({ sucess: true, data: deletedTheme })
    } catch (err) {
        return res.send({ sucess: false, data: err })
    }
}

//update form
export async function useTheme(req: Request, res: Response) {
    try {
        let updatedForm: any
        let formId = req.params.formId
        updatedForm = await Form.findOneAndUpdate(
            { _id: formId },
            {
                ...req.body,
                theme: req.body.themeId,
            },
            { new: true }
        )
        return res.send({ sucess: true, data: updatedForm })
    } catch (error) {
        return res.send({ success: false, msg: error })
    }
}
