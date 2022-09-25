import React, { createContext, ReactElement, useContext, useState } from "react"
import { ICurrentForm } from "../form/CurrentFormContext"
import { IQuestion } from "../questions/QuestionListContext"
import { getUsersAction, submitAction } from "./ResponseActions"

export interface gridOptions {
    row: string
    col: string
}

export interface IUser {
    username?: string
    responseid: string
    email?: string
}

export interface IResponse {
    answerType: string
    questionId: string
    formId: string
    shortText?: string
    paragraphText?: string
    selectedOption?: string
    multipleSelected?: string[]
    selectedOptionsGrid?: gridOptions[]
    emailAnswer?: string
    canSubmit: boolean // Everything must be valid
    canSave: boolean // Required fields may be left off, but mail id must be valid / word length check for text
}

export interface ResponseActions {
    getResponse: (
        formId: string,
        prevResponses: any,
        requiredData: boolean[],
        readOnly: boolean
    ) => void
    getUsers: (formId: string | undefined) => Promise<IUser[]>
    findPreviousUser: (currentUser: IUser) => IUser
    findNextUser: (currentUser: IUser) => IUser
    updateResponse: (qid: string, response: IResponse) => void
    clearResponse: (questions: any[]) => void
    submit: (
        sendMail: boolean,
        submitted: boolean,
        formFromClient: ICurrentForm | null,
        questionsFromClient: IQuestion[] | null
    ) => Promise<any>
}

interface Props {
    children: ReactElement
}

export interface IResponseList {
    readOnly: boolean
    userid: string
    username: string
    submitted: boolean
    responses: IResponse[]
    submitError: string | null
    responseActions: ResponseActions
    users?: IUser[]
}

const ResponseListContext = createContext<IResponseList | null>(null)

export const useResponses = () => useContext(ResponseListContext)

export default function ResponseListProvider({
    children,
}: Props): ReactElement {
    const [userid, setUserid] = useState<string>("")
    const [username, setUsername] = useState<string>("")
    const [submitError, setSubmitError] = useState<string | null>(null)
    const [responses, setResponses] = useState<IResponse[]>([])
    const [readOnly, setReadOnly] = useState<boolean>(true)
    const [users, setUsers] = useState<IUser[]>()
    const [submitted, setSubmitted] = useState<boolean>(false)

    const getResponse = (
        formId: string,
        prevResponses: any,
        requiredData: boolean[],
        readOnly: boolean
    ) => {
        setUserid(prevResponses.userid) // Could be undefined, but not an issue
        setUsername(prevResponses.username) // Could be undefined, but not an issue
        setReadOnly(readOnly)
        setSubmitted(prevResponses.submitted || false)
        let responses = prevResponses.responses.length
            ? prevResponses.responses
            : prevResponses.questions
        setResponses(
            responses.map((resp: any, i: number) => ({
                answerType: resp.answerType || resp.questionType,
                questionId: resp.questionId || resp._id,
                formId: resp.formId || resp.formid,
                canSubmit: prevResponses?.responses?.length
                    ? true
                    : resp.answerType === "dropdown-answer" ||
                      resp.questionType === "dropdown-answer"
                    ? true
                    : !requiredData[i],
                canSave: true,
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
                        : [],
                emailAnswer:
                    resp.emailAnswer !== undefined ? resp.emailAnswer : "",
            }))
        )
    }

    const getUsers = async (formId: string | undefined) => {
        try {
            const data = await getUsersAction(formId || "")
            setUsers(
                data.map((user: any) => ({
                    responseid: user.responseid,
                    username: user.username,
                    email: user.email,
                }))
            )
            return data
        } catch (err) {
            console.log(console.error())
        }
        return []
    }

    const findNextUser = (currentUser: IUser) => {
        const index: number | undefined = users?.findIndex(
            (usr) => usr.responseid === currentUser.responseid
        )
        if (index !== undefined) {
            if (index + 1 === users?.length) {
                return users[0]
            }
            if (users !== undefined) return users[index + 1]
        }
        return currentUser
    }

    const findPreviousUser = (currentUser: IUser) => {
        const index: number | undefined = users?.findIndex(
            (usr) => usr.responseid === currentUser.responseid
        )
        if (index !== undefined && users !== undefined) {
            if (index === 0) {
                return users[users.length - 1]
            }
            return users[index - 1]
        }
        return currentUser
    }

    const updateResponse = (qid: string, response: IResponse) => {
        const newResponseList = responses.slice()
        var index = responses.findIndex(
            (response) => response.questionId === qid
        )
        if (index === -1) return
        newResponseList[index] = response
        setResponses(newResponseList)
    }

    const submit = async (
        sendMail: boolean,
        submitted: boolean,
        formFromClient: ICurrentForm | null,
        questionsFromClient: IQuestion[] | null
    ) => {
        if (!submitted && responses.some((res) => res.canSave === false)) {
            setSubmitError(
                "Unable to save, please make sure responses are valid"
            )
            return { success: false }
        } else if (
            submitted &&
            responses.some((res) => res.canSubmit === false)
        ) {
            setSubmitError("Please fill all required details")
            return { success: false }
        } else setSubmitError(null)
        const body = {
            username: username,
            userid: userid,
            responses: responses.filter((resp: any) => JSON.stringify(resp)),
            sendMail,
            submitted,
            responseFromClient: responses,
            questionsFromClient,
            formFromClient,
        }
        const data = await submitAction(body, formFromClient?.id)
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
        findPreviousUser,
        findNextUser,
        updateResponse,
        submit,
        clearResponse,
    }

    const responseList: IResponseList = {
        readOnly,
        userid,
        username,
        responses,
        submitError,
        responseActions,
        users,
        submitted,
    }

    return (
        <ResponseListContext.Provider value={responseList}>
            {children}
        </ResponseListContext.Provider>
    )
}
