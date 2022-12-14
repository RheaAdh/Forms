import e, { Response, Request, response } from "express"
import mongoose, { Schema, Document } from "mongoose"
import FormResponse from "../models/response"
import { Form } from "../models/form"
import { resolve } from "path"
import { read } from "fs"
import { updateSheet } from "./googlesheet"
import { mailHTMLResponse } from "./responseMail/template"

// import nodemailer from "nodemailer"
const nodemailer = require("nodemailer")

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
    let {
        responses,
        sendMail,
        submitted,
        formFromClient,
        responseFromClient,
        questionsFromClient,
    } = req.body
    const mailHTML = mailHTMLResponse(
        formFromClient,
        questionsFromClient,
        responseFromClient
    )
    console.log(mailHTML)
    let formId = req.params.formId
    const username = req.session.username as string
    const userid = req.session.userId
    let form: any = await Form.findOne({ _id: formId })
    var presentDateTime: Date = new Date()
    let presentIST = new Date().toLocaleString(undefined, {
        timeZone: "Asia/Kolkata",
    })
    //Checking for closing date time
    if (form.closes !== null && form.closes <= presentDateTime) {
        console.log("Form closed")
        form.isActive = false
    }

    if (form.isTemplate) {
        return res.status(400).send({
            success: false,
            msg: "Cannot submit response in a template,try creating form",
        })
    }

    //Checking if form isActive
    if (form.isActive) {
        console.log("Inside Active")
        let response = await FormResponse.findOne({
            userid: req.session.userId,
            formId,
        })
        //When form has no submission
        let newresp
        if (!response) {
            console.log("No resp")
            try {
                const formResponse = new FormResponse({
                    username,
                    userid,
                    formId,
                    responses,
                    submitted,
                    submitTime: presentIST,
                })
                console.log(responses)
                newresp = await formResponse.save()
                console.log("Response added!")
                if (sendMail && submitted) emailResponse(mailHTML, req.session)
                if (form.sheetId && submitted) updateSheet(form._id)
                res.send({ success: true, data: "Response submitted" })
            } catch (error) {
                console.log(error)
                return res
                    .status(500)
                    .send({ success: false, data: "Server Error" })
            }
        } else if (form.isEditable || response.submitted === false) {
            //When form has a submission and editing is allowed
            try {
                let newresp = await FormResponse.findOneAndUpdate(
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
                            submitted,
                            submitTime: presentIST,
                        },
                    }
                )
                console.log("RESP is ")
                console.log(newresp)
                console.log("Response Updated when editing was allowed")
                if (sendMail && submitted) emailResponse(mailHTML, req.session)
                if (form.sheetId && submitted) updateSheet(form._id)
                res.send({ success: true, data: "Response Updated" })
            } catch (err) {
                console.log(err)
                return res
                    .status(200)
                    .send({ success: false, data: "Server Error" })
            }
        } //when form has submission but editing is not allowed but multiple response by single user is allowed
        else if (form.multipleResponses) {
            try {
                //Multiple Response in anonymous forms
                if (form.anonymous) {
                    console.log(
                        "Submitting Multiple response to anonymous forms"
                    )
                    const formResponse = new FormResponse({
                        username,
                        userid,
                        formId,
                        responses,
                        submitted,
                        submitTime: presentIST,
                    })
                    formResponse.submitted = true
                    newresp = await formResponse.save()
                    console.log("Response added!")
                    res.status(200).send({
                        success: true,
                        data: "Response submitted ",
                    })
                    if (sendMail && submitted)
                        emailResponse(mailHTML, req.session)
                    if (form.sheetId && submitted) updateSheet(form._id)
                } else {
                    //Multiple Response in non-anonymous forms with a limit in form submission per user
                    let responseCount = await FormResponse.find({
                        userid: req.session.userId,
                        formId,
                    }).countDocuments()
                    console.log(responseCount)
                    if (
                        responseCount <= Number(process.env.LIMIT_MULTIPLE_RESP)
                    ) {
                        const formResponse = new FormResponse({
                            username,
                            userid,
                            formId,
                            responses,
                            submitted: true,
                            submitTime: presentIST,
                        })
                        formResponse.submitted = true
                        // formResponse.submitTime = presentDateTime
                        newresp = await formResponse.save()
                        console.log("Response added!")
                        console.log("Submitting another Response by the user")
                        res.status(200).send({
                            success: true,
                            data: "Response submitted ",
                        })

                        if (sendMail && submitted)
                            emailResponse(mailHTML, req.session)
                        if (form.sheetId && submitted) updateSheet(form._id)
                    } else {
                        console.log("Response Limit Reached")
                        return res.status(400).send({
                            success: false,
                            msg: `Maximum Response Limit ${process.env.LIMIT_MULTIPLE_RESP} reached, try contacting Admin for further details`,
                        })
                    }
                }
            } catch (error) {
                console.log("Server Error")
                res.status(500).send({ success: false, data: "Server Error" })
            }
        } //when form has submission but neither edit is allowed nor multiple responses
        else if (response?.submitted) {
            console.log(
                "Form is noneditable and multiple responses are also not allowed"
            )
            res.status(400).send({
                success: false,
                data:
                    "Form is noneditable and multiple responses are also not allowed",
            })
        }
    } else {
        console.log("Form is not active")
        res.status(400).send({
            success: false,
            data: "Form is closed, Please try contacting Admin",
        })
    }
}

