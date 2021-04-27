import { Response, Request, response } from "express"
import { Schema } from "mongoose"
import * as mongo from "../config/mongo"
import FormResponse from "../models/response"
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
export const submitResponse = async (req: Request, res: Response) => {
    await mongo.connectMongo()
    console.log("POST REQUEST WAS MADE for submit response")
    let { username, userid, formId, responses } = req.body
    //if form is already submitted by user then updating
    let resp = await FormResponse.findOneAndUpdate(
        {
            userid: req.session.userId,
            formId,
        },
        {
            $set: {
                username,
                userid,
                formId,
                responses,
            },
        }
    )
    console.log("RESP is ")
    console.log(resp)
    //If not submitted then saving as new response
    if (!resp) {
        try {
            const formResponse = new FormResponse({
                username,
                userid,
                formId,
                responses,
            })
            await formResponse.save()
            console.log("Response added!")
            res.send({ success: true, data: "Response submitted" })
        } catch (error) {
            res.send({ success: false, data: error })
        }
    } else {
        console.log("Response Updated")
        res.send({ success: true, data: "Response Updated" })
    }
}

export const getResponsesByForm = async (req: Request, res: Response) => {
    await mongo.connectMongo()
    let formId = req.params.formId
    let formResponses: any
    try {
        let formResponses = await FormResponse.findOne({
            formId: formId,
        })
        res.send(formResponses)
    } catch (error) {
        res.send("error")
    }
}
export const getFormsByCreator = async (req: Request, res: Response) => {
    await mongo.connectMongo()
    let creatorId = req.params.creatorId
    let usersForms: any
    try {
        usersForms = await Form.find({ owner: creatorId })
        res.send(usersForms)
    } catch (error) {
        res.send("error")
    }
}
