import React, { useState, useEffect, useRef } from "react"
import { useParams } from "react-router-dom"
import QuestionList from "../../components/admin/QuestionList"
import PermissionList from "../../components/admin/PermissionList"
import { useAuth } from "../../context/auth/AuthContext"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import "../../styles/EditFormPage.css"
import { IForm, useCurrentForm } from "../../context/form/CurrentFormContext"
import autoAdjustHeight from "../../utils/util"
import AdminNavbar from "../../components/admin/AdminNavbar"
import Loading from "../../components/shared/Loading"
import ErrorPopup from "../../components/shared/ErrorPopup"
import SwitchButton from "../../components/shared/SwitchButton"
import { useQuery } from "react-query"
import { getForm } from "../../context/form/FormActions"
import { useQuestionsList } from "../../context/questions/QuestionListContext"
import useDocumentTitle from "../../hooks/useDocumentTitle"
import useUpdateForm from "../../hooks/useUpdateForm"

interface headerProps {
    form: IForm | null
}

const FormAttributes = ({ form }: headerProps) => (
    <div className="edit-form-component">
        {!form?.currentForm?.isTemplate && (
            <div className="row1">
                <SwitchButton
                    isActive={form?.currentForm?.isActive}
                    setIsActive={() => {
                        form?.setActive(true)
                        form?.setDate(null)
                    }}
                    setNotActive={() => {
                        form?.setActive(false)
                        form?.setDate(new Date())
                    }}
                    activeColor={"green"}
                    inactiveColor={"red"}
                    activeText={"Active"}
                    inactiveText={"Closed"}
                />
            </div>
        )}
        <div className="row2">
            {!form?.currentForm?.isTemplate && (
                <>
                    <h3>Closing date :</h3>
                    <DatePicker
                        selected={form?.currentForm?.date}
                        showTimeSelect
                        dateFormat="dd/MM/yyyy hh:mm"
                        onChange={(date: Date) => {
                            form?.setDate(date)
                        }}
                        placeholderText="dd/mm/yyyy"
                    />
                </>
            )}
        </div>
        <div className="row3">
            <h3>Description:</h3>
            <textarea
                value={form?.currentForm?.description}
                onChange={(e) => {
                    autoAdjustHeight(e)
                    form?.setDescription(e.target.value)
                }}
            ></textarea>
        </div>
    </div>
)

const EditFormPage: React.FC = () => {
    const { formId }: any = useParams()
    const [loading, setLoading] = useState<boolean>(true)
    const [displayPermission, setDisplayPermission] = useState<boolean>(false)
    const questions = useQuestionsList()
    const auth = useAuth()
    const form = useCurrentForm()

    const {} = useQuery("currentForm", () => getForm(formId, true), {
        onSuccess: (data) => {
            if (data.success) form?.setFormDetails(formId, data.data)
            setLoading(false)
        },
    })

    useEffect(() => {
        if (!auth?.currentUser) auth?.getCurrentUser()
        return () => {
            form?.setFormDetails("", null)
            questions?.questionActions?.getQuestions("", [])
        }
    }, [formId])

    useUpdateForm()
    useDocumentTitle(form?.currentForm?.title || "Forms by IECSE")

    if (loading) {
        return <Loading />
    }

    return (
        <div className="edit-form-page">
            <ErrorPopup />
            <AdminNavbar questionsPage={true} />
            {loading ? (
                <Loading />
            ) : (
                <div className="edit-form-container">
                    <FormAttributes form={form} />
                    {!form?.currentForm?.isTemplate && (
                        <div className="radio-checkbox">
                            <input
                                id="set-editable"
                                type="radio"
                                checked={form?.currentForm?.editable || false}
                                onChange={(e) => {
                                    if (e.target.checked) {
                                        form?.setEditable(true)
                                        form?.setMultipleResponses(false)
                                        form?.setAnonymity(false)
                                    }
                                }}
                            ></input>
                            <span className="styled-radio"></span>
                            <label htmlFor="set-editable">Editable</label>
                        </div>
                    )}
                    {!form?.currentForm?.isTemplate && (
                        <div className="radio-checkbox">
                            <input
                                className="radio-checkbox"
                                id="non-editable"
                                type="radio"
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
                            <span className="styled-radio"></span>
                            <label htmlFor="non-editable">Non Editable</label>
                        </div>
                    )}
                    {!form?.currentForm?.isTemplate && (
                        <div className="radio-checkbox">
                            <input
                                className="radio-checkbox"
                                id="anonymous"
                                type="radio"
                                checked={form?.currentForm?.anonymous || false}
                                onChange={(e) => {
                                    if (e.target.checked) {
                                        form?.setAnonymity(true)
                                        form?.setMultipleResponses(true)
                                        form?.setEditable(false)
                                    }
                                }}
                            ></input>
                            <span className="styled-radio"></span>
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
                    {!form?.currentForm?.isTemplate && displayPermission && (
                        <PermissionList
                            close={() => {
                                setDisplayPermission(false)
                            }}
                        />
                    )}
                    <h2>Questions:</h2>
                    <QuestionList />
                </div>
            )}
        </div>
    )
}

export default EditFormPage
