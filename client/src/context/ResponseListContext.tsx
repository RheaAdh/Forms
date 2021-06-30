import React, { createContext, ReactElement, useContext, useState } from "react"
import { questionTypes } from "./QuestionListContext"

export interface gridOptions {
    row: string
    col: string
}

export interface user {
    username: string
    responseid: string
}

export interface Response {
    answerType: string
    questionId: string
    formId: string
    shortText?: string
    paragraphText?: string
    selectedOption?: string
    multipleSelected?: string[]
    selectedOptionsGrid?: gridOptions[]
    emailAnswer?: string
    canSubmit: boolean
}

export interface ResponseActions {
    getResponse: (
        formId: string,
        prevResponses: any,
        requiredData: boolean[],
        readOnly: boolean
    ) => void
    getUsers: () => Promise<user[]>
    updateResponse: (index: number, response: Response) => void
    setFormId: (formiId: string) => void
    clearResponse: (questions: any[]) => void
    submit: (sendMail: boolean) => Promise<any>
}

interface Props {
    children: ReactElement
}

export interface ResponseList {
    readOnly: boolean
    formId: string
    userid: string
    username: string
    responses: Response[]
    submitError: string | null
    responseActions: ResponseActions
    users?: user[]
}

const ResponseListContext = createContext<ResponseList | null>(null)

export const useResponses = () => useContext(ResponseListContext)

export default function ResponseListProvider({
    children,
}: Props): ReactElement {
    const [formId, setFormId] = useState<string>("")
    const [userid, setUserid] = useState<string>("")
    const [username, setUsername] = useState<string>("")
    const [submitError, setSubmitError] = useState<string | null>(null)
    const [responses, setResponses] = useState<Response[]>([])
    const [readOnly, setReadOnly] = useState<boolean>(true)
    const [users, setUsers] = useState<user[]>()

    const getResponse = (
        formId: string,
        prevResponses: any,
        requiredData: boolean[],
        readOnly: boolean
    ) => {
        setFormId(formId)
        setUserid(prevResponses.userid)
        setUsername(prevResponses.username)
        setReadOnly(readOnly)
        let responses = prevResponses.responses.length
            ? prevResponses.responses
            : prevResponses.questions
        setResponses(
            responses.map((resp: any, i: number) => ({
                answerType: resp.answerType || resp.questionType,
                questionId: resp.questionId || resp._id,
                formId: resp.formId || resp.formid,
                canSubmit: !requiredData[i],
                shortText: resp.shortText !== undefined ? resp.shortText : "",
                paragraphText:
                    resp.paragraphText !== undefined ? resp.paragraphText : "",
                selectedOption:
                    resp.selectedOption !== undefined
                        ? resp.selectedOption
                        : "",
                multipleSelected:
                    resp.multipleSelected !== undefined
                        ? resp.multipleSelected
                        : [],
                selectedOptionsGrid:
                    resp.selectedOptionsGrid !== undefined
                        ? resp.selectedOptionsGrid
                        : [{} as gridOptions],
                emailAnswer:
                    resp.emailAnswer !== undefined ? resp.emailAnswer : "",
            }))
        )
    }

    const getUsers = async () => {
        if (!readOnly) return
        try {
            const res = await fetch(`/api/responsesidbyformfilled/${formId}`, {
                method: "GET",
                headers: {
                    "Content-type": "application/json",
                },
                credentials: "include",
            })
            const data = await res.json()
            setUsers(
                data.data.map((user: any) => ({
                    responseid: user.responseid,
                    username: user.username,
                }))
            )
            return data.data
        } catch (err) {
            console.log(console.error())
        }
        return []
    }

    const updateResponse = (index: number, response: Response) => {
        const newResponseList = responses.slice()
        newResponseList[index] = response
        setResponses(newResponseList)
    }

    const submit = async (sendMail: boolean) => {
        if (responses.some((res) => res.canSubmit === false)) {
            setSubmitError("Please fill all required details")
            return { success: false }
        } else setSubmitError(null)
        const body = {
            username: username,
            userid: userid,
            formId: formId,
            responses: responses.filter((resp: any) => JSON.stringify(resp)),
            sendMail,
        }
        const res = await fetch("/api/submitresponse", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(body),
        })
        const data = await res.json()
        return data
    }

    const clearResponse = (questions: any[]) => {
        setResponses((prevResponses) => {
            const newResponses = prevResponses.slice()
            for (var i: number = 0; i < prevResponses.length; i++) {
                newResponses[i].shortText = ""
                newResponses[i].paragraphText = ""
                newResponses[i].emailAnswer = ""
                newResponses[i].selectedOption = ""
                newResponses[i].multipleSelected = []
                newResponses[i].selectedOptionsGrid = []
                newResponses[i].canSubmit = !questions[i].required
            }
            return newResponses
        })
        setReadOnly(false)
    }

    const responseActions = {
        getResponse,
        getUsers,
        updateResponse,
        setFormId,
        submit,
        clearResponse,
    }

    const responseList: ResponseList = {
        readOnly,
        formId,
        userid,
        username,
        responses,
        submitError,
        responseActions,
        users,
    }

    return (
        <ResponseListContext.Provider value={responseList}>
            {children}
        </ResponseListContext.Provider>
    )
}
