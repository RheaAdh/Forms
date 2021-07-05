import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import QuestionResponse from "../components/QuestionResponse"
import { useAuth } from "../context/AuthContext"
import { useCurrentForm } from "../context/CurrentFormContext"
import getQuestionsAndResponses, {
    downloadResponse,
    getByResponseId,
} from "../context/Actions"
import CsvDownloader from "react-csv-downloader"
import { useResponses, user } from "../context/ResponseListContext"
import { Question, useQuestionsList } from "../context/QuestionListContext"
import "../styles/DisplayForm.css"
import AdminNavbar from "../components/AdminNavbar"
import { ReactComponent as DropdownArrow } from "../images/DropdownArrow.svg"
import Loading from "../components/Loading"

const FormForAllResponses = () => {
    const auth = useAuth()
    const form = useCurrentForm()
    const responseList = useResponses()
    const questions = useQuestionsList()

    const [dataForDownload, setDataForDownload] = useState<any[]>()
    const [columnsForDownload, setColumnsForDownload] = useState<any[]>()
    const [currentUser, setCurrentUser] = useState<user | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

    const { formId }: any = useParams()

    useEffect(() => {
        //Get current logged in user
        if (auth?.currentUser === null) auth?.getCurrentUser()
        // Admin level access, fetch all responses for csv data
        if (formId !== undefined) {
            downloadResponse(formId).then((data) => {
                if (data) {
                    setColumnsForDownload(data.columns)
                    setDataForDownload(data.dataForDownload)
                }
            })
        }
    }, [formId])

    useEffect(() => {
        if (formId && auth?.currentUser && auth?.currentUser?.userid !== "x") {
            form?.setFormDetails(formId, true)
                .then((data) => {
                    if (data.status >= 400) {
                        setError(data.msg)
                        setLoading(false)
                    }
                })
                .catch((err) => {
                    console.log(err)
                })
            getQuestionsAndResponses(formId, true).then((data) => {
                if (data.status >= 400) {
                    return
                }
                questions?.questionActions?.getQuestions(formId, data.ques)
                if (data.prevResponse === null) {
                    data.prevResponse = {
                        responses: [],
                        questions: data.ques,
                        userid: auth?.currentUser?.userid,
                        username: auth?.currentUser?.username,
                    }
                }
                // No need to fetch responses in case of admin level access, just setting formId is enough
                responseList?.responseActions?.setFormId(formId)
            })
        }
    }, [formId, auth?.currentUser])

    useEffect(() => {
        // Get list of all users and corresponding response IDs for current form
        // This is for /responses/:formId page
        if (responseList?.formId?.length) {
            responseList?.responseActions?.getUsers().then((data) => {
                setCurrentUser(data[0])
                setLoading(false)
            })
        }
    }, [responseList?.formId])

    useEffect(() => {
        if (currentUser) {
            // Get response for current user, when current user changes
            if (!loading) setLoading(true)
            getByResponseId(currentUser.responseid).then((data) => {
                if (data.status === 404 || data.status === 403) {
                    return setError(data.msg)
                }
                if (!data.success) {
                    console.log(data)
                    return
                }
                if (questions)
                    responseList?.responseActions?.getResponse(
                        formId,
                        data.data,
                        questions.questions.map((q) => q.required),
                        true
                    )
                setLoading(false)
            })
        }
    }, [currentUser])

    if (loading) {
        return <Loading />
    }

    if (error) {
        return <div>{error}</div>
    }

    return (
        <div className="display-form-page">
            <AdminNavbar questionsPage={false} />
            <div className="display-form-container">
                <div>
                    <CsvDownloader
                        filename={form?.currentForm?.title || ""}
                        extension={".csv"}
                        columns={columnsForDownload}
                        datas={dataForDownload ? dataForDownload : []}
                        text={"Click  to download responses"}
                    />
                    {!form?.currentForm?.anonymous &&
                    responseList?.users?.length ? (
                        <div className="select">
                            <select
                                value={`${currentUser?.email}`}
                                onChange={(e) => {
                                    e.persist()
                                    setCurrentUser((prevUser) => {
                                        const newUser = responseList?.users?.find(
                                            (user) =>
                                                user.email === e.target?.value
                                        )
                                        return newUser === undefined
                                            ? prevUser
                                            : newUser
                                    })
                                }}
                            >
                                {responseList?.users.map(
                                    (usr: user, i: number) => {
                                        return (
                                            <option key={i} value={usr.email}>
                                                {`${usr.username} ${usr.email}`}
                                            </option>
                                        )
                                    }
                                )}
                            </select>
                            <span className="select-arrow">
                                {" "}
                                <DropdownArrow />{" "}
                            </span>
                        </div>
                    ) : form?.currentForm?.anonymous &&
                      responseList?.users?.length &&
                      currentUser !== null ? (
                        <div className="anonymous-responses-box">
                            <button
                                onClick={() =>
                                    setCurrentUser(
                                        responseList.responseActions.findPreviousUser(
                                            currentUser
                                        )
                                    )
                                }
                            >
                                {`<--`}
                            </button>
                            {`Response ${
                                responseList?.users?.findIndex(
                                    (usr) =>
                                        usr.responseid ===
                                        currentUser?.responseid
                                ) + 1
                            } of ${responseList?.users?.length}`}
                            <button
                                onClick={() =>
                                    setCurrentUser(
                                        responseList.responseActions.findNextUser(
                                            currentUser
                                        )
                                    )
                                }
                            >
                                {`-->`}
                            </button>
                        </div>
                    ) : null}
                </div>
                <div className="display-form-component form-header">
                    {!form?.currentForm?.isTemplate && (
                        <div
                            className="switch-slider"
                            style={
                                form?.currentForm?.isActive
                                    ? { backgroundColor: "green" }
                                    : { backgroundColor: "red" }
                            }
                        >
                            <button
                                className="switch-btn"
                                style={
                                    form?.currentForm?.isActive
                                        ? { right: "0" }
                                        : { left: "0" }
                                }
                                onClick={() => {
                                    if (form?.currentForm?.isActive) {
                                        form?.setDate(new Date())
                                    } else {
                                        form?.setDate(null)
                                    }
                                    form?.setActive(
                                        !form?.currentForm?.isActive
                                    )
                                }}
                            >
                                <span className="icon-info">
                                    {form?.currentForm?.isActive
                                        ? "Active"
                                        : "Closed"}
                                </span>
                                <span className="text-info-arrow" />
                            </button>
                        </div>
                    )}
                    <h2>{`${responseList?.users?.length} responses`}</h2>
                    <p>{form?.currentForm?.description}</p>
                </div>
                {questions?.questions?.map((q: Question, idx: number) => {
                    return (
                        <QuestionResponse
                            question={q}
                            prevResponse={responseList?.responses?.[idx]}
                            index={idx}
                            key={q.qid}
                        />
                    )
                })}
            </div>
        </div>
    )
}

export default FormForAllResponses
