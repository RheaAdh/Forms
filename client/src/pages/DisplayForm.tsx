import React, { useEffect, useState } from "react"
import { Redirect, useParams } from "react-router-dom"
import QuestionResponse from "../components/QuestionResponse"
import { useAuth } from "../context/AuthContext"
import { useCurrentForm } from "../context/CurrentFormContext"
import getQuestionsAndResponses, {
    getByResponseIdPublic,
    downloadResponse,
    getByResponseId,
} from "../context/Actions"
import CsvDownloader from "react-csv-downloader"
import { useResponses, user } from "../context/ResponseListContext"
import { Question, useQuestionsList } from "../context/QuestionListContext"

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
        return <div>Loading</div>
    }
    if (error) {
        return <div>{error}</div>
    }
    if (auth?.currentUser === null && responseOnlyPage === false) {
        return <Redirect to={`/login/${formid}`} />
    }

    if (thankYou) {
        return (
            <div>
                <b>Your response has been submitted!</b>
                <br />
                {/* if form is accepting multiple */}
                {form?.currentForm?.mulitipleResponses ? (
                    <button
                        onClick={() => {
                            setLoading(true)
                            responseList?.responseActions?.anotherResponse(
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
        <div
            style={{
                backgroundColor: "#E5E5E5",
                height: "100vh",
                overflowY: "auto",
            }}
        >
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
                    <select defaultValue={currentUser?.username}>
                        {responseList?.users.map((user: any, i: number) => {
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
                        })}
                    </select>
                ) : null}
            </div>
            <div
                style={{
                    left: " 21.04%",
                    right: "16.51%",
                    top: " 5.37%",
                    bottom: "66.76%",
                    background: "rgba(190, 190, 190, 0.1)",
                    borderRadius: "20px",
                    backdropFilter: " blur(99.6667px)",
                }}
            >
                <h1
                    style={{
                        left: "23.49%",
                        right: "64.84%",
                        top: "7.13%",
                        bottom: "83.8%",
                        fontFamily: "Catamaran",
                        fontWeight: "bold",
                        fontSize: "60px",
                        lineHeight: "98px",
                        letterSpacing: "0.03em",
                    }}
                >
                    {form?.currentForm?.title}
                </h1>

                <p>{form?.currentForm?.description}</p>
            </div>
            {responseList?.readOnly === false ? (
                <button
                    onClick={
                        () => {
                            setLoading(true)
                            responseList?.responseActions?.anotherResponse(
                                questions?.questions ? questions.questions : []
                            )
                            setTimeout(() => {
                                setLoading(false)
                            }, 10)
                        }
                        // Another response just clears the responses
                    }
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
            <b style={{ color: "red" }}>{responseList?.submitError}</b>
            <br />
            {!responseOnlyPage ? (
                <div>
                    {form?.currentForm?.isActive ? (
                        <p>form is open</p>
                    ) : (
                        <p>form is closed</p>
                    )}
                    {!form?.currentForm?.editable &&
                    form?.currentForm?.isActive ? (
                        <p>This form is not editable</p>
                    ) : null}
                    {form?.currentForm?.mulitipleResponses &&
                    form?.currentForm?.isActive ? (
                        <p>This form accepts multiple responses</p>
                    ) : null}
                </div>
            ) : null}
            {readonly ? null : form?.currentForm?.isActive ? (
                <div>
                    <button
                        style={{
                            left: "21.09%",
                            right: " 72.55%",
                            top: "76.3%",
                            bottom: "20.09%",
                            background: "#8B64EA",
                            borderRadius: "5px",
                            color: "white",
                            cursor: "pointer",
                        }}
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
                </div>
            ) : null}
            {!readonly && form?.currentForm?.isActive ? (
                <>
                    <input
                        type="checkbox"
                        defaultChecked={sendMail}
                        onChange={() => setSendMail(!sendMail)}
                    ></input>
                    Send me a mail of my response
                </>
            ) : null}
        </div>
    )
}
export default DisplayForm
