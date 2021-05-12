import React, { useEffect, useState } from "react"
import { useHistory } from "react-router-dom"
interface props {
    form: any
    deleteForm: any
}

const Form: React.FC<props> = ({ form, deleteForm }) => {

    const [active, setActive] = useState(form.isActive)

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
                isActive: active
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

    useEffect(toggleActive,[active])


    return (
        <div onClick={handleClick} style={{
            backgroundColor: form.color_theme,
            cursor: "pointer",
            margin: 30
        }}>
                <h1>{form.title}</h1>
                <p>{form.description}</p>
                <h4>{active?"Accepting responses":"Form closed"}</h4>
                <button onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>)=>
                {
                    event.stopPropagation()
                    setActive(!active)
                }}>{active?"Close form":"Open form"}</button>
                <button onClick={handleDelete}>Delete Form</button>
        </div>
    )
}

export default Form