export const getResponsesByForm = async (req: Request, res: Response) => {
    let formId = req.params.formId

    try {
        let formResponses = await FormResponse.findOne({
            formId: formId,
        }).populate("userid", { password: 0 })

        console.log("inside get resp by forms")
        console.log("allllllllllllllllllllll")

        res.status(200).send(formResponses)
    } catch (error) {
        console.log(error)
        res.status(500).send("Server Error")
    }
}

export const getFormsByCreator = async (req: Request, res: Response) => {
    try {
        let creatorId = req.params.creatorId
        let usersForms: any
        usersForms = await Form.find({ owner: creatorId }).populate("userid", {
            password: 0,
        })
        res.status(200).send(usersForms)
    } catch (error) {
        console.log(error)
        return res.status(500).send({ sucess: false, msg: "Server Error" })
    }
}

//Coverting Response to .csv and then downloading

export const downloadResponse = async (req: Request, res: Response) => {
    let formId = req.params.formId
    let form
    form = await Form.findOne({ linkId: formId }).populate(
        "questions",
        "questionText"
    )
    if (!form) {
        form = await Form.findOne({ _id: formId }).populate(
            "questions",
            "questionText"
        )
    }
    if (!form) {
        return res.status(404).send({ success: false, msg: "No form found" })
    }
    //resp will store array of responses
    let resp = await FormResponse.find({
        formId: form._id,
    }).populate("userid", { password: 0 })

    //Using map to avoid frequent query and to store map of question id and question text which will be shown in .csv
    let quesidtotext: any = new Map()
    // console.log("$$Form is " + form)
    // console.log("$$Response is " + resp)
    let questions = form.questions
    for (let i in questions) {
        // if(questions[i].questionType=="page-header")
        // continue
        quesidtotext[String(questions[i]._id)] = questions[i].questionText
        console.log(quesidtotext[questions[i]._id])
    }
    let temp
    let data = []
    //here we are extracting answer from array of responses->resp and storing in data which will be used in converting to .csv
    //For now just shortText and paragraphText type is implemented
    // console.log("Resp is " + resp)
    for (let i = 0; i < resp.length; i++) {
        temp = resp[i].responses
        let datarow
        if (!form.anonymous)
            datarow = {
                Name: resp[i].username,
                Email: resp[i].userid.email,
            }
        for (let j = 0; j < temp.length; j++) {
            let str = quesidtotext[temp[j].questionId]
            if (temp[j].answerType == "page-header") continue
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
            if (temp[j].selectedOption) {
                let test: any = {}
                test[str] = temp[j].selectedOption
                datarow = { ...datarow, ...test }
            }
            if (temp[j].emailAnswer) {
                let test: any = {}
                test[str] = temp[j].emailAnswer
                datarow = { ...datarow, ...test }
            }
            if (temp[j].selectedOptionsGrid) {
                for (let k = 0; k < temp[j].selectedOptionsGrid.length; k++) {
                    console.log("k is " + k)
                    let test: any = {}
                    let s1: any = str
                    s1 = s1 + " [" + temp[j].selectedOptionsGrid[k].row + "]"
                    if (datarow[s1]) {
                        test[s1] =
                            datarow[s1] +
                            ", " +
                            temp[j].selectedOptionsGrid[k].col
                    } else {
                        test[s1] = temp[j].selectedOptionsGrid[k].col
                    }
                    datarow = { ...datarow, ...test }
                }
            }

            if (temp[j].multipleSelected) {
                // console.log(temp[j].multipleSelected)
                let s: any = ""
                for (let k = 0; k < temp[j].multipleSelected.length; k++) {
                    if (s == "") {
                        s = temp[j].multipleSelected[k]
                    } else {
                        s = s + ", " + temp[j].multipleSelected[k]
                    }
                    // console.log(s)
                }
                let test: any = {}
                test[str] = s
                datarow = { ...datarow, ...test }
            }
        }
        data.push(datarow)
    }
    console.log("Download ready data")
    // console.log(data)

    //Converting data to .csv and writting to a file  --- this part is now in frontend
    if (data) {
        var ws = fileSystem.createWriteStream("./src/responsedownload/data.csv")
        fastcsv
            .write(data, { headers: true })
            .on("finish", function () {
                //!!!!!Download .csv file
                //Need help
                //!!!!!Below res.download()  is not working properly
                // res.download('./src/responsedownload/data.csv')
            })
            .pipe(ws)
        return res.send({ success: true, data: data })
    } else {
        return res.status(400).send({ success: false, data: "No Form found" })
    }
}

