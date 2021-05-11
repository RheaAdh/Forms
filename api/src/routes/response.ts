import e, { Response, Request, response } from "express"
import mongoose, { Schema, Document } from "mongoose"
import FormResponse from "../models/response"
import { Form } from "../models/form"

//Download csv
const fileSystem = require("fs")
const fastcsv = require("fast-csv")
const download = require("download")

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
    console.log("POST REQUEST WAS MADE for submit response")
    let { username, userid, formId, responses } = req.body
    //Checking if form isActive
    let form: any = await Form.findOne({ _id: formId })
    console.log(form)
    if (form.isActive) {
        console.log("Inside Active")
        let response = await FormResponse.findOne({
            userid: req.session.userId,
            formId,
        })
        //When form has no submission
        if (!response) {
            console.log("No resp")
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
        } else if (form.isEditable) {
            //When form has a submission and editing is allowed
            try {
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
                console.log("Response Updated when editing was allowed")
                res.send({ success: true, data: "Response Updated" })
            } catch (err) {
                res.send({ success: false, data: err })
            }
        } //when for has submission but editing is not allowed but multiple response by single user is allowed
        else if (form.multipleResponses) {
            try {
                const formResponse = new FormResponse({
                    username,
                    userid,
                    formId,
                    responses,
                })
                await formResponse.save()
                console.log("Response added!")
                console.log("Submitting another Response by the user")
                res.send({ success: true, data: "Response submitted " })
            } catch (error) {
                res.send({ success: false, data: error })
            }
        } //when form has submission but neither edit is allowed nor multiple responses
        else {
            console.log(
                "Form is noneditable and multiple responses are also not allowed"
            )
            res.send({
                success: false,
                data:
                    "Form is noneditable and multiple responses are also not allowed",
            })
        }
    } else {
        console.log("Form is not active")
        res.send({
            success: false,
            data: "Form is closed, Please try contacting Admin",
        })
    }
}

export const getResponsesByForm = async (req: Request, res: Response) => {
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
    try {
        let creatorId = req.params.creatorId
        let usersForms: any
        usersForms = await Form.find({ owner: creatorId })
        res.send(usersForms)
    } catch (error) {
        return res.send({ sucess: false, msg: error })
    }
}

//Coverting Response to .csv and then downloading

export const downloadResponse = async (req: Request, res: Response) => {
    //
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
        return res.send({ success: false, data: "InValid Form Id" })
    }
}
export const getResponsesByIndividualByFormId = async (
    req: Request,
    res: Response
) => {
    try {
        let formId = req.params.formId
        let userId = req.params.userId
        let formIndividualResponses = await FormResponse.find({
            formId: formId,
            userid: userId,
        })
        return res.send(formIndividualResponses)
    } catch (error) {
        return res.send({ success: false, data: error })
    }
}

export const getResponsesByQuestionsByForm = async (
    req: Request,
    res: Response
) => {
    try {
        let quesId = req.params.questionId
        let formResponses: any
        formResponses = await FormResponse.find({
            responses: { $elemMatch: { questionId: quesId } },
        }).select("responses")
        console.log(formResponses[0]);
        
        let ans: any = []

        
        for (let i = 0; i < formResponses.length; i++) {
            for (let j = 0; j < formResponses[i].responses.length; j++) {
                if (formResponses[i].responses[j].questionId == quesId) {
                    let answerType = formResponses[i].responses[j].answerType
                    console.log(answerType)
                    switch (answerType) {
                        case "paragraph-answer":
                            if (formResponses[i].responses[j].paragraphText) {
                                ans.push(
                                    formResponses[i].responses[j].paragraphText
                                )
                            } else ans.push("(null)")
                            break
                        case "short-answer":
                            if (formResponses[i].responses[j].shortText) {
                                ans.push(
                                    formResponses[i].responses[j].shortText
                                )
                            } else ans.push("(null)")
                            break
                        case "email-answer":
                            if (formResponses[i].responses[j].emailAnswer) {
                                ans.push(
                                    formResponses[i].responses[j].emailAnswer
                                )
                            } else ans.push("(null)")
                            break
                        case "mcq-answer":
                            if (formResponses[i].responses[j].selectedOption) {
                                ans.push(
                                    formResponses[i].responses[j].selectedOption
                                )
                            } else ans.push("(null)")
                            break
                        case "checkbox-answer":
                            if (
                                formResponses[i].responses[j].multipleSelected
                            ) {
                                ans.push(
                                    formResponses[i].responses[j]
                                        .multipleSelected
                                )
                            } else ans.push("(null)")
                            break
                        case "dropdown-answer":
                            if (formResponses[i].responses[j].selectedOption) {
                                ans.push(
                                    formResponses[i].responses[j].selectedOption
                                )
                            } else ans.push("(null)")
                            break
                        case "linearscale-answer":
                            if (formResponses[i].responses[j].selectedOption) {
                                ans.push(
                                    formResponses[i].responses[j].selectedOption
                                )
                            } else ans.push("(null)")
                            break
                        case "multiplechoicegrid-answer":
                            if (
                                formResponses[i].responses[j]
                                    .selectedOptionsGrid
                            ) {
                                ans.push(
                                    formResponses[i].responses[j]
                                        .selectedOptionsGrid
                                )
                            } else ans.push("(null)")
                            break
                        case "multiplechoicegrid-answer":
                            if (
                                formResponses[i].responses[j]
                                    .selectedOptionsGrid
                            ) {
                                ans.push(
                                    formResponses[i].responses[j]
                                        .selectedOptionsGrid
                                )
                            } else ans.push("(null)")
                            break
                        case "date-answer":
                            if (formResponses[i].responses[j].selectedDate) {
                                ans.push(
                                    formResponses[i].responses[j].selectedDate
                                )
                            } else ans.push("(null)")
                            break
                        case "time-answer":
                            if (
                                formResponses[i].responses[j].timeHours &&
                                formResponses[i].responses[j].timeMinutes
                            ) {
                                ans.push({
                                    timeHours:
                                        formResponses[i].responses[j].timeHours,
                                    timeMinutes:
                                        formResponses[i].responses[j]
                                            .timeMinutes,
                                })
                            } else ans.push("(null)")
                            break
                    }
                }
            }
        }
        return res.send(ans)
    } catch (error) {
        return res.send({ success: false, data: error })
    }
}
