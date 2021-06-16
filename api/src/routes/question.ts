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
            question_type,
            question_text,
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
            question_text: question_text,
            description: description,
            required: required,
        }

        let newQuestion

        switch (question_type) {
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
        return res.json(newQuestion)
    } catch (error) {
        return res.send({ success: false, msg: error })
    }
}

export async function getQuestions(req: Request, res: Response) {
    try {
        const questions = await Question.find().exec()
        return res.json(questions)
    } catch (e) {
        return res.send({ success: false, msg: e })
    }
}

export async function getQuestion(req: Request, res: Response) {
    try {
        const question = await Question.findById(req.params.qid)
        return res.json(question)
    } catch (e) {
        return res.send({ success: false, msg: e })
    }
}

export async function getQuestionsByFormid(req: Request, res: Response) {
    //sending previous response and questions
    try {
        const questions = await Question.find({ formid: req.params.formid })
        let user = await FormResponse.findOne({
            userid: req.session.userId,
            formId: req.params.formid,
        })
        if (!user) {
            let data = { prevResponse: null, ques: questions }
            console.log(data)
            return res.json(data)
        } else {
            let data = { prevResponse: user, ques: questions }
            console.log(data.prevResponse)
            console.log(data)
            return res.send(data)
        }
    } catch (e) {
        return res.send({ success: false, msg: e })
    }
}

export async function updateQuestion(req: Request, res: Response) {
    try {
        let moddedBody = { ...req.body }
        moddedBody["question-type"] = req.body["question-type"]
        let updatedQuestion
        // Update by finding Question, so that question type can be changed
        updatedQuestion = await Question.findOneAndUpdate(
            { _id: req.body._id },
            {
                "question-type": req.body["question-type"],
            },
            { new: true }
        )
        console.log("First update", updatedQuestion)
        // Update by finding exact question type, else options won't get updated
        switch (moddedBody["question-type"]) {
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
        return res.send(updatedQuestion)
    } catch (error) {
        return res.send({ success: false, data: error })
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
        return res.send({ success: true, data: "Deleted successfully" })
    } catch (error) {
        return res.send({ success: false, data: "You messed up.... again" })
    }
}

export async function getMyQuestions(req: Request, res: Response) {
    try {
        const questions = await Question.find({ userId: req.session.userId })
        return res.json(questions)
    } catch (err) {
        return res.send({ success: false, msg: err })
    }
}
