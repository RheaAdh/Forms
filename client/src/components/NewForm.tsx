import React, { useState, FormEvent } from "react"
import { useHistory } from "react-router-dom"

import useFormState from "../hooks/useFormState"

interface props {
    isTemplate: boolean
}

const NewForm: React.FC<props> = ({ isTemplate }) => {
    const [addedForm, setAddedForm] = useState<any | null>(null)

    const history = useHistory()

    const [title, handleTitle] = useFormState("")

    //INITALLY addedForm IS NULL SO HISTORY DOESNT PUSH, BUT WHEN THE POST REQUEST IS
    //COMPLETE THE addedForm IS SET TO THE ADDED FORM, TRIGGERING A RERENDER, SO THAN
    //HISTORY GETS PUSHED

    addedForm && history.push(`/form-admin/${addedForm._id}`)

    const addForm = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const form = {
            title: title ? title : "untitled",
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
                console.log(data)
                setAddedForm(data)
            })
            .catch((error) => {
                console.error("Error:", error)
            })
    }

    return (
        <div>
            <form onSubmit={addForm} style={{ margin: "1rem" }}>
                <input
                    placeholder={`Create New ${
                        isTemplate ? "Template" : "Form"
                    }`}
                    type="text"
                    value={title}
                    onChange={handleTitle}
                />
                <button type="submit">
                    <b>
                        <i className="far fa-plus-square"></i>
                    </b>
                </button>
            </form>
            <hr></hr>
        </div>
    )
}

export default NewForm
