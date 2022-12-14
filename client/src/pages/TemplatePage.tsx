import React, { useEffect, useState } from "react"
import NewForm from "../components/NewForm"

import { useAuth } from "../context/auth/AuthContext"
const TemplatePage: React.FC = () => {
    const [forms, setForms] = useState<any[]>([])
    const auth = useAuth()

    // useEffect(() => {
    //     fetch(`/api/viewAllTemplates`, {
    //         method: "GET",
    //         headers: {
    //             "Content-Type": "application/json",
    //         },
    //         credentials: "include",
    //     })
    //         .then((resp: any) => {
    //             return resp.json()
    //         })
    //         .catch((e) => console.log(e))

    //         .then((data: any) => {
    //             console.log({ data })
    //             if (data.success === true) {
    //                 setForms(data.forms)
    //             } else {
    //                 // HANDLE ERROR
    //             }
    //         })
    // }, [])

    // useEffect(() => {
    //     auth?.getCurrentUser()
    // }, [])

    // const deleteForm = (id: any) => {
    //     setForms((prevForms) => prevForms.filter((form) => form._id !== id))
    // }
    return (
        <div>
            {auth?.currentUser?.role === "superadmin" && (
                <NewForm isTemplate={true} />
            )}
        </div>
    )
}

export default TemplatePage
