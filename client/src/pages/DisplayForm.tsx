import React, { useEffect, useState } from "react"
import { Redirect, useParams } from "react-router-dom"
import QuestionResponse from "../components/QuestionResponse"
import { useAuth } from "../context/AuthContext"
import { useCurrentForm } from "../context/CurrentFormContext"
import getQuestionsAndResponses from "../context/Actions"
import { useResponses, user } from "../context/ResponseListContext"
import { Question, useQuestionsList } from "../context/QuestionListContext"

interface props {
    readonly: boolean
}

const DisplayForm: React.FC<props> = ({ readonly }) => {
    const auth = useAuth()
    const form = useCurrentForm()
    const responseList = useResponses()
    const questions = useQuestionsList()
    const [currentUser, setCurrentUser] = useState<user | null>(null)
    const [thankYou, setThankYou] = useState<boolean>(false)
    // HANDLE LOADING
    const [loading, setLoading] = useState<boolean>(true)
    const { formid }: any = useParams()
    const [prevSubmission, setPrevSubmission] = useState<boolean>(true)

    useEffect(() => {
        if (auth?.currentUser === null) auth?.getCurrentUser()
    }, [])

    useEffect(() => {
        if (formid && auth?.currentUser) {
            // If readonly is true, then access is admin level, hence edit permission needed to view
            // If readonly is false, it's user level access, hence toEdit is false
            form?.setFormDetails(formid, readonly)
            getQuestionsAndResponses(formid).then((data) => {
                // WRONG FORMID ERROR HANDLING NEEDED
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
                responseList?.responseActions?.getResponse(
                    formid,
                    data.prevResponse
                )
                if (!readonly) setLoading(false)
            })
        }
    }, [formid, auth?.currentUser])

    useEffect(() => {
        if (
            readonly &&
            responseList?.formId?.length &&
            responseList?.users === undefined
        ) {
            responseList?.responseActions
                ?.getUsers()
                .then((data) => setCurrentUser(data[0]))
        }
    }, [responseList?.formId])
    useEffect(() => {
        if (form?.currentForm?.editable !== undefined)
            responseList?.responseActions?.setReadOnly(
                readonly || (!form?.currentForm?.editable && prevSubmission)
            )
        console.log(
            readonly,
            form?.currentForm?.editable,
            prevSubmission,
            responseList?.responseActions
        )
    }, [readonly, form?.currentForm?.editable, prevSubmission])
    useEffect(() => {
        if (currentUser && readonly) {
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
                        responseList?.responseActions?.getResponse(
                            formid,
                            data.data
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
    if (form === null) {
        return <div>You got the wrong address</div>
    }
    if (auth?.currentUser === null) {
        return <Redirect to={`/login/${formid}`} />
    }
    return thankYou ? (
        <div>
            <b>Your response has been submitted!</b>
            <br />
            {/* if form is accepting multiple */}
            {form?.currentForm?.mulitipleResponses ? (
                <a href={`http://localhost:3000/form/${formid}`}>
                    <button
                        onClick={() =>
                            responseList?.responseActions?.anotherResponse(
                                questions?.questions ? questions.questions : []
                            )
                        }
                    >
                        Submit another response?
                    </button>
                </a>
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

                        // color: #000000;
                    }}
                >
                    {form?.currentForm?.title}
                </h1>

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
            <b style={{ color: "red" }}>{responseList?.submitError}</b>
            <br />
            <div>
                {form.currentForm?.isActive ? (
                    <p>form is open</p>
                ) : (
                    <p>form is closed</p>
                )}
                {!form?.currentForm?.editable && form?.currentForm?.isActive ? (
                    <p>This form is not editable</p>
                ) : null}
                {form?.currentForm?.mulitipleResponses &&
                form?.currentForm?.isActive ? (
                    <p>This form accepts multiple responses</p>
                ) : null}
            </div>

            {readonly ? null : form.currentForm?.isActive ? (
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
                                form?.currentForm?.isActive &&
                                form?.currentForm?.mulitipleResponses
                            ) {
                                responseList?.responseActions?.anotherResponse(
                                    questions?.questions
                                        ? questions.questions
                                        : []
                                )
                            } else {
                                responseList?.responseActions
                                    ?.submit()
                                    .then((data: any) => {
                                        if (data.success) {
                                            setThankYou(true)
                                        } else {
                                            console.log(data)
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
                    {console.log(
                        responseList?.readOnly,
                        form?.currentForm?.mulitipleResponses,
                        prevSubmission
                    )}
                </div>
            ) : null}
        </div>
    )
}

export default DisplayForm
