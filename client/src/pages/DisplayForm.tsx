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
                        //console.log("GET FORM", data.form)
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
                        setUsers(data.data)
                        setCurrentUser(data.data[0])
                    } else {
                        console.log(data.data)
                    }
                })
    }, [form])

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
                        setResponses(data.data.responses)
                    } else {
                        console.log(data.data)
                    }
                    setLoading(false)
                })
        }
        console.log(currentUser)
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
            <b>Your response has been submitted</b>
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
                backgroundColor: form?.color_theme,
                height: "100vh",
                overflowY: "auto",
            }}
        >
            <div>
                {users.length ? (
                    <select defaultValue={currentUser.username}>
                        {users.map((user: any, i: Number) => {
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
            <h2>{form?.title}</h2>
            <p>{form?.description}</p>
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
            {readonly ? null : <button onClick={handleSubmit}>Submit</button>}
        </div>
    )
}

export default DisplayForm
