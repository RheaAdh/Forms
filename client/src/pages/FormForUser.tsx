import React, { useEffect, useState } from "react"
import { Redirect, useParams } from "react-router"
import getQuestionsAndResponses from "../context/Actions"
import { useAuth } from "../context/AuthContext"
import { useCurrentForm } from "../context/CurrentFormContext"
import { Question, useQuestionsList } from "../context/QuestionListContext"
import { useResponses } from "../context/ResponseListContext"
import QuestionResponse from "../components/QuestionResponse"
import "../styles/DisplayForm.css"
import Loading from "../components/Loading"

const FormForUser = () => {
    const auth = useAuth()
    const form = useCurrentForm()
    const responseList = useResponses()
    const questions = useQuestionsList()

    const [thankYou, setThankYou] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
    const [sendMail, setSendMail] = useState<boolean>(false)

    const { formId }: any = useParams()

    useEffect(() => {
        if (formId !== undefined) {
            form?.getAnonymity(formId).then((data) => {
                if (!data.success) {
                    setError(data.msg)
                    return
                }
                if (!data.data) {
                    auth?.getCurrentUser()
                }
            })
        }
    }, [formId])

    useEffect(() => {
        if (formId && form?.currentForm?.anonymous !== undefined) {
            // Either this is an anonymous form or user is logged in

            if (
                form?.currentForm?.anonymous === true ||
                (auth?.currentUser && auth.currentUser.role !== "x")
            ) {
                form?.setFormDetails(formId, false).then((data) => {
                    if (!data.success) {
                        setError(data.msg)
                        setLoading(false)
                    }
                })

                getQuestionsAndResponses(formId, false).then((data) => {
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
                    responseList?.responseActions?.getResponse(
                        formId,
                        data.prevResponse,
                        data.ques.map((q: any) => q.required),
                        false
                    )
                    setLoading(false)
                })
            }
        }
    }, [formId, auth?.currentUser, form?.currentForm?.anonymous])

    // If not an anonymous form and user hasn't logged in
    if (
        form?.currentForm?.anonymous === false &&
        auth?.currentUser?.role === "x"
    ) {
        return <Redirect to={`/login/${formId}`} />
    }

    if (loading) {
        return <Loading />
    }

    if (error) {
        return <div className="display-form-page">{error}</div>
    }

    if (thankYou) {
        return (
            <div className="display-form-page">
                <b>Your response has been submitted!</b>
                {/* if form is accepting multiple */}
                {form?.currentForm?.anonymous ? (
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
                {form?.currentForm?.editable ? (
                    <a href={`/form/${formId}`}>Edit form?</a>
                ) : (
                    <div>You cannot edit this form</div>
                )}
                {!form?.currentForm?.anonymous && (
                    <button
                        onClick={() => {
                            auth?.logout()
                            window.location.reload()
                        }}
                    >
                        Logout
                    </button>
                )}
            </div>
        )
    }

    return (
        <div className="display-form-page">
            <div className="display-form-container no-navbar">
                <div className="display-form-component form-header">
                    <h2>{form?.currentForm?.title}</h2>

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
                {responseList?.submitError && (
                    <b style={{ color: "red" }}>{responseList?.submitError}</b>
                )}
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
                {responseList?.readOnly === false ? (
                    <button
                        className="form-submit-btn"
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
                {!form?.currentForm?.anonymous && (
                    <div className="radio-checkbox">
                        <input
                            type="checkbox"
                            defaultChecked={sendMail}
                            onChange={() => setSendMail(!sendMail)}
                            id="email-response-btn"
                        ></input>
                        <span className="styled-radio"> </span>
                        <label htmlFor="email-response-btn">
                            Send me a mail of my response
                        </label>
                    </div>
                )}
            </div>
        </div>
    )
}

export default FormForUser
