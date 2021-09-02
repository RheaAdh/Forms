import React, { useEffect, useState } from "react"
import "../../styles/DashboardPage.css"
import { useAuth } from "../../context/auth/AuthContext"
import { useHistory } from "react-router"
import Loading from "../../components/shared/Loading"
import DashboardNavbar from "../../components/dashboard/DashboardNavbar"
import { ICurrentForm } from "../../context/form/CurrentFormContext"
import FormCard from "../../components/dashboard/FormCard"
import {
    IQuestion,
    useQuestionsList,
} from "../../context/questions/QuestionListContext"
import { ReactComponent as AddQuestionIcon } from "../../images/AddQuestionIcon.svg"
import { v4 as uuidv4 } from "uuid"
import { useMutation, useQuery, useQueryClient } from "react-query"
import {
    deleteFormAction,
    getFormsAction,
    getTemplatesAction,
} from "../../context/form/FormActions"
import ErrorPopup from "../../components/shared/ErrorPopup"
import { post } from "../../utils/requests"

const DashboardPage: React.FC = () => {
    const auth = useAuth()
    const history = useHistory()
    const questions = useQuestionsList()

    const [loading, setLoading] = useState<boolean>(true)
    const [allForms, setAllForms] = useState<ICurrentForm[]>()
    const [templates, setTemplates] = useState<ICurrentForm[]>()
    const [searchListForms, setSearchList] = useState<ICurrentForm[]>()

    const queryClient = useQueryClient()

    const { mutateAsync: deleteFormMutation } = useMutation((id: string) =>
        deleteFormAction(id)
    )

    useEffect(() => {
        if (auth?.currentUser === null) {
            auth?.getCurrentUser().catch((err) => {
                console.log(err.message)
            })
        }
    }, [])

    const keyGen = () => {
        return uuidv4()
    }

    const {} = useQuery("forms", () => getFormsAction(), {
        onSuccess: (data) => {
            if (data.success === true) {
                setAllForms(
                    data.forms.map((form: any) => {
                        const question:
                            | IQuestion
                            | undefined = returnQuestionFromData(form)
                        return {
                            id: form._id,
                            date: form.closes,
                            title: form.title,
                            description: form.description,
                            isActive: form.isActive,
                            isTemplate: form.isTemplate,
                            linkId: form.linkId,
                            question,
                        }
                    })
                )
                setSearchList(
                    data.forms.map((form: any) => {
                        const question:
                            | IQuestion
                            | undefined = returnQuestionFromData(form)

                        return {
                            id: form._id,
                            date: form.closes,
                            title: form.title,
                            description: form.description,
                            isActive: form.isActive,
                            isTemplate: form.isTemplate,
                            linkId: form.linkId,
                            question,
                        }
                    })
                )
            } else {
                // Not the right way to handle error
                console.log(data.msg)
            }
            setLoading(false)
        },
    })

    const {} = useQuery("templates", () => getTemplatesAction(), {
        onSuccess: (data) => {
            if (data.success === true) {
                setTemplates(
                    data.forms.map((form: any) => ({
                        id: form._id,
                        title: form.title,
                        description: form.description,
                        isTemplate: form.isTemplate,
                        linkId: form.linkId,
                        question: returnQuestionFromData(form),
                    }))
                )
            } else {
                // HANDLE ERROR
                console.log(data.msg)
            }
        },
    })

    const returnQuestionFromData = (form: any) => {
        const question = form?.questions[0]

        if (question === undefined) {
            return undefined
        }

        return {
            formId: form._id,
            qid: question._id,
            questionText: question.questionText,
            questionType: question.questionType,
            required: question.required,
            pageNo: 1,
            options:
                question.options !== undefined
                    ? question.options.map((opt: string) => {
                          return { text: opt, key: keyGen() }
                      })
                    : [{ text: "", key: keyGen() }],
            cols:
                question.rowLabel !== undefined
                    ? question.rowLabel.map((opt: string) => {
                          return { text: opt, key: keyGen() }
                      })
                    : [{ text: "", key: keyGen() }],
            rows:
                question.colLabel !== undefined
                    ? question.colLabel.map((opt: string) => {
                          return { text: opt, key: keyGen() }
                      })
                    : [{ text: "", key: keyGen() }],
            lowRating: question.lowRating,
            highRating: question.highRating,
            lowRatingLabel: question.lowRatingLabel,
            highRatingLabel: question.highRatingLabel,
        }
    }

    const addForm = async (isTemplate: boolean) => {
        const form = {
            title: "Untitled",
            isTemplate,
        }
        //UPDATE ON BACKEND
        try {
            const data = await (await post("/api/addForm", form)).json()
            if (data.success) {
                history.push(`/form-admin/${data.data._id}`)
            } else {
                console.log(data)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleDelete = (id: string, isTemplate: boolean | undefined) => {
        if (isTemplate) {
            setTemplates((prevForms) =>
                prevForms?.filter((form: ICurrentForm) => {
                    return form.id !== id
                })
            )
        } else {
            setAllForms((prevForms) =>
                prevForms?.filter((form: ICurrentForm) => {
                    return form.id !== id
                })
            )
            setSearchList((prevForms) =>
                prevForms?.filter((form: ICurrentForm) => {
                    return form.id !== id
                })
            )
        }
        deleteFormMutation(id).catch((error) => {
            if (!questions?.questionError) {
                questions?.questionActions?.setQuestionError(error.message)
                // invalidate
                queryClient.invalidateQueries("forms")
                queryClient.invalidateQueries("templates")
            }
        })
    }

    if (loading) {
        return <Loading />
    }

    return (
        <div className="dashboard-page">
            <ErrorPopup />
            <DashboardNavbar
                allForms={allForms}
                setSearchList={setSearchList}
            />
            <div className="dashboard-container">
                <h3>
                    {"Templates  "}

                    {auth?.currentUser?.role === "superadmin" && (
                        <button
                            onClick={() => {
                                addForm(true)
                            }}
                        >
                            <AddQuestionIcon />
                            <span className="icon-info">
                                Create New Template
                            </span>
                            <span className="text-info-arrow" />
                        </button>
                    )}
                </h3>
                <div className="templates-container">
                    {templates?.map((form: ICurrentForm) => (
                        <FormCard
                            key={form.id}
                            form={form}
                            handleDelete={handleDelete}
                        />
                    ))}
                </div>

                <h3>
                    {"All Forms  "}
                    <button
                        onClick={() => {
                            addForm(false)
                        }}
                    >
                        <AddQuestionIcon />
                        <span className="icon-info">Create New Form</span>
                        <span className="text-info-arrow" />
                    </button>
                </h3>

                <div className="forms-container">
                    {searchListForms?.map((form: ICurrentForm) => (
                        <FormCard
                            key={form.id}
                            form={form}
                            handleDelete={handleDelete}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default DashboardPage
