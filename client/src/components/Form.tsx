import React, { useEffect, useState } from "react"
import { useHistory } from "react-router-dom"
import { CopyToClipboard } from "react-copy-to-clipboard"
import { useAuth } from "../context/AuthContext"
interface props {
    form: any
    deleteForm: any
}

const Form: React.FC<props> = ({ form, deleteForm }) => {
    const [active, setActive] = useState(form.isActive)
    const [link, setLink] = useState(`http://localhost:3000/login/${form._id}`)
    let history = useHistory()
    const auth = useAuth()

    const handleClick = () => {
        history.push(`/editForm/${form._id}`)
    }
    const toggleActive = () => {
        fetch(`http://localhost:7000/api/formclose/${form._id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
                isActive: active,
            }),
        })
            .then((response) => response.json())
            .catch((error) => {
                console.error("Error:", error)
            })
    }

    const handleDelete = (
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        event.stopPropagation()

        //!CHANGE ON BACK END
        const body = { id: form._id }
        fetch("http://localhost:7000/api/deleteform", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(body),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data)
                //!CHANGE ON FRONT END
                deleteForm(form._id)
            })
            .catch((error) => {
                console.error("Error:", error)
            })
    }
    const handleMakeTemplate = () => {
        fetch(`http://localhost:7000/api/makeTemplate/${form._id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        })
            .then((response) => response.json())
            .catch((error) => {
                console.error("Error:", error)
            })
    }
    const handleUseTemplate = () => {
        fetch(`http://localhost:7000/api/useTemplate/${form._id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        })
            .then((response) => response.json())
            .catch((error) => {
                console.error("Error:", error)
            })
    }
    useEffect(toggleActive, [active])
    // useEffect(handleUseTemplate, [tempState])
    return (
        <div
            style={{
                backgroundColor: "#BEBEBE",
                cursor: "pointer",
                margin: 30,
            }}
        >
            <div onClick={handleClick}>
                <h1>{form.title}</h1>
                <p>{form.description}</p>
            </div>
            <div></div>
            {!form.isTemplate ? (
                <p>{active ? "Accepting responses" : "Form closed"}</p>
            ) : null}

            {!form.isTemplate ? (
                <button
                    style={{ margin: "2px" }}
                    onClick={(
                        event: React.MouseEvent<HTMLButtonElement, MouseEvent>
                    ) => {
                        event.stopPropagation()
                        setActive(!active)
                    }}
                >
                    {active ? "Close form" : "Open form"}
                </button>
            ) : null}
            {console.log("-----------------------")}
            {console.log(auth?.currentUser?.role)}
            {form.role === "superadmin" &&
            form.isTemplate &&
            auth?.currentUser?.role === "admin" ? null : (
                <button style={{ margin: "2px" }} onClick={handleDelete}>
                    <i className="fas fa-trash-alt"></i>
                </button>
            )}

            {!form.isTemplate ? (
                <CopyToClipboard text={link}>
                    <button style={{ margin: "2px" }}>
                        <i className="fas fa-copy"> Share</i>
                    </button>
                </CopyToClipboard>
            ) : (
                <div></div>
            )}
            {!form.isTemplate ? (
                <button onClick={handleMakeTemplate}>Add to templates</button>
            ) : (
                <div></div>
            )}

            {form.isTemplate ? (
                <div>
                    <button onClick={handleUseTemplate}>Use template</button>
                </div>
            ) : (
                <div></div>
            )}
        </div>
    )
}

export default Form