export const getResponsesByResIdByFormId = async (
    req: Request,
    res: Response
) => {
    try {
        let responseid = req.params.responseid
        let formIndividualResponses = await FormResponse.findOne({
            _id: responseid,
        })
            .populate("userid", { password: 0 })
            .sort({ timestamps: -1 })
        console.log("Responses")
        // console.log(formIndividualResponses)
        if (formIndividualResponses) {
            let form = await Form.findById(formIndividualResponses.formId)
            if (form) {
                if (
                    req.session.role == "superadmin" ||
                    form.editors.indexOf(req.session.userId) != -1 ||
                    String(form.owner) == String(req.session.userId)
                ) {
                    console.log("Accessed Responses")
                    return res.send({
                        success: true,
                        data: formIndividualResponses,
                    })
                } else {
                    console.log("Requires Access")
                    return res.status(403).send({
                        success: false,
                        msg: "Requires Editor access to view responses",
                    })
                }
            } else {
                return res
                    .status(404)
                    .send({ success: false, msg: "No Form Found" })
            }
        } else {
            return res
                .status(404)
                .send({ success: false, msg: "No Responses Found" })
        }
    } catch (error) {
        if (error.path === "_id") {
            return res.status(404).send({ success: false, msg: "Invalid link" })
        }
        return res.send({ success: false, data: error })
    }
}

export const getResponseIdByFormFilled = async (
    req: Request,
    res: Response
) => {
    try {
        console.log("Inside getResp")
        let formId = req.params.formId
        console.log(formId)
        let responses: any
        responses = await FormResponse.find({
            formId: formId,
            submitted: true,
        })
            .populate("userid", { password: 0 })
            .populate("formId ")
        // console.log(responses)
        let ans: any = []
        for (let i = 0; i < responses.length; i++) {
            if (responses[i].formId.anonymous) {
                ans.push({ responseid: responses[i]._id })
            } else {
                ans.push({
                    responseid: responses[i]._id,
                    username: responses[i].username,
                    email: responses[i].userid.email,
                })
            }
        }

        return res.status(200).send({ success: true, data: ans })
    } catch (error) {
        console.log(error)
        return res.status(500).send({ success: false, data: error })
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
        // console.log(formResponses[0])

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
        return res.status(200).send(ans)
    } catch (error) {
        console.log(error)
        return res.status(500).send({ success: false, data: error })
    }
}

export const getResponseByBothFormidAndResponseid = async (
    req: Request,
    res: Response
) => {
    console.log(
        "http://localhost:7000/api/formresponse/" +
            req.params.formId +
            "/" +
            req.params.responseId
    )
    try {
        let responseId = req.params.responseId
        let formIndividualResponsesForForm = await FormResponse.findOne({
            _id: responseId,
            formId: req.params.formId,
        }).populate("userid", { password: 0 })
        return res
            .status(200)
            .send({ success: true, data: formIndividualResponsesForForm })
    } catch (error) {
        console.log(error)
        return res.status(500).send({ success: false, data: error })
    }
}

//Email Response

async function emailResponse(resp: any, receiver: any) {
    try {
        console.log("inside mailer")
        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: "iecseforms@gmail.com", // generated ethereal user
                pass: "iecse2021", // generated ethereal password
            },
            tls: {
                rejectUnathorized: false,
            },
        })

        // send mail with defined transport object
        try {
            let info = await transporter.sendMail({
                from: '"Admin" <iecseforms@gmail.com>', // sender address
                to: `${receiver.email}`, // list of receivers
                subject: "Form Response", // Subject line
                text: "Your Response to recently filled form", // plain text body
                html: resp, // html body
            })
            // console.log("info is " + info)
            // console.log("Message sent: %s", info.messageId)
        } catch (err) {
            console.log(err)
        }
    } catch (err) {
        console.log(err)
    }
}

export const getResponsebyRespid = async (req: Request, res: Response) => {
    try {
        let respid = req.params.respid
        console.log("resp id")

        console.log(respid)
        let resp = await FormResponse.findById({ _id: respid })
            .populate("responses.questionId formId")
            .populate("userid", { password: 0 })
        if (resp) {
            console.log(resp)
            return res.status(200).send({
                success: true,
                msg: "Response Found",
                data: resp,
            })
        } else {
            return res
                .status(404)
                .send({ success: false, msg: "Response not found" })
        }
    } catch (err) {
        if (err.path === "_id") {
            return res.status(404).send({ success: false, msg: "Invalid link" })
        }
        console.log(err)
        return res.status(500).send({ success: false, msg: "Server Error" })
    }
}
