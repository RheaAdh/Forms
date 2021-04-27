import React, { useEffect, useState } from "react"
import { Redirect, useParams } from "react-router-dom"
import { IndexType } from "typescript"
import QuestionResponse from "../components/QuestionResponse"
import { useAuth } from "../context/AuthContext"

const DisplayForm = () => {
    const auth = useAuth()

    const [form, setForm] = useState(null)
    const [responses, setResponses] = useState<any[]>([])
    const [questions, setQuestions] = useState<any[]>([])
    const [canSubmit, setCanSubmit] = useState<boolean[]>([])
    const [submitError, setSubmitError] = useState<string | null>(null)
    const [thankYou, setThankYou] = useState<boolean>(false)
    const { formid }: any = useParams()

    useEffect(() => {
        auth?.getCurrentUser()
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
                console.log(data)
                setForm(data)
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
                //!!Above request has both prev_resp and questions --->prev_resp needs to be implemented in frontend
                .then((resp) => resp.json())
                .then((DATA) => {
                    console.log("Data is here")
                    console.log(DATA)
                    let data=DATA.ques
                    data.map((q: any, idx: Number) => {
                        console.log(q)
                        console.log(idx)
                        setResponses((prevResponses) => [
                            ...prevResponses,
                            {
                                answerType: q["question-type"],
                                questionId: q["_id"],
                            },
                        ])
                        setCanSubmit((prevState) => [
                            ...prevState,
                            !q["required"],
                        ])
                    })
                    setQuestions(data)
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
        console.log(resp)
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
            userid:auth?.currentUser?.userid,
            formId: formid,
            responses: responses,
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
            style={{ backgroundColor: form?.["color_theme"], height: "100vh" }}
        >
            {questions?.map((q, idx) => {
                return (
                    <QuestionResponse
                        question={q}
                        handleChange={handleChange}
                        index={idx}
                        key={idx}
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
