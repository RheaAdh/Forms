import React, { useState, useEffect, useRef } from "react"
import { Link, Redirect, useParams } from "react-router-dom"

import QuestionList from "../components/QuestionList"
import PermissionList from "../components/PermissionList"

import { useAuth } from "../context/AuthContext"

import DatePicker from "react-datepicker"

import "react-datepicker/dist/react-datepicker.css"

import "../styles/EditFormPage.css"
import { useCurrentForm } from "../context/CurrentFormContext"
import autoAdjustHeight from "../util"

const EditFormPage: React.FC = () => {
    const { formid }: any = useParams()

    const [showEditTitle, setShowEditTitle] = useState<boolean>(false)

    const [loading, setLoading] = useState<boolean>(true)

    const inputRef = useRef<HTMLInputElement>(null)

    const [displayPermission, setDisplayPermission] = useState<boolean>(false)

    const auth = useAuth()
    const form = useCurrentForm()

    const [allAdmins, setAdmins] = useState<any[]>([])

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
            form?.currentForm?.title?.length &&
            auth?.currentUser?.userid?.length
        ) {
            setLoading(false)
        }
    }, [form?.currentForm?.title, auth?.currentUser?.userid])

    //SHOW AND HIDE EDIT FORM TITLE LOGIC
    useEffect(() => {
        if (showEditTitle) {
            if (null !== inputRef.current) inputRef.current.focus()
        }
    }, [showEditTitle])

    useEffect(
        () => {
            form?.updateForm()
        },
        // es-lint disable next line
        [
            form?.currentForm?.description,
            form?.currentForm?.editable,
            form?.currentForm?.multipleResponses,
            form?.currentForm?.date,
            form?.currentForm?.title,
            form?.currentForm?.editors,
        ]
    )

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
    return (
        <div className="edit-form-page">
            <div className="edit-form-container">
                <Link to="/">
                    <button>Back</button>
                </Link>
                <div className="edit-form-component">
                    {showEditTitle ? (
                        <input
                            onBlur={() => setShowEditTitle(false)}
                            type="text"
                            defaultValue={form?.currentForm?.title}
                            onChange={(e) => form?.setTitle(e.target.value)}
                            ref={inputRef}
                        ></input>
                    ) : (
                        <h1 onClick={handleTitleClick}>
                            {form?.currentForm?.title}
                        </h1>
                    )}
                    <button>
                        {form?.currentForm?.isActive
                            ? `Form is active, click to toggle`
                            : `Form has closed, click to toggle`}
                    </button>
                    <h3>Description:</h3>
                    <textarea
                        value={form?.currentForm?.description}
                        onChange={(e) => {
                            autoAdjustHeight(e)
                            form?.setDescription(e.target.value)
                        }}
                    ></textarea>
                </div>
                <h3>Closing date :</h3>
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
                        checked={form?.currentForm?.multipleResponses || false}
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
                        setDisplayPermission(true)
                    }}
                >
                    Set edit permissions
                </button>
                {displayPermission ? <PermissionList close={()=>{setDisplayPermission(false)}}/> : ""}
                <h2>Questions:</h2>
                <QuestionList />
            </div>
        </div>
    )
}

//!POSTMAN COPY-PASTE
// "formid": "5fb61c61ac3bc523cf528434",
// "questionType": "mcq-answer",
// "questionText": "Who is your favourite Rick?",
// "options": [{"text": "Rick Riordan"}, {"text": "Rick Sanchez"}, {"text": "Rick Astley"}]

export default EditFormPage
