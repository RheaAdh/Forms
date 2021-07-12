import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import QuestionResponse from "../components/shared/QuestionResponse"
import { useAuth } from "../context/auth/AuthContext"
import { useCurrentForm } from "../context/form/CurrentFormContext"
import getQuestionsAndResponses, {
    getByResponseIdPublic,
    downloadResponse,
    getByResponseId,
} from "../context/form/FormActions"
import CsvDownloader from "react-csv-downloader"
import { useResponses, user } from "../context/responses/ResponseListContext"
import {
    Question,
    useQuestionsList,
} from "../context/questions/QuestionListContext"
import "../styles/DisplayForm.css"
import AdminNavbar from "../components/admin/AdminNavbar"
import Loading from "../components/shared/Loading"

interface props {
    readonly: boolean
    responseOnlyPage: boolean
}
// This component can be used for 3 pages, to view all responses, to view a response for a responseId, to view a normal form
// that can take submissions
const DisplayForm: React.FC<props> = ({ readonly, responseOnlyPage }) => {
    const auth = useAuth()
    const form = useCurrentForm()
    const responseList = useResponses()
    const questions = useQuestionsList()

    // Local state current user, stores {username, responseid} of the user whose response is
    // being viewed right now. This is for admin level use only
    const [currentUser, setCurrentUser] = useState<user | null>(null)

    const [thankYou, setThankYou] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
    const { formid, responseId }: any = useParams()
    const [dataForDownload, setDataForDownload] = useState<any[]>()
    const [columnsForDownload, setColumnsForDownload] = useState<any[]>()
    const [sendMail, setSendMail] = useState<boolean>(false)
    useEffect(() => {
        //Get current logged in user
        if (auth?.currentUser === null && !responseOnlyPage)
            auth?.getCurrentUser()
        // Get response for response ID if this is a response only type page (/response/:responseId)
        if (responseOnlyPage && responseId) {
            getByResponseIdPublic(responseId).then((data) => {
                if (!data.success) {
                    if (data.status === 404) {
                        setError(data.msg)
                        return setLoading(false)
                    }
                    console.log(data)
                    return
                }
                const formId = data.data.formId._id
                const formData = data.data.formId
                const questionsData = data.data.responses.map(
                    (q: any) => q.questionId
                )
                const responses = data.data
                form?.setFormDetails(formId, false, formData)
                questions?.questionActions?.getQuestions(formId, questionsData)
                responseList?.responseActions?.getResponse(
                    formId,
                    responses,
                    questionsData.map((q: any) => q.required),
                    readonly
                )
                setLoading(false)
            })
        }
        // Admin level access, fetch all responses for csv data
        if (readonly === true && formid && responseOnlyPage === false) {
            downloadResponse(formid).then((data) => {
                if (data) {
                    setColumnsForDownload(data.columns)
                    setDataForDownload(data.dataForDownload)
                }
            })
        }
    }, [responseOnlyPage, responseId, formid, readonly])

    useEffect(() => {
        if (formid && auth?.currentUser && responseOnlyPage === false) {
            // If readonly is true, then access is admin level in case this is not a response only page;
            // hence admin permission needed to view. If readonly is false, it's user level access
            form?.setFormDetails(formid, readonly).then((data) => {
                if (data.status === 400) {
                    setError("Form is closed")
                    setLoading(false)
                    return
                } else if (data.status === 404) {
                    setError("Form doesn't exist")
                    setLoading(false)
                    return
                }
            })
            getQuestionsAndResponses(formid, readonly).then((data) => {
                if (data.status === 400 || data.status === 404) {
                    return
                }
                questions?.questionActions?.getQuestions(formid, data.ques)
                if (data.prevResponse === null) {
                    data.prevResponse = {
                        responses: [],
                        questions: data.ques,
                        userid: auth?.currentUser?.userid,
                        username: auth?.currentUser?.username,
                    }
                }
                // No need to fetch responses in case of admin level access, just setting formid is enough
                if (!readonly) {
                    responseList?.responseActions?.getResponse(
                        formid,
                        data.prevResponse,
                        data.ques.map((q: any) => q.required),
                        readonly
                    )
                } else responseList?.responseActions?.setFormId(formid)
                if (!readonly) setLoading(false)
            })
        }
    }, [formid, auth?.currentUser, responseOnlyPage])

    useEffect(() => {
        // Get list of all users and corresponding response IDs for current form
        // This is for /responses/:formid page
        if (
            readonly &&
            responseList?.formId?.length &&
            responseOnlyPage === false
        ) {
            responseList?.responseActions?.getUsers().then((data) => {
                setCurrentUser(data[0])
                setLoading(false)
            })
        }
    }, [responseList?.formId, responseOnlyPage])
    useEffect(() => {
        if (currentUser && readonly && responseOnlyPage === false) {
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
                        formid,
                        data.data,
                        questions.questions.map((q) => q.required),
                        readonly
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
    if (thankYou) {
        return (
            <div className="display-form-page">
                <b>Your response has been submitted!</b>
                <br />
                {/* if form is accepting multiple */}
                {form?.currentForm?.multipleResponses ? (
                    <button
                        onClick={() => {
                            setLoading(true)
                            responseList?.responseActions?.clearResponse(
                                questions?.questions ? questions.questions : []
                            )
                            setTimeout(() => {
                                setLoading(false)
                                setThankYou(false)
                            }, 10)
                        }}
                    >
                        Submit another response?
                    </button>
                ) : (
                    <div>We accept only 1 response per user</div>
                )}

                <br />
                {/* if form is editable */}
                {form?.currentForm?.editable ? (
                    <button onClick={() => setThankYou(false)}>
                        Edit form?
                    </button>
                ) : (
                    <div>You cannot edit this form</div>
                )}

                <br />
                <button
                    onClick={() => {
                        auth?.logout()
                    }}
                >
                    Logout
                </button>
            </div>
        )
    }

    return (
        <div className="display-form-page">
            {readonly === true && responseOnlyPage === false && (
                <AdminNavbar questionsPage={false} />
            )}
            <div className="display-form-container">
                <div>
                    {readonly === true && responseOnlyPage === false ? (
                        <CsvDownloader
                            filename={form?.currentForm?.title || ""}
                            extension={".csv"}
                            columns={columnsForDownload}
                            datas={dataForDownload ? dataForDownload : []}
                            text={"Click  to download responses"}
                        />
                    ) : null}
                    <br />
                    {responseList?.users?.length ? (
                        <div className="select">
                            <select defaultValue={currentUser?.username}>
                                {responseList?.users.map(
                                    (user: any, i: number) => {
                                        return (
                                            <option
                                                key={i}
                                                value={user.username}
                                                onClick={(e) => {
                                                    setCurrentUser(user)
                                                }}
                                            >
                                                {user.username}
                                            </option>
                                        )
                                    }
                                )}
                            </select>
                            <span className="select-arrow"></span>
                        </div>
                    ) : null}
                </div>
                <div className="display-form-component form-header">
                    <h2>{form?.currentForm?.title}</h2>

                    <p>{form?.currentForm?.description}</p>
                </div>
                {responseList?.readOnly === false ? (
                    <button
                        onClick={() => {
                            setLoading(true)
                            responseList?.responseActions?.clearResponse(
                                questions?.questions ? questions.questions : []
                            )
                            setTimeout(() => {
                                setLoading(false)
                            }, 10)
                        }}
                    >
                        Click to clear responses
                    </button>
                ) : null}
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
                {responseList?.submitError && (
                    <b style={{ color: "red" }}>{responseList?.submitError}</b>
                )}
                {readonly ? null : form?.currentForm?.isActive ? (
                    <button
                        className="form-submit-btn"
                        onClick={() => {
                            responseList?.responseActions
                                ?.submit(sendMail)
                                .then((data: any) => {
                                    if (data.success) {
                                        setThankYou(true)
                                    }
                                })
                        }}
                    >
                        Submit
                    </button>
                ) : null}
                {!readonly && form?.currentForm?.isActive ? (
                    <p>
                        <input
                            type="checkbox"
                            defaultChecked={sendMail}
                            onChange={() => setSendMail(!sendMail)}
                        ></input>
                        Send me a mail of my response
                    </p>
                ) : null}
            </div>
        </div>
    )
}
export default DisplayForm
