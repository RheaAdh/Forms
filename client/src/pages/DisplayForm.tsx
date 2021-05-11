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
    const [currentUser, setCurrentUser] = useState<any>()
    const [submitError, setSubmitError] = useState<string | null>(null)
    const [thankYou, setThankYou] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(true)
    const { formid }: any = useParams()
    console.log(formid)

    useEffect(() => {
        auth?.getCurrentUser().then((res: any) => setLoading(false))
    }, [])
    useEffect(() => {
        fetch(`http://localhost:7000/api/getform/${formid}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        })
            .then((resp) => resp.json())
            .then((data) => {
                if (data.success) console.log(data.form)
                else console.log("SOmething went wrong")

                setForm(data.form)
            })
    }, [])

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
                    if (!readonly)
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
                            setCanSubmit((prevState) => [
                                ...prevState,
                                !q["required"],
                            ])
                        })
                    setQuestions(data["ques"])
                })
    }, [form])

    useEffect(() => {
        // if form exists and page is readonly, get list of ALL users who have filled the form
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
                    //console.log(resp)
                    return resp.json()
                })
                .catch((err) => console.log(err))
                .then((data) => {
                    console.log(data)
                    if (data.success) {
                        setUsers(data.data)
                        setCurrentUser(data.data[0])
                    } else {
                        console.log(data.data)
                    }
                })
    }, [form])

    useEffect(() => {
        if (currentUser)
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
                    console.log(data)
                    if (data.success) {
                        setResponses(data.data.responses)
                    } else {
                        console.log(data.data)
                    }
                })
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

    if (auth?.currentUser === null) {
        return <Redirect to={`/login/${formid}`} />
    }
    console.log(responses)
    return thankYou ? (
        <div>
            <b>Your response has been submitted</b>
            <br />
            <button
                onClick={() => {
                    auth?.logout()
                    console.log("Logged out")
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
                    <select defaultValue={users[0].username}>
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
            {questions.map((q: any, idx: Number) => {
                return (
                    <QuestionResponse
                        readonly={readonly}
                        question={q}
                        prevResponse={responses[idx as number]}
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
