import React, { ReactElement, useContext, useState } from "react"

export const questionTypes = [
    "short-answer",
    "paragraph-answer",
    "mcq-answer",
    "checkbox-answer",
    "dropdown-answer",
    "linearscale-answer",
    "multiplechoicegrid-answer",
    "checkboxgrid-answer",
    "email-answer",
    "file-upload",
]

export interface Question {
    formId: string
    qid?: string
    questionText: string
    questionType: string
    required: boolean
    options?: string[]
    cols?: string[]
    rows?: string[]
    lowRating?: number
    highRating?: number
    lowRatingLabel?: string
    highRatingLabel?: string
}

export interface QuestionActions {
    getQuestions: (formId: string, quesData: any) => void
    addOptions: (qid: string) => void
    addRows: (qid: string) => void
    addCols: (qid: string) => void
    deleteOption: (qid: string, idx: number) => void
    deleteRow: (qid: string, idx: number) => void
    deleteCol: (qid: string, idx: number) => void
    updateOptions: (qid: string, idx: number, change: string) => void
    updateRows: (qid: string, idx: number, change: string) => void
    updateCols: (qid: string, idx: number, change: string) => void
    updateType: (qid: string, type: string) => void
    updateQuestion: (qid: string) => void
    deleteQuestion: (qid: string) => void
    addQuestion: () => void
    setLowRating: (qid: string, num: number) => void
    setHighRating: (qid: string, num: number) => void
    setLowRatingLabel: (qid: string, label: string) => void
    setHighRatingLabel: (qid: string, label: string) => void
    setQuestionText: (qid: string, text: string) => void
    setRequired: (qid: string, req: boolean) => void
}

export interface QuestionsList {
    questions: Question[]
    questionActions: QuestionActions
}

interface Props {
    children: ReactElement
}

export const QuestionsListContext = React.createContext<QuestionsList | null>(
    null
)

export const useQuestionsList = () => {
    return useContext(QuestionsListContext)
}

