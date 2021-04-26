import { Response, Request } from "express"
import { Schema } from "mongoose"
import * as mongo from "../config/mongo"
import FormResponse from "../models/response"

export const submitResponse = async (req: Request, res: Response) => {
    await mongo.connectMongo()
    console.log("POST REQUEST WAS MADE for submit response")
    const formResponse = new FormResponse(req.body)
    console.log(formResponse)
    try {
        await formResponse.save()
        console.log("Response added!")
        res.send({ success: true, data: "Response submitted" })
    } catch (error) {
        res.send({ success: false, data: error })
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
