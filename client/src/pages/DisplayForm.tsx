import React, { useEffect, useState } from "react"
import { Redirect, useParams } from "react-router-dom"
import QuestionResponse from "../components/QuestionResponse"
import { useAuth } from "../context/AuthContext"

interface props {
    readonly: boolean
}

const DisplayForm: React.FC<props> = ({ readonly }) => {
    const auth = useAuth()

    const [form, setForm] = useState<any>(null)
    const [responses, setResponses] = useState<any[]>([])
    const [questions, setQuestions] = useState<any[]>([])
    const [canSubmit, setCanSubmit] = useState<boolean[]>([])
    const [users, setUsers] = useState<any[]>([])
    const [currentUser, setCurrentUser] = useState<any>(null)
    const [submitError, setSubmitError] = useState<string | null>(null)
    const [thankYou, setThankYou] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(true)
    const { formid }: any = useParams()

    useEffect(() => {
        auth?.getCurrentUser()
    }, [])

    useEffect(() => {
        if (formid)
            fetch(`http://localhost:7000/api/getform/${formid}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            })
                .then((resp) => resp.json())
                .then((data) => {
                    if (data.success) {
                        setForm(data.form)
                        console.log("GET FORM", data.form)
                    }
                })
                .catch((err) => console.log(err))
    }, [formid])

    useEffect(() => {
        if (form)
            fetch(`http://localhost:7000/api/getquestionsbyformid/${formid}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            })
                .then((resp) => resp.json())
                .then((data) => {
                    // if not readonly, check for previous responses of current user
                    // and set accordingly
                    // mapping through data["ques"] instead of prevResponses so that if there's no
                    // prevResponse, can set to default state
                    if (!readonly) {
                        data["ques"].map((q: any, idx: Number) => {
                            setResponses((prevResponses) => [
                                ...prevResponses,
                                data["prevResponse"]
                                    ? data["prevResponse"].responses[
                                          idx as number
                                      ]
                                    : {
                                          answerType: q["question-type"],
                                          questionId: q["_id"],
                                      },
                            ])
                            // Status indicating if user can submit the form initially
                            // Cannot submit if required. Can submit if user is editing form
                            // since form has been submitted already.
                            setCanSubmit((prevState) => [
                                ...prevState,
                                !q["required"] ||
                                    (data["prevResponse"] ? true : false),
                            ])

                            return null
                        })
                        setLoading(false)
                    }
                    setQuestions(data["ques"])
                })
    }, [form])

    useEffect(() => {
        // if form exists and page is readonly, get list of ALL users who have filled the form
        // This is for admin to view responses user-wise
        console.log("form")
        console.log(form)
        console.log("over form")

        if (form && readonly)
            fetch(
                `http://localhost:7000/api/responsesidbyformfilled/${formid}`,
                {
                    method: "GET",
                    headers: {
                        "Content-type": "application/json",
                    },
                    credentials: "include",
                }
            )
                .then((resp) => {
                    return resp.json()
                })
                .catch((err) => console.log(err))
                .then((data) => {
                    if (data.success) {
                        // [{1,A},{2,B}...]
                        setUsers(data.data)

                        setCurrentUser(data.data[0])
                    } else {
                        console.log(data.data)
                    }
                })
    }, [form])

    useEffect(() => {
        console.log("curruser00000")
        console.log(currentUser)
        console.log("over curruser")
        console.log("users")

        console.log(users)
        console.log("over users")

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
                        setResponses(data.data.responses)
                        console.log("ahhhhhhhhhhhhhhh")

                        console.log(responses)
                    } else {
                        console.log("no successssss")

                        console.log(data.data)
                    }
                    setLoading(false)
                })
        }
        console.log("ressssssssssssssssssss")
        console.log(currentUser)

        // console.log(responses)
    }, [currentUser])

    const submitStatus = (index: any, status: boolean) => {
        let s = canSubmit
        s[index] = status
        setCanSubmit(s)
    }
    const handleChange = (index: any, answer: any) => {
        let resp = responses
        resp[index] = answer
        setResponses(resp)
    }

    const isFalse = (f: boolean) => !f

    const handleSubmit = () => {
        if (canSubmit.some(isFalse)) {
            setSubmitError(
                "Please make sure all the details have been filled correctly"
            )
            return
        } else setSubmitError(null)
        const body = {
            username: auth?.currentUser?.username,
            userid: auth?.currentUser?.userid,
            formId: formid,
            responses: responses.filter((resp: any) => JSON.stringify(resp)),
        }
        if (auth?.currentUser === null) {
            setSubmitError("You are not logged in")
            return
        }
        fetch("http://localhost:7000/api/submitresponse", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(body),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    setThankYou(true)
                } else {
                    console.log("We have a problem")
                }
            })
    }

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
            {form?.multipleResponses ? (
                <a href={`http://localhost:3000/form/${formid}`}>
                    <button>Submit another response?</button>
                </a>
            ) : (
                <div>We accept only 1 response per user</div>
            )}

            <br />
            {/* if form is editable */}
            {form?.isEditable ? (
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
                {console.log(users.length)}
                {users.length ? (
                    <div>
                        {/* dropdown wasnt working i think some browser issue */}
                        {users.map((user: any, i: Number) => {
                            return (
                                <button
                                    value={user.username}
                                    onClick={(e) => {
                                        setCurrentUser(user)
                                        console.log("e=")
                                        console.log(user)
                                    }}
                                >
                                    {user.username}
                                </button>
                            )
                        })}
                    </div>
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
                    backdropFilter: " blur(99.6667px);",
                }}
            >
                <h1
                    style={{
                        left: "23.49%;",
                        right: "64.84%;",
                        top: "7.13%;",
                        bottom: "83.8%;",

                        fontFamily: "Catamaran;",
                        fontWeight: "bold",
                        fontSize: "60px;",
                        lineHeight: "98px;",
                        letterSpacing: "0.03em;",

                        // color: #000000;
                    }}
                >
                    {form?.title}
                </h1>

                <p>{form?.description}</p>
            </div>
            {questions.map((q: any, idx: number) => {
                return (
                    <QuestionResponse
                        readonly={readonly}
                        question={q}
                        prevResponse={responses[idx]}
                        handleChange={handleChange}
                        index={idx}
                        key={q["_id"]}
                        submitStatus={submitStatus}
                    />
                )
            })}
            <b style={{ color: "red" }}>{submitError}</b>
            <br />
            <div>
                {form.isActive ? <b>form is open</b> : <b>form is closed</b>}
            </div>

            {readonly ? null : form.isActive ? (
                <div>
                    <button
                        style={{
                            left: "21.09%;",
                            right: " 72.55%;",
                            top: "76.3%",
                            bottom: "20.09%",
                            background: "#8B64EA",
                            borderRadius: "5px;",
                            color: "white",
                        }}
                        onClick={handleSubmit}
                    >
                        Submit
                    </button>
                </div>
            ) : null}
        </div>
    )
}

export default DisplayForm
