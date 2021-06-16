import React, { useEffect, useState } from "react"
import FormList from "../components/FormList"

import { useAuth } from "../context/AuthContext"
const TemplatePage: React.FC = () => {
    const [forms, setForms] = useState<any[]>([])
    const auth = useAuth()

    useEffect(() => {
        fetch(`http://localhost:7000/api/viewAllTemplates`, {
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
                console.log({ data })
                if (data.success === true) {
                    setForms(data.forms)
                } else {
                    console.log("There is an imposter among us!!")
                    //REDIRECT TO DASHBOARD PAGE I GUESS
                }
            })
    }, [])

    useEffect(() => {
        auth?.getCurrentUser()
    }, [])

    const deleteForm = (id: any) => {
        setForms((prevForms) => prevForms.filter((form) => form._id !== id))
    }
    return auth?.currentUser ? (
        <div>
            <FormList forms={forms} deleteForm={deleteForm} />
        </div>
    ) : (
        <h1>Login / Register</h1>
    )
}

export default TemplatePage
