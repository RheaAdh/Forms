import React, { useEffect, useState } from "react"
import { Redirect, useParams } from "react-router-dom"
import QuestionResponse from "../components/QuestionResponse"
import { useAuth } from "../context/AuthContext"
import { useCurrentForm } from "../context/CurrentFormContext"
import getQuestionsAndResponses, { getByResponseId } from "../context/Actions"
import { useResponses, user } from "../context/ResponseListContext"
import { Question, useQuestionsList } from "../context/QuestionListContext"

interface props {
    readonly: boolean
    responseOnlyPage: boolean
}

const DisplayForm: React.FC<props> = ({ readonly, responseOnlyPage }) => {
    const auth = useAuth()
    const form = useCurrentForm()
    const responseList = useResponses()
    const questions = useQuestionsList()
    const [formClosed, setFormClosed] = useState<boolean>(false)
    const [invalidId, setInvalidId] = useState<boolean>(false)
    const [currentUser, setCurrentUser] = useState<user | null>(null)
    const [thankYou, setThankYou] = useState<boolean>(false)
    // HANDLE LOADING
    const [loading, setLoading] = useState<boolean>(true)
    const { formid, responseId }: any = useParams()
    const [prevSubmission, setPrevSubmission] = useState<boolean>(true)

    useEffect(() => {
        if (auth?.currentUser === null && !responseOnlyPage)
            auth?.getCurrentUser()
        if (responseOnlyPage && responseId) {
            getByResponseId(responseId).then((data) => {
                if (data.success) {
                    const formId = data.data.formId._id
                    const formData = data.data.formId
                    const questionsData = data.data.responses.map(
                        (q: any) => q.questionId
                    )
                    const responses = data.data
                    form?.setFormDetails(formId, false, formData)
                    questions?.questionActions?.getQuestions(
                        formId,
                        questionsData
                    )
                    responseList?.responseActions?.getResponse(
                        formId,
                        responses,
                        questionsData.map((q: any) => q.required)
                    )
                    setLoading(false)
                }
            })
        }
    }, [responseOnlyPage, responseId])

    useEffect(() => {
        if (formid && auth?.currentUser && responseOnlyPage === false) {
            // If readonly is true, then access is admin level, hence edit permission needed to view
            // If readonly is false, it's user level access, hence toEdit is false
            form?.setFormDetails(formid, readonly).then((data) => {
                if (data.status === 400) {
                    setFormClosed(true)
                    setLoading(false)
                    return
                } else if (data.status === 404) {
                    setInvalidId(true)
                }
            })
            getQuestionsAndResponses(formid, false).then((data) => {
                if (data.status === 400) {
                    setFormClosed(true)
                    return
                } else if (data.status === 404) {
                    setInvalidId(true)
                    return
                }
                questions?.questionActions?.getQuestions(formid, data.ques)
                if (data.prevResponse === null) {
                    setPrevSubmission(false)
                    data.prevResponse = {
                        responses: [],
                        questions: data.ques,
                        userid: auth?.currentUser?.userid,
                        username: auth?.currentUser?.username,
                    }
                }
                // just to check if it's not undefined

                responseList?.responseActions?.getResponse(
                    formid,
                    data.prevResponse,
                    data.ques.map((q: any) => q.required)
                )
                if (!readonly) setLoading(false)
            })
        }
    }, [formid, auth?.currentUser, responseOnlyPage])

    useEffect(() => {
        if (
            readonly &&
            responseList?.formId?.length &&
            responseList?.users === undefined &&
            responseOnlyPage === false
        ) {
            responseList?.responseActions
                ?.getUsers()
                .then((data) => setCurrentUser(data[0]))
        }
    }, [responseList?.formId, responseOnlyPage])
    useEffect(() => {
        if (
            form?.currentForm?.editable !== undefined &&
            responseOnlyPage === false
        )
            responseList?.responseActions?.setReadOnly(
                readonly || (!form?.currentForm?.editable && prevSubmission)
            )
    }, [
        readonly,
        form?.currentForm?.editable,
        prevSubmission,
        responseOnlyPage,
    ])
    useEffect(() => {
        if (currentUser && readonly && responseOnlyPage === false) {
            // Get responses for current user
            setLoading(true)
            fetch(
                `http://localhost:7000/api/resbyresponseid/${currentUser.responseid}`,
                {
                    method: "GET",
                    headers: {
                        "Content-type": "application/json",
                    },
                    credentials: "include",
                }
            )
                .then((resp) => resp.json())
                .catch((err) => console.log(err))
                .then((data) => {
                    if (data.success) {
                        //CHANGE TO CONTEXT
                        if (questions?.questions)
                            // just to check if it's not undefined
                            responseList?.responseActions?.getResponse(
                                formid,
                                data.data,
                                questions.questions.map((q) => q.required)
                            )
                    } else {
                        console.log(data.data)
                    }
                    setLoading(false)
                })
        }
    }, [currentUser])
    if (loading) {
        return <div>Loading</div>
    }
    if (formClosed) return <>Form is closed</>
    if (invalidId) return <>You may have got the wrong link</>
    if (auth?.currentUser === null && responseOnlyPage === false) {
        return <Redirect to={`/login/${formid}`} />
    }
    return thankYou ? (
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
                            setPrevSubmission(false)
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
                <a href={`http://localhost:3000/form/${formid}`}>
                    <button>Edit form?</button>
                </a>
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
    ) : (
        <div
            style={{
                backgroundColor: "#E5E5E5",
                height: "100vh",
                overflowY: "auto",
            }}
        >
            <div>
                {responseList?.users?.length ? (
                    <select defaultValue={currentUser?.username}>
                        {responseList?.users.map((user: any, i: Number) => {
                            return (
                                <option
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
                            if (
                                form?.currentForm?.mulitipleResponses &&
                                prevSubmission
                            ) {
                                setLoading(true)
                                responseList?.responseActions?.anotherResponse(
                                    questions?.questions
                                        ? questions.questions
                                        : []
                                )
                                setTimeout(() => {
                                    setLoading(false)
                                    setPrevSubmission(false)
                                }, 10)
                            } else {
                                responseList?.responseActions
                                    ?.submit()
                                    .then((data: any) => {
                                        if (data.success) {
                                            setThankYou(true)
                                        }
                                    })
                            }
                        }}
                    >
                        {form?.currentForm?.mulitipleResponses &&
                        prevSubmission ? (
                            <>Submit another response</>
                        ) : (
                            <>Submit</>
                        )}
                    </button>
                </div>
            ) : null}
        </div>
    )
}

export default DisplayForm
