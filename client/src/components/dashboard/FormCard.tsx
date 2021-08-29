import React from "react"
import { Link, useHistory } from "react-router-dom"
import { ICurrentForm } from "../../context/form/CurrentFormContext"
import "../../styles/FormCard.css"
import QuestionResponse from "../shared/QuestionResponse"
import { ReactComponent as DeleteIcon } from "../../images/DeleteIcon.svg"
import { useAuth } from "../../context/auth/AuthContext"

interface props {
    form: ICurrentForm
    handleDelete: (id: string, isTemplate: boolean | undefined) => void
}

const FormCard: React.FC<props> = ({ form, handleDelete }) => {
    const history = useHistory()
    const auth = useAuth()
    // const toggleActive = () => {
    //     fetch(`/api/updateform`, {
    //         method: "PUT",
    //         headers: {
    //             "Content-Type": "application/json",
    //         },
    //         credentials: "include",
    //         body: JSON.stringify({
    //             _id: form._id,
    //             isActive: active,
    //             closes: active ? null : new Date(),
    //         }),
    //     })
    //         .then((response) => {
    //             return response.json()
    //         })
    //         .then((data) => {
    //             return null
    //         })
    //         .catch((error) => {
    //             console.error("Error:", error)
    //         })
    // }

    const useTemplate = () => {
        fetch(`/api/useTemplate/${form.id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    history.push(`/form-admin/${form.id}`)
                } else {
                    // HANDLE ERROR
                    console.log(data)
                }
            })
            .catch((error) => {
                console.error("Error:", error)
            })
    }

    return (
        <div className="form-card">
            <Link to={`/form-admin/${form.id}`}>
                <div className="card-display-form">
                    <div className="card-form-component">
                        <h2>{form.title}</h2>
                        <p>{form.description}</p>
                    </div>

                    {form.question && (
                        <QuestionResponse question={form.question} />
                    )}
                </div>
            </Link>
            {!form.isTemplate ? (
                <div className="card-info">
                    {form?.isActive ? (
                        <>
                            <span style={{ color: "#18FF04DE" }}>{"Open"}</span>
                            <span>
                                {form.date &&
                                    ` | Closes on ${new Date(
                                        form.date
                                    ).toLocaleDateString()}`}
                            </span>
                        </>
                    ) : (
                        <p style={{ color: "#E56464" }}>{"Closed"}</p>
                    )}
                    <button
                        onClick={() => {
                            handleDelete(form.id, form.isTemplate)
                        }}
                    >
                        <DeleteIcon />
                    </button>
                </div>
            ) : (
                <div className="card-info">
                    <button onClick={useTemplate}>Use This Template</button>
                    {auth?.currentUser?.role === "superadmin" && (
                        <button
                            onClick={() => {
                                handleDelete(form.id, form.isTemplate)
                            }}
                        >
                            <DeleteIcon />
                        </button>
                    )}
                </div>
            )}
        </div>
    )
}

export default FormCard
