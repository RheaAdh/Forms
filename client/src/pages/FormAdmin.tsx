import React, { useEffect } from "react"
import { useCurrentForm } from "../context/CurrentFormContext"
import EditFormPage from "./EditFormPage"
import FormForAllResponses from "./FormForAllResponses"

interface props {
    isQuestionsPage: boolean
}

const FormAdmin = ({ isQuestionsPage }: props) => {
    const form = useCurrentForm()

    useEffect(() => {
        if (isQuestionsPage === true) {
            form?.setQuestionsPage(true)
        } else if (isQuestionsPage === false) {
            form?.setQuestionsPage(false)
        }
    }, [isQuestionsPage])

    if (
        form?.currentForm?.isQuestionsPage === true ||
        form?.currentForm?.isQuestionsPage === undefined
    ) {
        return <EditFormPage />
    }
    return <FormForAllResponses />
}

export default FormAdmin
