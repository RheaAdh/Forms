import React, { useEffect, useState } from "react"
import { renderToString } from "react-dom/server"
import { Redirect, useParams } from "react-router"
import {
    getQuestionsAndResponses,
    getForm,
} from "../../context/form/FormActions"
import { IAuth, useAuth } from "../../context/auth/AuthContext"
import { IForm, useCurrentForm } from "../../context/form/CurrentFormContext"
import {
    IQuestion,
    useQuestionsList,
} from "../../context/questions/QuestionListContext"
import { useResponses } from "../../context/responses/ResponseListContext"
import QuestionResponse from "../../components/shared/QuestionResponse"
import "../../styles/DisplayForm.css"
import Loading from "../../components/shared/Loading"
import FormForUserResponseOnly from "./FormForUserResponseOnly"
import useDocumentTitle from "../../hooks/useDocumentTitle"

interface ThankYouPageProps {
    form: IForm | null
    auth: IAuth | null
}

const ThankYouPage = ({ auth, form }: ThankYouPageProps) => {
    const formId = form?.currentForm?.id

    return (
        <div className="display-form-page">
            <b>Your response has been submitted!</b>
            {/* if form is accepting multiple */}
            {form?.currentForm?.anonymous ? (
                <a href={`/form/${formId}`}>Submit another response?</a>
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

export default () => {
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
        if (formId) {
            // Either this is an anonymous form or user is logged in
            getForm(formId, false)
                .then((data) => {
                    if (data.success) {
                        form?.setFormDetails(data.data)
                    } else {
                        setError(data.msg)
                    }
                })
                .catch((err) => console.log(err))
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
    }, [formId])

    useDocumentTitle(form?.currentForm?.title || "Forms By IECSE")

    const handleSubmit = () => {
        if (
            form?.currentForm?.pages !== undefined &&
            currentPageNo < form?.currentForm?.pages
        ) {
            setCurrentPageNo((pg) => pg + 1)
        } else {
            let element = (
                <FormForUserResponseOnly
                    questions={questions?.questions || null}
                    prevResponses={responseList?.responses || null}
                    form={form?.currentForm || null}
                />
            )
            responseList?.responseActions
                ?.submit(sendMail, true, renderToString(element))
                .then((data) => {
                    if (data.success) {
                        setThankYou(true)
                    } else {
                        // HANDLE ERROR
                    }
                })
        }
    }

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
        return <ThankYouPage form={form} auth={auth} />
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
                    .map((q: IQuestion, idx: number) => {
                        return (
                            <QuestionResponse
                                question={q}
                                prevResponse={responseList?.responses?.find(
                                    (resp) => resp.questionId === q.qid
                                )}
                                key={q.qid}
                            />
                        )
                    })}
                {responseList?.submitError && (
                    <b style={{ color: "red" }}>{responseList.submitError}</b>
                )}
                {
                    // Previous page button
                }
                {currentPageNo > 1 && (
                    <button
                        className="form-submit-btn"
                        onClick={() => setCurrentPageNo((pg) => pg - 1)}
                    >
                        Back
                    </button>
                )}
                {
                    //Save button
                }

                {!form?.currentForm?.anonymous && !responseList?.submitted && (
                    <button
                        className="form-submit-btn"
                        onClick={() =>
                            responseList?.responseActions?.submit(
                                false,
                                false,
                                null
                            )
                        }
                    >
                        Save
                    </button>
                )}
                {
                    // Submit / next page button
                }
                {
                    <button className="form-submit-btn" onClick={handleSubmit}>
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
                        <span className="styled-checkbox"> </span>
                        <label htmlFor="email-response-btn">
                            Mail me my response
                        </label>
                        <span className="checkbox-tick"></span>
                    </div>
                )}
            </div>
        </div>
    )
}