export default function QuestionsListProvider({
    children,
}: Props): ReactElement {
    const [questions, setQuestions] = useState<Question[]>([])
    const [formId, setFormid] = useState<string | null>(null)

    const getQuestions = async (formId: string, quesData: any) => {
        setFormid(formId)
        setQuestions(
            quesData.map((q: any) => {
                return {
                    formId: formId,
                    qid: q._id,
                    questionText: q["questionText"],
                    questionType: q["questionType"],
                    required: q.required,
                    options: q.options !== undefined ? q.options : [""],
                    rows: q.rowLabel !== undefined ? q.rowLabel : [""],
                    cols: q.colLabel !== undefined ? q.colLabel : [""],
                    lowRating: q.lowRating !== undefined ? q.lowRating : 0,
                    highRating: q.highRating !== undefined ? q.highRating : 2,
                    lowRatingLabel:
                        q.lowRatingLabel !== undefined ? q.lowRatingLabel : "",
                    highRatingLabel:
                        q.highRatingLabel !== undefined
                            ? q.highRatingLabel
                            : "",
                }
            })
        )
    }
    const addQuestion = () => {
        if (!formId) return
        const newQuestion = {
            questionText: "Question",
            questionType: "short-answer",
            required: false,
            formId: formId,
            qid: "",
        }
        fetch("/api/addquestion", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(newQuestion),
        })
            .then((response) => response.json())
            .then((data) => {
                newQuestion.qid = data._id
                setQuestions([...questions, newQuestion])
            })
            .catch((error) => {
                console.log("Error: ", error)
            })
    }
    const deleteQuestion = async (qid: string) => {
        const res = await fetch("/api/deletequestion", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
                id: qid,
                formId: questions[0].formId,
            }),
        })
        const data = await res.json()
        if (data.success) {
            setQuestions((prevQuestions) =>
                prevQuestions.filter((q) => q.qid !== qid)
            )
        } else console.log(data)
    }
    const addOptions = (qid: string) => {
        var q = questions.find((question) => question.qid === qid)
        var idx = questions.findIndex((question) => question.qid === qid)
        if (q?.options) q.options = [...q?.options, ""]
        else if (q !== undefined) q.options = [""]
        else return
        const newQuestions = questions.slice()

        newQuestions[idx] = q
        setQuestions(newQuestions)
    }
    const addRows = (qid: string) => {
        var q = questions.find((question) => question.qid === qid)
        var idx = questions.findIndex((question) => question.qid === qid)
        if (q?.rows) q.rows = [...q?.rows, ""]
        else if (q !== undefined) q.rows = [""]
        else return
        const newQuestions = questions.slice()

        newQuestions[idx] = q
        setQuestions(newQuestions)
    }
    const addCols = (qid: string) => {
        var q = questions.find((question) => question.qid === qid)
        var idx = questions.findIndex((question) => question.qid === qid)
        if (q?.cols) q.cols = [...q?.cols, ""]
        else if (q !== undefined) q.cols = [""]
        else return
        const newQuestions = questions.slice()

        newQuestions[idx] = q
        setQuestions(newQuestions)
    }
    const deleteOption = (qid: string, i: number) => {
        var q = questions.find((question) => question.qid === qid)
        var idx = questions.findIndex((question) => question.qid === qid)
        if (q?.options) {
            q.options = q.options.filter((opt, ix: number) => ix !== i)
            const newQuestions = questions.slice()
            newQuestions[idx] = {} as Question
            setQuestions(newQuestions)
            newQuestions[idx] = q
            setQuestions(newQuestions)
        }
    }
    const deleteRow = (qid: string, i: number) => {
        var q = questions.find((question) => question.qid === qid)
        var idx = questions.findIndex((question) => question.qid === qid)
        if (q?.rows) {
            q.rows = q.rows.filter((r, ix: number) => ix !== i)
            const newQuestions = questions.slice()
            newQuestions[idx] = q
            setQuestions(newQuestions)
        }
    }
    const deleteCol = (qid: string, i: number) => {
        var q = questions.find((question) => question.qid === qid)
        var idx = questions.findIndex((question) => question.qid === qid)
        if (q?.cols) {
            q.cols = q.cols.filter((r, ix: number) => ix !== i)
            const newQuestions = questions.slice()
            newQuestions[idx] = {} as Question
            setQuestions(newQuestions)
            newQuestions[idx] = q
            setQuestions(newQuestions)
        }
    }
    const updateOptions = (qid: string, i: number, change: string) => {
        var q = questions.find((question) => question.qid === qid)
        var idx = questions.findIndex((question) => question.qid === qid)
        if (q === undefined) return
        if (q.options) {
            const newOptions = q.options.slice()
            newOptions[i] = change
            q.options = newOptions
            const newQuestions = questions.slice()
            newQuestions[idx] = q
            setQuestions(newQuestions)
        }
    }
    const updateRows = (qid: string, i: number, change: string) => {
        var q = questions.find((question) => question.qid === qid)
        var idx = questions.findIndex((question) => question.qid === qid)
        if (q === undefined) return
        if (q.rows) {
            const newRows = q.rows.slice()
            newRows[i] = change
            q.rows = newRows
            const newQuestions = questions.slice()
            newQuestions[idx] = q
            setQuestions(newQuestions)
        }
    }
    const updateCols = (qid: string, i: number, change: string) => {
        var q = questions.find((question) => question.qid === qid)
        var idx = questions.findIndex((question) => question.qid === qid)
        if (q === undefined) return
        if (q.cols) {
            const newCols = q.cols.slice()
            newCols[i] = change
            q.cols = newCols
            const newQuestions = questions.slice()
            newQuestions[idx] = q
            setQuestions(newQuestions)
        }
    }
    const updateType = (qid: string, type: string) => {
        var q = questions.find((question) => question.qid === qid)
        var idx = questions.findIndex((question) => question.qid === qid)
        if (q === undefined) return
        q.questionType = type
        const newQuestions = questions.slice()
        newQuestions[idx] = q
        setQuestions(newQuestions)
    }
    const setLowRating = (qid: string, num: number) => {
        var q = questions.find((question) => question.qid === qid)
        var idx = questions.findIndex((question) => question.qid === qid)
        if (q === undefined) return
        q.lowRating = num
        const newQuestions = questions.slice()
        newQuestions[idx] = q
        setQuestions(newQuestions)
    }
    const setHighRating = (qid: string, num: number) => {
        var q = questions.find((question) => question.qid === qid)
        var idx = questions.findIndex((question) => question.qid === qid)
        if (q === undefined) return
        q.highRating = num
        const newQuestions = questions.slice()

        newQuestions[idx] = q
        setQuestions(newQuestions)
    }
    const setLowRatingLabel = (qid: string, label: string) => {
        var q = questions.find((question) => question.qid === qid)
        var idx = questions.findIndex((question) => question.qid === qid)
        if (q === undefined) return
        q.lowRatingLabel = label
        const newQuestions = questions.slice()

        newQuestions[idx] = q
        setQuestions(newQuestions)
    }
    const setHighRatingLabel = (qid: string, label: string) => {
        let q = questions.find((question) => question.qid === qid)
        let idx = questions.findIndex((question) => question.qid === qid)
        if (q === undefined) return
        q.highRatingLabel = label
        const newQuestions = questions.slice()

        newQuestions[idx] = q
        setQuestions(newQuestions)
    }
    const setQuestionText = (qid: string, text: string) => {
        let q = questions.find((question) => question.qid === qid)
        let idx = questions.findIndex((question) => question.qid === qid)
        if (q === undefined) return
        q.questionText = text
        const newQuestions = questions.slice()
        newQuestions[idx] = q
        setQuestions(newQuestions)
    }
    const setRequired = (qid: string, req: boolean) => {
        var q = questions.find((question) => question.qid === qid)
        var idx = questions.findIndex((question) => question.qid === qid)
        if (q === undefined) return
        q.required = req
        const newQuestions = questions.slice()

        newQuestions[idx] = q
        setQuestions(newQuestions)
    }
    const updateQuestion = (qid: string | undefined) => {
        if (qid === undefined) return
        const q = questions.find((question) => question.qid === qid)
        if (q === undefined) return
        let body = null
        if (q.options?.length && q.options.length >= 2) {
            body = JSON.stringify({
                ...q,
                _id: q.qid,
                questionText: q.questionText,
                required: q.required,
                options: q.options,
                lowRating: q.lowRating,
                highRating: q.highRating,
                lowRatingLabel: q.lowRatingLabel,
                highRatingLabel: q.highRatingLabel,
                questionType:
                    questionTypes[questionTypes.indexOf(q.questionType)],
            })
        } else {
            body = JSON.stringify({
                ...q,
                _id: q.qid,
                questionText: q.questionText,
                required: q.required,
                lowRating: q.lowRating,
                highRating: q.highRating,
                lowRatingLabel: q.lowRatingLabel,
                highRatingLabel: q.highRatingLabel,
                questionType:
                    questionTypes[questionTypes.indexOf(q.questionType)],
            })
        }
        if (q?.rows && q?.cols && q.rows.length >= 2 && q.cols.length >= 2) {
            body = JSON.stringify({
                ...q,
                _id: q.qid,
                questionText: q.questionText,
                required: q.required,
                rowLabel: q.rows,
                colLabel: q.cols,
                lowRating: q.lowRating,
                highRating: q.highRating,
                lowRatingLabel: q.lowRatingLabel,
                highRatingLabel: q.highRatingLabel,
                questionType:
                    questionTypes[questionTypes.indexOf(q.questionType)],
            })
        }
        fetch("/api/updatequestion", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: body,
        })
    }
    const questionActions: QuestionActions = {
        getQuestions,
        deleteQuestion,
        addQuestion,
        addOptions,
        addRows,
        addCols,
        deleteOption,
        deleteRow,
        deleteCol,
        updateOptions,
        updateRows,
        updateCols,
        updateQuestion,
        updateType,
        setLowRating,
        setHighRating,
        setLowRatingLabel,
        setHighRatingLabel,
        setQuestionText,
        setRequired,
    }
    const questionsList = {
        questions,
        questionActions,
    }

    return (
        <QuestionsListContext.Provider value={questionsList}>
            {children}
        </QuestionsListContext.Provider>
    )
}
