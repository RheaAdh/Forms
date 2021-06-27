import { Response, Request } from "express"
import * as mongo from "../config/mongo"
import { Form } from "../models/form"
import FormResponse from "../models/response"

import {
    Question,
    shortQuestion,
    paragraphQuestion,
    mcqQuestion,
    checkboxQuestion,
    dropdownQuestion,
    linearscaleQuestion,
    multiplechoicegridQuestion,
    checkboxgridQuestion,
    dateQuestion,
    timeQuestion,
    emailQuestion,
} from "../models/question"

export async function addQuestion(req: Request, res: Response) {
    try {
        let {
            formid,
            questionType,
            questionText,
            description,
            required,
            options,
            lowRating,
            highRating,
            lowRatingLabel,
            highRatingLabel,
            rowLabel,
            colLabel,
        } = req.body

        //?FIND FORM

        let form: any
        form = await Form.findById(formid)
        const common = {
            formid: formid,
            questionText: questionText,
            description: description,
            required: required,
        }

        console.log("Inside add ques")
        console.log("isTemplate is " + form.isTemplate)
        if (form.isTemplate) {
            console.log("Template cant be editted")
            return res
                .status(400)
                .send({ success: false, msg: "Template cant be editted" })
        } else {
            let newQuestion

            switch (questionType) {
                case "short-answer": {
                    newQuestion = new shortQuestion({ ...common })
                    break
                }

                case "email-answer": {
                    newQuestion = new emailQuestion({ ...common })
                    break
                }

                case "paragraph-answer": {
                    newQuestion = new paragraphQuestion({ ...common })
                    break
                }

                case "mcq-answer": {
                    newQuestion = new mcqQuestion({
                        ...common,
                        options: [...options],
                    })
                    break
                }

                case "checkbox-answer": {
                    newQuestion = new checkboxQuestion({
                        ...common,
                        options: [...options],
                    })
                    break
                }

                case "dropdown-answer": {
                    newQuestion = new dropdownQuestion({
                        ...common,
                        options: [...options],
                    })
                    break
                }

                case "linearscale-answer": {
                    newQuestion = new linearscaleQuestion({
                        ...common,
                        lowRating: lowRating,
                        highRating: highRating,
                        lowRatingLabel: lowRatingLabel,
                        highRatingLabel: highRatingLabel,
                    })
                    break
                }

                case "multiplechoicegrid-answer": {
                    newQuestion = new multiplechoicegridQuestion({
                        ...common,
                        rowLabel: rowLabel,
                        colLabel: colLabel,
                    })
                    break
                }

                case "checkboxgrid-answer": {
                    newQuestion = new checkboxgridQuestion({
                        ...common,
                        rowLabel: rowLabel,
                        colLabel: colLabel,
                    })
                    break
                }

                case "date-answer": {
                    newQuestion = new dateQuestion({ ...common })
                    break
                }

                case "time-answer": {
                    newQuestion = new timeQuestion({ ...common })
                    break
                }

                default:
                    newQuestion = new Question({ ...common })
            }

            await newQuestion.save()
            console.log("Questoin saved!!")

            form.questions.push(newQuestion)
            await form.save()
            console.log("Form saved!!")
            return res.status(200).json(newQuestion)
        }
    } catch (error) {
        console.log(error)
        return res.status(500).send({ success: false, msg: "Server Error" })
    }
}

export async function getQuestions(req: Request, res: Response) {
    try {
        const questions = await Question.find().exec()
        return res.status(200).json(questions)
    } catch (e) {
        console.log(e)
        return res.status(500).send({ success: false, msg: "Server Error" })
    }
}

export async function getQuestion(req: Request, res: Response) {
    try {
        const question = await Question.findById(req.params.qid)
        return res.status(200).json(question)
    } catch (e) {
        console.log(e)
        return res.status(500).send({ success: false, msg: "Server Error" })
    }
}

export async function getQuestionsByFormid(req: Request, res: Response) {
    //sending previous response and questions
    try {
        let formid: any = req.params.formid
        let admin: boolean = req.body.admin
        const form = await Form.findById(req.params.formid)
        if (form === null) {
            return res
                .status(404)
                .json({ success: false, msg: "Form doesn't exist" })
        }
        if (form.closes !== null && new Date() >= form.closes && !admin) {
            form.isActive = false
            await form.save()
            return res
                .status(400)
                .json({ success: false, msg: "Form has closed" })
        }
        if (form.isActive === false && !admin) {
            return res
                .status(400)
                .json({ success: false, msg: "Form has closed" })
        }
        const questions = await Question.find({ formid: formid })
        let user = await FormResponse.findOne({
            userid: req.session.userId,
            formId: req.params.formid,
        })
        if (!user) {
            let data = { prevResponse: null, ques: questions }
            console.log(data)
            return res.json({ success: true, data })
        } else {
            if (form.multipleResponses) {
                let data = { prevResponse: null, ques: questions }
                console.log(data)
                return res.json({ success: true, data })
            } else {
                let data = { prevResponse: user, ques: questions }
                console.log(data.prevResponse)
                console.log(data)
                return res.send({ success: true, data })
            }
        }
    } catch (e) {
        console.log(e)
        return res.status(500).send({ success: false, msg: "Server Error" })
    }
}

