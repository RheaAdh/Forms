import React, { useEffect, useState } from "react"
import { Redirect, useParams } from "react-router"
import getQuestionsAndResponses, {
    getForm,
} from "../../context/form/FormActions"
import { useAuth } from "../../context/auth/AuthContext"
import { useCurrentForm } from "../../context/form/CurrentFormContext"
import {
    Question,
    useQuestionsList,
} from "../../context/questions/QuestionListContext"
import { useResponses } from "../../context/responses/ResponseListContext"
import QuestionResponse from "../../components/shared/QuestionResponse"
import "../../styles/DisplayForm.css"
import Loading from "../../components/shared/Loading"

const FormForUser = () => {
    const auth = useAuth()
    const form = useCurrentForm()
    const responseList = useResponses()
    const questions = useQuestionsList()

    const [thankYou, setThankYou] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
    const [sendMail, setSendMail] = useState<boolean>(false)
    const [currentPageNo, setCurrentPageNo] = useState<number>(1)

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
                getForm(formId, false)
                    .then((data) => {
                        if (data.success) {
                            form?.setFormDetails(formId, data.data)
                        } else {
                            setError(data.msg)
                        }
                    })
                    .catch((err) => console.log(err))
                getQuestionsAndResponses(formId, false, currentPageNo).then(
                    (data) => {
                        if (data.status >= 400) {
                            return
                        }
                        questions?.questionActions?.getQuestions(
                            formId,
                            data.ques
                        )
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
                    }
                )
            }
        }
    }, [formId, auth?.currentUser, form?.currentForm?.anonymous, currentPageNo])

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
                {questions?.questions
                    ?.filter((question) => question.pageNo === currentPageNo)
                    .map((q: Question, idx: number) => {
                        return (
                            <QuestionResponse
                                question={q}
                                prevResponse={responseList?.responses?.find(
                                    (resp) => resp.questionId === q.qid
                                )}
                                index={idx}
                                key={q.qid}
                            />
                        )
                    })}
                {responseList?.submitError && (
                    <b style={{ color: "red" }}>{responseList?.submitError}</b>
                )}
                {
                    // Previous page button
                }
                {currentPageNo > 1 && (
                    <button
                        className="form-submit-btn"
                        onClick={() => setCurrentPageNo((pg) => pg - 1)}
                    >
                        Previous Page
                    </button>
                )}
                {
                    //Save button
                }

                {!form?.currentForm?.anonymous && (
                    <button
                        className="form-submit-btn"
                        onClick={() =>
                            responseList?.responseActions?.submit(false, false)
                        }
                    >
                        Save
                    </button>
                )}
                {
                    // Submit / next page button
                }
                {
                    <button
                        className="form-submit-btn"
                        onClick={() => {
                            if (
                                form?.currentForm?.pages !== undefined &&
                                currentPageNo < form?.currentForm?.pages
                            ) {
                                responseList?.responseActions?.submit(
                                    false,
                                    false
                                )
                                setCurrentPageNo((pg) => pg + 1)
                            } else {
                                responseList?.responseActions
                                    ?.submit(sendMail, true)
                                    .then((data) => {
                                        if (data.success) {
                                            setThankYou(true)
                                        } else {
                                            // HANDLE ERROR
                                        }
                                    })
                            }
                        }}
                    >
                        {currentPageNo === form?.currentForm?.pages
                            ? "Submit"
                            : "Next"}
                    </button>
                }
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
