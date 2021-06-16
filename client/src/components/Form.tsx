import React, { useEffect, useState } from "react"
import { useHistory } from "react-router-dom"
import { CopyToClipboard } from "react-copy-to-clipboard"
interface props {
    form: any
    deleteForm: any
}

const Form: React.FC<props> = ({ form, deleteForm }) => {
    const [active, setActive] = useState(form.isActive)
    const [link, setLink] = useState(`http://localhost:3000/login/${form._id}`)
    let history = useHistory()

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

    useEffect(toggleActive, [active])

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
                <p>{active ? "Accepting responses" : "Form closed"}</p>
            </div>
            <div>
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
                <button style={{ margin: "2px" }} onClick={handleDelete}>
                    <i className="fas fa-trash-alt"></i>
                </button>
                {!form.isTemplate ? (
                    <CopyToClipboard text={link}>
                        <button style={{ margin: "2px" }}>
                            <i className="fas fa-copy"></i>
                        </button>
                    </CopyToClipboard>
                ) : (
                    <div></div>
                )}
                {!form.isTemplate ? (
                    <a
                        href={`http://localhost:7000/api/makeTemplate/${form._id}`}
                    >
                        <button>Add to templates</button>
                    </a>
                ) : (
                    <div></div>
                )}

                {form.isTemplate ? (
                    <div>
                        <a
                            href={`http://localhost:7000/api/useTemplate/${form._id}`}
                        >
                            <button>Use template</button>
                        </a>
                    </div>
                ) : (
                    <div></div>
                )}
            </div>
        </div>
    )
}

export default Form
