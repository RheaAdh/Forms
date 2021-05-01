import React, { useEffect, useState } from "react"
import { Redirect, useParams } from "react-router-dom"
import QuestionResponse from "../components/QuestionResponse"
import { useAuth } from "../context/AuthContext"

const DisplayForm = () => {
    const auth = useAuth()

    const [form, setForm] = useState<any>(null)
    const [responses, setResponses] = useState<any[]>([])
    const [questions, setQuestions] = useState<any[]>([])
    const [canSubmit, setCanSubmit] = useState<boolean[]>([])
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
                    data["ques"].map((q: any, idx: Number) => {
                        setResponses((prevResponses) => [
                            ...prevResponses,
                            data["prevResponse"]
                                ? data["prevResponse"].responses[idx as number]
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
            <h2>{form?.title}</h2>
            {questions.map((q: any, idx: Number) => {
                return (
                    <QuestionResponse
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
            <button onClick={handleSubmit}>Submit</button>
        </div>
    )
}

export default DisplayForm
