import React, { useState, useEffect, useRef } from "react"
import { useParams } from "react-router-dom"
import QuestionList from "../../components/admin/QuestionList"
import PermissionList from "../../components/admin/PermissionList"
import { useAuth } from "../../context/auth/AuthContext"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import "../../styles/EditFormPage.css"
import { IForm, useCurrentForm } from "../../context/form/CurrentFormContext"
import autoAdjustHeight, { validateLinkId } from "../../utils/util"
import AdminNavbar from "../../components/admin/AdminNavbar"
import Loading from "../../components/shared/Loading"
import ErrorPopup from "../../components/shared/ErrorPopup"
import SwitchButton from "../../components/shared/SwitchButton"
import { useQuery } from "react-query"
import { getForm } from "../../context/form/FormActions"
import { useQuestionsList } from "../../context/questions/QuestionListContext"
import useDocumentTitle from "../../hooks/useDocumentTitle"
import useUpdateForm from "../../hooks/useUpdateForm"
import { ReactComponent as DropdownArrow } from "../../images/DropdownArrow.svg"

interface HeaderProps {
    form: IForm | null
}

const FormAttributes = ({ form }: HeaderProps) => (
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

interface OtherFormAttributesProps {
    form: IForm | null
    displayPermission: boolean
    setDisplayPermission: (perm: boolean) => void
}

const OtherFormAttributes = ({
    form,
    displayPermission,
    setDisplayPermission,
}: OtherFormAttributesProps) => {
    const [linkIdError, setLinkIdError] = useState<string>("")
    const [formType, setFormType] = useState<number>(0)

    useEffect(() => {
        if (form?.currentForm?.anonymous === true) {
            setFormType(2)
        } else if (form?.currentForm?.editable === true) {
            setFormType(0)
        } else {
            setFormType(1)
        }
    }, [form?.currentForm?.editable, form?.currentForm?.anonymous])

    return (
        <div className="edit-form-component">
            <div>
                <h3>Link ID</h3>
                <input
                    placeholder={"5 to 25 characters"}
                    type="text"
                    onChange={(e) => {
                        form?.setLinkId(e.target.value)
                    }}
                    onBlur={async () =>
                        form?.setLinkId(
                            await validateLinkId(
                                form?.currentForm?.id || "",
                                form?.currentForm?.linkId,
                                (error: string) => setLinkIdError(error)
                            )
                        )
                    }
                    value={form?.currentForm?.linkId || ""}
                />
                {<b>{linkIdError.length ? linkIdError : null}</b>}
            </div>
            <div>
                <h3>Form Access Type</h3>
                <div className="select">
                    <select
                        onChange={(e) => {
                            if (e.target.value === "0") {
                                form?.setEditable(true)
                                form?.setMultipleResponses(false)
                                form?.setAnonymity(false)
                            } else if (e.target.value === "1") {
                                form?.setEditable(false)
                                form?.setMultipleResponses(false)
                                form?.setAnonymity(false)
                            } else {
                                form?.setEditable(false)
                                form?.setMultipleResponses(true)
                                form?.setAnonymity(true)
                            }
                        }}
                        value={formType}
                    >
                        <option value={0}>Editable</option>
                        <option value={1}> Non Editable </option>
                        <option value={2}>Anonymous</option>
                    </select>
                    <span className="select-arrow">
                        <DropdownArrow />
                    </span>
                </div>
            </div>
            <div>
                <button
                    onClick={() => {
                        setDisplayPermission(true)
                    }}
                >
                    Set edit permissions
                </button>
                {displayPermission && (
                    <PermissionList
                        close={() => {
                            setDisplayPermission(false)
                        }}
                    />
                )}
            </div>
        </div>
    )
}

const EditFormPage: React.FC = () => {
    const { formId }: any = useParams()
    const [loading, setLoading] = useState<boolean>(true)
    const [displayPermission, setDisplayPermission] = useState<boolean>(false)
    const questions = useQuestionsList()
    const auth = useAuth()
    const form = useCurrentForm()

    const {} = useQuery("currentForm", () => getForm(formId, true), {
        onSuccess: (data) => {
            if (data.success) form?.setFormDetails(data.data)
            setLoading(false)
        },
    })

    useEffect(() => {
        if (!auth?.currentUser) auth?.getCurrentUser()
        return () => {
            form?.setFormDetails(null)
            questions?.questionActions?.getQuestions("", [])
        }
    }, [formId])

    useUpdateForm()
    useDocumentTitle(form?.currentForm?.title || "Forms | IECSE")

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
                        <OtherFormAttributes
                            form={form}
                            displayPermission={displayPermission}
                            setDisplayPermission={(perm: boolean) =>
                                setDisplayPermission(perm)
                            }
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
