import { deleteRequest, post, put } from "../../utils/requests"
import { IQuestion, questionTypes } from "./QuestionListContext"

export const addQuestionAction = async (newQuestion: IQuestion) => {
    const resp = await post("/api/addquestion", newQuestion)
    const data = await resp.json()
    if (resp.status >= 400) {
        throw new Error(data.msg)
    }
    return data
}

export interface IDeleteQuestion {
    qid: string
    formId: string
}

export const deleteQuestionAction = async ({
    qid,
    formId,
}: IDeleteQuestion) => {
    const resp = await deleteRequest("/api/deletequestion", {
        id: qid,
        formId: formId,
    })
    const data = await resp.json()
    if (!data.success || resp.status >= 400) {
        throw new Error(data.msg)
    }
    return data
}

export interface IUpdateQuestion {
    qid: string
    question: IQuestion
}

export const updateQuestionAction = async ({
    qid,
    question,
}: IUpdateQuestion) => {
    if (qid === undefined || qid.length === 0) return
    const q = question
    if (q === undefined) return
    let body = null
    if (q.options?.length && q.options.length >= 2) {
        body = {
            ...q,
            _id: q.qid,
            questionText: q.questionText,
            required: q.required,
            options: q.options.map((option) => option.text),
            lowRating: q.lowRating,
            highRating: q.highRating,
            lowRatingLabel: q.lowRatingLabel,
            highRatingLabel: q.highRatingLabel,
            description: q.description,
            pageNo: q.pageNo,
            questionType: questionTypes[questionTypes.indexOf(q.questionType)],
        }
    } else {
        body = {
            ...q,
            options: [],
            _id: q.qid,
            questionText: q.questionText,
            required: q.required,
            lowRating: q.lowRating,
            highRating: q.highRating,
            lowRatingLabel: q.lowRatingLabel,
            highRatingLabel: q.highRatingLabel,
            description: q.description,
            pageNo: q.pageNo,
            questionType: questionTypes[questionTypes.indexOf(q.questionType)],
        }
    }
    if (q?.rows && q?.cols && q.rows.length >= 2 && q.cols.length >= 2) {
        body = {
            ...q,
            _id: q.qid,
            questionText: q.questionText,
            required: q.required,
            options: q?.options?.map((option) => option.text),
            rowLabel: q.rows.map((row) => row.text),
            colLabel: q.cols.map((col) => col.text),
            lowRating: q.lowRating,
            highRating: q.highRating,
            lowRatingLabel: q.lowRatingLabel,
            highRatingLabel: q.highRatingLabel,
            description: q.description,
            pageNo: q.pageNo,
            questionType: questionTypes[questionTypes.indexOf(q.questionType)],
        }
    }
    const resp = await put("/api/updatequestion", body)
    const data = await resp.json()
    if (!data.success || resp.status >= 400) {
        throw new Error(data.msg)
    }
    return data
}
