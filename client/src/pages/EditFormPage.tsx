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
import AdminNavbar from "../components/AdminNavbar"
import Loading from "../components/Loading"

const EditFormPage: React.FC = () => {
    const { formId }: any = useParams()

    const [loading, setLoading] = useState<boolean>(true)
    const [displayPermission, setDisplayPermission] = useState<boolean>(false)
    const auth = useAuth()
    const form = useCurrentForm()

    useEffect(() => {
        if (!auth?.currentUser) auth?.getCurrentUser().then((res: any) => {})
        if (formId !== undefined) {
            form?.setFormDetails(formId, true).then((data) => {
                // ERROR HANDLING NEEDED
                setLoading(false)
            })
        }

        return () => {
            form?.setFormDetails("", false, null)
        }
    }, [formId])

    useEffect(
        () => {
            form?.updateForm()
        },
        // es-lint disable next line
        [
            form?.currentForm?.description,
            form?.currentForm?.editable,
            form?.currentForm?.anonymous,
            form?.currentForm?.date,
            form?.currentForm?.title,
            form?.currentForm?.editors,
            form?.currentForm?.multipleResponses,
        ]
    )

    const toggleForm = () => {
        form?.setActive(!form?.currentForm?.isActive)
        if (form?.currentForm?.isActive) form?.setDate(new Date())
        else form?.setDate(null)
    }

    if (loading) {
        return <Loading />
    }
    return (
        <div className="edit-form-page">
            <AdminNavbar questionsPage={true} />
            <div className="edit-form-container">
                <div className="edit-form-component">
                    <input
                        type="text"
                        className="form-title-editable"
                        defaultValue={form?.currentForm?.title}
                        onChange={(e) => form?.setTitle(e.target.value)}
                    ></input>
                    {!form?.currentForm?.isTemplate && (
                        <div className="date-wrapper">
                            <h3 style={{ marginBottom: "0" }}>
                                Closing date :
                            </h3>
                            <DatePicker
                                selected={form?.currentForm?.date}
                                showTimeSelect
                                dateFormat="MMMM d, yyyy h:mm aa"
                                onChange={(date: Date) => {
                                    form?.setDate(date)
                                }}
                            />
                        </div>
                    )}
                    <h3>Description:</h3>
                    <textarea
                        value={form?.currentForm?.description}
                        onChange={(e) => {
                            autoAdjustHeight(e)
                            form?.setDescription(e.target.value)
                        }}
                    ></textarea>
                    {!form?.currentForm?.isTemplate && (
                        <button onClick={toggleForm}>
                            {form?.currentForm?.isActive
                                ? `Form is active, click to toggle`
                                : `Form has closed, click to toggle`}
                        </button>
                    )}
                </div>
                {!form?.currentForm?.isTemplate && (
                    <div className="radio-checkbox">
                        <input
                            id="set-editable"
                            type="checkbox"
                            checked={form?.currentForm?.editable || false}
                            onChange={(e) => {
                                if (e.target.checked) {
                                    form?.setEditable(true)
                                    form?.setMultipleResponses(false)
                                    form?.setAnonymity(false)
                                }
                            }}
                        ></input>
                        <span className="styled-radio-checkbox"></span>
                        <label htmlFor="set-editable">Editable</label>
                    </div>
                )}
                {!form?.currentForm?.isTemplate && (
                    <div className="radio-checkbox">
                        <input
                            className="radio-checkbox"
                            id="non-editable"
                            type="checkbox"
                            checked={
                                (!form?.currentForm?.editable &&
                                    !form?.currentForm?.anonymous) ||
                                false
                            }
                            onChange={(e) => {
                                if (e.target.checked) {
                                    form?.setEditable(false)
                                    form?.setAnonymity(false)
                                    form?.setMultipleResponses(false)
                                }
                            }}
                        ></input>
                        <span className="styled-radio-checkbox"></span>
                        <label htmlFor="non-editable">Non Editable</label>
                    </div>
                )}
                {!form?.currentForm?.isTemplate && (
                    <div className="radio-checkbox">
                        <input
                            className="radio-checkbox"
                            id="anonymous"
                            type="checkbox"
                            checked={form?.currentForm?.anonymous || false}
                            onChange={(e) => {
                                if (e.target.checked) {
                                    form?.setAnonymity(true)
                                    form?.setMultipleResponses(true)
                                    form?.setEditable(false)
                                }
                            }}
                        ></input>
                        <span className="styled-radio-checkbox"></span>
                        <label htmlFor="anonymous">
                            Anonymous (no login required)
                        </label>
                    </div>
                )}

                {!form?.currentForm?.isTemplate && (
                    <button
                        onClick={() => {
                            setDisplayPermission(true)
                        }}
                    >
                        Set edit permissions
                    </button>
                )}
                {!form?.currentForm?.isTemplate && displayPermission ? (
                    <PermissionList
                        close={() => {
                            setDisplayPermission(false)
                        }}
                    />
                ) : (
                    ""
                )}
                <h2>Questions:</h2>
                <QuestionList />
            </div>
        </div>
    )
}

export default EditFormPage
