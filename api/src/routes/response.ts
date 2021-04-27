import { Response, Request } from "express"
import { Schema } from "mongoose"
import * as mongo from "../config/mongo"
import FormResponse from "../models/response"

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
    //WILL DO
    // try {
    //     let formResponse = await FormResponse.findOne({
    //         formId: req.params.formid,
    //     })
    //     return res.send(formResponse)
    // } catch (error) {
    //     res.send(error)
    //     console.error(error)
    // }
}
