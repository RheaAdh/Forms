import React, { useState, useEffect, useRef } from "react"
import { Link, Redirect, useParams } from "react-router-dom"

import QuestionList from "../components/QuestionList"
import PermissionList from "../components/PermissionList"

import { useAuth } from "../context/AuthContext"

import DatePicker from "react-datepicker"

import "react-datepicker/dist/react-datepicker.css"

import "../styles/EditFormPage.css"
import { useCurrentForm } from "../context/CurrentFormContext"

const EditFormPage: React.FC = () => {
    const { formid }: any = useParams()

    const [showEditTitle, setShowEditTitle] = useState<boolean>(false)

    const [loading, setLoading] = useState<boolean>(true)

    const inputRef = useRef<HTMLInputElement>(null)

    const [displayPermission, setDisplayPermission] = useState<boolean>(false)

    const auth = useAuth()
    const form = useCurrentForm()

    useEffect(() => {
        if (!auth?.currentUser) auth?.getCurrentUser().then((res: any) => {})
        if (formid) {
            form?.setFormDetails(formid, true).then((data) => {
                if (data === null) {
                    //HANDLE ERROR
                }
            })
        }
    }, [formid])

    useEffect(() => {
        if (
            form?.currentForm?.id?.length &&
            auth?.currentUser?.userid?.length
        ) {
            setLoading(false)
        }
    }, [form?.currentForm?.id, auth?.currentUser?.userid])

    //SHOW AND HIDE EDIT FORM TITLE LOGIC
    useEffect(() => {
        if (showEditTitle) {
            if (null !== inputRef.current) inputRef.current.focus()
        }
    }, [showEditTitle])
    const updateForm = () => {
        if (form?.currentForm?.id)
            fetch("http://localhost:7000/api/updateform", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    _id: form.currentForm.id,
                    description: form?.currentForm?.description,
                    isEditable: form?.currentForm?.editable,
                    multipleResponses: form?.currentForm?.mulitipleResponses,
                    closes: form?.currentForm?.date,
                    title: form?.currentForm?.title,
                }),
            })
                .then((response) => response.json())
                .then((data) => {
                    // Success
                })
                .catch((error) => {
                    console.error("Error:", error)
                })
    }

    useEffect(updateForm, [
        form?.currentForm?.description,
        form?.currentForm?.editable,
        form?.currentForm?.mulitipleResponses,
        form?.currentForm?.date,
        form?.currentForm?.title,
    ])

    const handleTitleClick = () => {
        setShowEditTitle(true)
    }

    const toggleForm = () => {
        form?.setActive(!form?.currentForm?.isActive)
        if (form?.currentForm?.isActive) form?.setDate(new Date())
        else form?.setDate(null)
    }

    if (loading) {
        return <div>Loading</div>
    }
    //console.log(form?.closes)
    return form ? (
        auth?.currentUser &&
        (auth?.currentUser.role === "admin" ||
            auth?.currentUser.role === "superadmin") ? (
            <div className="edit-form-page">
                <Link to="/">
                    <button>Back</button>
                </Link>
                {showEditTitle ? (
                    <input
                        onBlur={() => setShowEditTitle(false)}
                        type="text"
                        defaultValue={form?.currentForm?.title}
                        onChange={(e) => form?.setTitle(e.target.value)}
                        ref={inputRef}
                    ></input>
                ) : (
                    <div onClick={handleTitleClick}>
                        <h1>{form.currentForm?.title}</h1>
                    </div>
                )}
                <>
                    {form?.currentForm?.isActive ? (
                        <button
                            onClick={toggleForm}
                            style={{ cursor: "pointer" }}
                        >
                            Form is active, click to toggle
                        </button>
                    ) : (
                        <button
                            onClick={toggleForm}
                            style={{ cursor: "pointer" }}
                        >
                            Form is closed, click to toggle
                        </button>
                    )}
                </>
                <h3>Description:</h3>
                <textarea
                    value={form?.currentForm?.description}
                    onChange={(e) => form.setDescription(e.target.value)}
                    rows={5}
                    cols={80}
                    className="description"
                ></textarea>

                <h4>Closing date :</h4>
                <DatePicker
                    selected={form?.currentForm?.date}
                    showTimeSelect
                    dateFormat="MMMM d, yyyy h:mm aa"
                    onChange={(date: Date) => {
                        form?.setDate(date)
                    }}
                />
                <h4>
                    <input
                        type="checkbox"
                        checked={form?.currentForm?.editable || false}
                        onChange={(e) => {
                            const editVal = e.target.checked
                            form?.setEditable(editVal)
                            form?.setMultipleResponses(!editVal)
                        }}
                    ></input>
                    Editable
                    <input
                        type="checkbox"
                        checked={form?.currentForm?.mulitipleResponses || false}
                        onChange={(e) => {
                            const multiVal = e.target.checked
                            form?.setMultipleResponses(multiVal)
                            form?.setEditable(!multiVal)
                        }}
                    ></input>
                    Multiple responses
                </h4>
                <button
                    onClick={() => {
                        setDisplayPermission(!displayPermission)
                    }}
                >
                    {displayPermission ? "Close" : "Set edit permissions"}
                </button>
                {displayPermission ? (
                    <PermissionList formid={form?.currentForm?.id} />
                ) : (
                    ""
                )}
                <h2>Questions:</h2>
                <QuestionList />
            </div>
        ) : (
            <Redirect to="/login" />
        )
    ) : (
        <div>loading</div>
    )
}

//!POSTMAN COPY-PASTE
// "formid": "5fb61c61ac3bc523cf528434",
// "questionType": "mcq-answer",
// "questionText": "Who is your favourite Rick?",
// "options": [{"text": "Rick Riordan"}, {"text": "Rick Sanchez"}, {"text": "Rick Astley"}]

export default EditFormPage
