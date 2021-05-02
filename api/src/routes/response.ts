import { Response, Request, response } from "express"
// import { Schema } from "mongoose"
import * as mongo from "../config/mongo"
import FormResponse from "../models/response"
import { Form } from "../models/form"

//Download csv
const fileSystem = require("fs")
const fastcsv = require("fast-csv")
const download = require("download")
import { User } from "../models/user"
import { Question } from "../models/question"
import mongoose, { Schema, Document } from "mongoose"

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
    try {
        let formResponses = await FormResponse.find({
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

//Coverting Response to .csv and then downloading

export const downloadResponse = async (req: Request, res: Response) => {
    // await mongo.connectMongo()
    let formId = req.params.formid
    console.log(req.params.formid)

    //resp will store array of responses
    let resp = await FormResponse.find({
        formId: formId,
    })

    //Using map to avoid frequent query and to store map of question id and question text which will be shown in .csv
    let quesidtotext: any = new Map()
    let form
    if (formId.match(/^[0-9a-fA-F]{24}$/)) {
        form = await Form.findOne({ _id: formId }).populate(
            "questions",
            "question_text"
        )
        if (form) {
            let questions = form.questions
            for (let i in questions) {
                quesidtotext[String(questions[i]._id)] =
                    questions[i].question_text
                console.log(quesidtotext[questions[i]._id])
            }
        } else {
            res.send({ success: false, data: "No Form found" })
        }

        // console.log("form is ")
        // console.log(form)

        let temp
        let data = []
        //here we are extracting answer from array of responses->resp and storing in data which will be used in converting to .csv
        //For now just shortText and paragraphText type is implemented
        for (let i = 0; i < resp.length; i++) {
            temp = resp[i].responses
            let datarow
            datarow = { Name: resp[i].username }
            for (let j = 0; j < temp.length; j++) {
                let str = quesidtotext[temp[j].questionId]
                if (temp[j].shortText) {
                    let test: any = {}
                    test[str] = temp[j].shortText
                    datarow = { ...datarow, ...test }
                }
                if (temp[j].paragraphText) {
                    let test: any = {}

                    test[str] = temp[j].paragraphText
                    datarow = { ...datarow, ...test }
                }
            }
            data.push(datarow)
        }

        console.log(data)

        //Converting data to .csv and writting to a file
        if (data) {
            var ws = fileSystem.createWriteStream(
                "./src/responsedownload/data.csv"
            )
            fastcsv
                .write(data, { headers: true })
                .on("finish", function () {
                    res.send("Downloaded")

                    //!!!!!Download .csv file
                    //Need help
                    //!!!!!Below res.download()  is not working properly

                    // res.download('./src/responsedownload/data.csv')
                })
                .pipe(ws)
        } else {
            res.send({ success: false, data: "No Form found" })
        }
    } else {
        console.log("Invalid form id")
        res.send({ success: false, data: "InValid Form Id" })
    }
}
export const getResponsesByIndividualByFormId = async (
    req: Request,
    res: Response
) => {
    await mongo.connectMongo()
    let formId = req.params.formId
    let userId = req.params.userId
    console.log(userId)
    console.log(formId)
    try {
        let formIndividualResponses = await FormResponse.find({
            formId: formId,
            userid: userId,
        })
        res.send(formIndividualResponses)
    } catch (error) {
        res.send("error")
    }
}

//some issue with query its returning all forms i only want by questionid
export const getResponsesByQuestionsByForm = async (
    req: Request,
    res: Response
) => {
    await mongo.connectMongo()
    let quesId = req.params.questionId
    let formResponses: any
    try {
        formResponses = await FormResponse.find({
            // "responses.questionId":quesId
            // responses: { $elemMatch: { questionId: quesId } },
             "responses": { $elemMatch: { questionId: quesId } },
        })
        res.send(formResponses)
    } catch (error) {
        res.send(error + "uhhhh")
    }
}
