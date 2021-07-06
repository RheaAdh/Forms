import React, { useEffect, useState } from "react"
import "../styles/DashboardPage.css"
import { useAuth } from "../context/AuthContext"
import { useHistory } from "react-router"
import Loading from "../components/Loading"
import DashboardNavbar from "../components/DashboardNavbar"
import { CurrentForm } from "../context/CurrentFormContext"
import FormCard from "../components/FormCard"
import { Question } from "../context/QuestionListContext"
import { ReactComponent as AddQuestionIcon } from "../images/AddQuestionIcon.svg"

const DashboardPage: React.FC = () => {
    const auth = useAuth()

    const history = useHistory()

    const [loading, setLoading] = useState<boolean>(true)
    const [allForms, setAllForms] = useState<CurrentForm[]>()
    const [templates, setTemplates] = useState<CurrentForm[]>()
    const [searchListForms, setSearchList] = useState<CurrentForm[]>()

    useEffect(() => {
        if (auth?.currentUser === null) auth?.getCurrentUser()
    }, [])

    const returnQuestionFromData = (form: any) => {
        return form.questions[0] !== undefined
            ? {
                  formId: form._id,
                  qid: form.questions[0]._id,
                  questionText: form.questions[0].questionText,
                  questionType: form.questions[0].questionType,
                  required: form.questions[0].required,
                  options: form.questions[0].options,
                  cols: form.questions[0].colLabel,
                  rows: form.questions[0].rowLabel,
                  lowRating: form.questions[0].lowRating,
                  highRating: form.questions[0].highRating,
                  lowRatingLabel: form.questions[0].lowRatingLabel,
                  highRatingLabel: form.questions[0].highRatingLabel,
              }
            : undefined
    }

    useEffect(() => {
        if (auth?.currentUser && auth?.currentUser?.userid !== "x") {
            fetch(`/api/getforms`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            })
                .then((resp: any) => {
                    return resp.json()
                })
                .then((data: any) => {
                    //console.log({ data })
                    if (data.success === true) {
                        setAllForms(
                            data.forms.map((form: any) => {
                                const question:
                                    | Question
                                    | undefined = returnQuestionFromData(form)
                                return {
                                    id: form.id,
                                    date: form.closes,
                                    title: form.title,
                                    description: form.description,
                                    isActive: form.isActive,
                                    isTemplate: form.isTemplate,
                                    question,
                                }
                            })
                        )
                        setSearchList(
                            data.forms.map((form: any) => {
                                const question:
                                    | Question
                                    | undefined = returnQuestionFromData(form)

                                return {
                                    id: form._id,
                                    date: form.closes,
                                    title: form.title,
                                    description: form.description,
                                    isActive: form.isActive,
                                    isTemplate: form.isTemplate,
                                    question,
                                }
                            })
                        )
                    } else {
                        //HANDLE ERROR
                    }
                    setLoading(false)
                })
                .catch((e) => console.log(e))

            fetch(`/api/viewAllTemplates`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            })
                .then((resp: any) => {
                    return resp.json()
                })
                .catch((e) => console.log(e))

                .then((data: any) => {
                    if (data.success === true) {
                        setTemplates(
                            data.forms.map((form: any) => ({
                                id: form._id,
                                title: form.title,
                                description: form.description,
                                isTemplate: form.isTemplate,
                                question: returnQuestionFromData(form),
                            }))
                        )
                    } else {
                        // HANDLE ERROR
                    }
                })
        }
    }, [auth?.currentUser])

    const addForm = (isTemplate: boolean) => {
        const form = {
            title: "Untitled",
            isTemplate,
        }

        //UPDATE ON BACKEND
        fetch("/api/addForm", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(form),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    history.push(`/form-admin/${data.data._id}`)
                } else {
                    //HANDLE ERROR
                }
            })
            .catch((error) => {
                console.error("Error:", error)
            })
    }

    const handleDelete = (id: string, isTemplate: boolean | undefined) => {
        if (isTemplate) {
            setTemplates((prevForms) =>
                prevForms?.filter((form: CurrentForm) => {
                    return form.id !== id
                })
            )
            return
        }
        setAllForms((prevForms) =>
            prevForms?.filter((form: CurrentForm) => {
                return form.id !== id
            })
        )
        setSearchList((prevForms) =>
            prevForms?.filter((form: CurrentForm) => {
                return form.id !== id
            })
        )
    }

    if (loading) {
        return <Loading />
    }

    return (
        <div className="dashboard-page">
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
                    {templates?.map((form: CurrentForm) => (
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
                    {searchListForms?.map((form: CurrentForm) => (
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