export async function updateQuestion(req: Request, res: Response) {
    try {
        let { formid } = req.body
        let form: any
        form = await Form.findById(formid)
        if (form.isTemplate) {
            console.log("Template cant be editted")
            return res
                .status(400)
                .send({ success: false, msg: "Template cant be editted" })
        } else {
            let moddedBody = { ...req.body }
            moddedBody["questionType"] = req.body.questionType
            console.log(req.body)
            let updatedQuestion
            // Update by finding Question, so that question type can be changed
            updatedQuestion = await Question.findOneAndUpdate(
                { _id: req.body._id },
                {
                    questionType: req.body.questionType,
                },
                { new: true }
            )
            //console.log("First update", updatedQuestion)
            // Update by finding exact question type, else options won't get updated
            switch (moddedBody["questionType"]) {
                case "short-answer":
                    updatedQuestion = await shortQuestion.findOneAndUpdate(
                        { _id: req.body._id },
                        {
                            ...moddedBody,
                        },
                        { new: true }
                    )
                    break
                case "paragraph-answer":
                    updatedQuestion = await paragraphQuestion.findOneAndUpdate(
                        { _id: req.body._id },
                        {
                            ...moddedBody,
                        },
                        { new: true }
                    )
                    break
                case "email-answer":
                    updatedQuestion = await emailQuestion.findOneAndUpdate(
                        { _id: req.body._id },
                        {
                            ...moddedBody,
                        },
                        { new: true }
                    )
                    break
                case "mcq-answer":
                    updatedQuestion = await mcqQuestion.findOneAndUpdate(
                        { _id: req.body._id },
                        {
                            ...moddedBody,
                        },
                        { new: true }
                    )
                    break
                case "checkbox-answer":
                    updatedQuestion = await checkboxQuestion.findOneAndUpdate(
                        { _id: req.body._id },
                        {
                            ...moddedBody,
                        },
                        { new: true }
                    )
                    break
                case "dropdown-answer":
                    updatedQuestion = await dropdownQuestion.findOneAndUpdate(
                        { _id: req.body._id },
                        {
                            ...moddedBody,
                        },
                        { new: true }
                    )
                    break
                case "linearscale-answer":
                    updatedQuestion = await linearscaleQuestion.findOneAndUpdate(
                        { _id: req.body._id },
                        {
                            ...moddedBody,
                        },
                        { new: true }
                    )
                    break
                case "multiplechoicegrid-answer":
                    updatedQuestion = await multiplechoicegridQuestion.findOneAndUpdate(
                        { _id: req.body._id },
                        {
                            ...moddedBody,
                        },
                        { new: true }
                    )
                    break
                case "checkboxgrid-answer":
                    updatedQuestion = await checkboxgridQuestion.findOneAndUpdate(
                        { _id: req.body._id },
                        {
                            ...moddedBody,
                        },
                        { new: true }
                    )
                    break
                case "date-answer":
                    updatedQuestion = await dateQuestion.findOneAndUpdate(
                        { _id: req.body._id },
                        {
                            ...moddedBody,
                        },
                        { new: true }
                    )
                    break
                case "time-answer":
                    updatedQuestion = await timeQuestion.findOneAndUpdate(
                        { _id: req.body._id },
                        {
                            ...moddedBody,
                        },
                        { new: true }
                    )
                    break
                default:
                    updatedQuestion = { data: { msg: "Something went wrong" } }
            }
            return res.status(200).send(updatedQuestion)
        }
    } catch (error) {
        console.log(error)
        return res.status(500).send({ success: false, data: "Server Error" })
    }
}

export async function deleteQuestion(req: Request, res: Response) {
    try {
        await Question.findByIdAndDelete(req.body.id)
        console.log(req.body.id)

        await Form.findOneAndUpdate(
            { _id: req.body.formid },
            { $pull: { questions: req.body.id } as any }
        )
        return res
            .status(200)
            .send({ success: true, data: "Deleted successfully" })
    } catch (error) {
        console.log(error)
        return res.status(500).send({ success: false, data: "Server Error" })
    }
}

export async function getMyQuestions(req: Request, res: Response) {
    try {
        const questions = await Question.find({ userId: req.session.userId })
        return res.status(200).json(questions)
    } catch (err) {
        console.log(err)
        return res.status(500).send({ success: false, msg: "Server Error" })
    }
}
