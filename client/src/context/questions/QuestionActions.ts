import { Question, questionTypes } from "./QuestionListContext"

export const addQuestionAction = async (newQuestion: Question) => {
    const resp = await fetch("/api/addquestion", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(newQuestion),
    })
    const data = await resp.json()

    if (resp.status >= 400) {
        throw new Error(data.msg)
    }
    return data
}

export interface DeleteQuestion {
    qid: string
    formId: string
}

export const deleteQuestionAction = async ({ qid, formId }: DeleteQuestion) => {
    const resp = await fetch("/api/deletequestion", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
            id: qid,
            formId: formId,
        }),
    })
    const data = await resp.json()
    if (!data.success || resp.status >= 400) {
        throw new Error(data.msg)
    }
    return data
}

export interface UpdateQuestion {
    qid: string
    question: Question
}

export const updateQuestionAction = async ({
    qid,
    question,
}: UpdateQuestion) => {
    if (qid === undefined || qid.length === 0) return
    const q = question
    if (q === undefined) return
    let body = null
    if (q.options?.length && q.options.length >= 2) {
        body = JSON.stringify({
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
        })
    } else {
        body = JSON.stringify({
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
        })
    }
    if (q?.rows && q?.cols && q.rows.length >= 2 && q.cols.length >= 2) {
        body = JSON.stringify({
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
        })
    }
    const resp = await fetch("/api/updatequestion", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: body,
    })
    const data = await resp.json()
    if (!data.success || resp.status >= 400) {
        throw new Error(data.msg)
    }
    return data
}
