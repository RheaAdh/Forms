import React, { ReactElement, useContext, useState } from "react"

export interface CurrentForm {
    id: string
    isTemplate?: boolean
    anonymous?: boolean
    date?: Date | null
    title?: string
    description?: string
    editable?: boolean
    multipleResponses?: boolean
    isActive?: boolean
    editors?: string[]
    isQuestionsPage?: boolean
}
interface Props {
    children: ReactElement
}
export interface Form {
    currentForm: CurrentForm | null
    updateForm: () => void
    getAnonymity: (formId: string) => Promise<any>
    setTitle: (title: string) => void
    setDescription: (description: string) => void
    setDate: (date: Date | null) => void
    setEditable: (editable: boolean) => void
    setMultipleResponses: (multiple: boolean) => void
    setAnonymity: (anonymous: boolean) => void
    setFormDetails: (
        id: string,
        toEdit: boolean,
        formData?: any
    ) => Promise<any>
    setActive: (isActive: boolean) => void
    setEditors: (editor: string[]) => void
    setQuestionsPage: (isQuestionsPage: boolean) => void
}

const CurrentFormContext = React.createContext<Form | null>(null)

export const useCurrentForm = () => {
    return useContext(CurrentFormContext)
}

export default function CurrentFormProvider({ children }: Props): ReactElement {
    const [id, setId] = useState<string>("")
    const [anonymous, setAnonymity] = useState<boolean>()
    const [title, setTitle] = useState<string>()
    const [description, setDescription] = useState<string>()
    const [date, setDate] = useState<Date | null>()
    const [editable, setEditable] = useState<boolean>()
    const [multipleResponses, setMultipleResponses] = useState<boolean>()
    const [editors, setEditors] = useState<string[]>()
    const [isActive, setActive] = useState<boolean>()
    const [isQuestionsPage, setQuestionsPage] = useState<boolean>()
    const [isTemplate, setIsTemplate] = useState<boolean>()

    const setFormDetails = async (
        id: string,
        admin: boolean,
        formData?: any
    ) => {
        if (formData === null) {
            // Small hack to prevent a form from getting updated with details from previous context
            setId("")
            return
        }
        // if data has already been fetched
        if (formData !== undefined) {
            setTitle(formData.title)
            setDescription(formData.description)
            setEditable(formData.isEditable)
            setActive(formData.isActive)
            setEditors(formData.editors)
            setAnonymity(formData.anonymous)
            setIsTemplate(formData.isTemplate)
            setMultipleResponses(formData.multipleResponses)
            if (formData.closes) {
                new Date(formData.closes)
            } else setDate(null)

            setId(id)
            return { success: true, form: formData }
        }
        let fetchRoute = ``
        if (admin) {
            fetchRoute = `/api/getform/${id}`
        } else {
            fetchRoute = `/api/getformforresp/${id}`
        }
        try {
            const res = await fetch(fetchRoute, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            })

            const data = await res.json()
            if (!data.success) {
                return {
                    status: res.status,
                    success: data.success,
                    msg: data.msg,
                }
            }
            setTitle(data.form.title)
            setDescription(data.form.description)
            setEditable(data.form.isEditable)
            setActive(data.form.isActive)
            setEditors(data.form.editors)
            setMultipleResponses(data.form.multipleResponses)
            setAnonymity(data.form.anonymous)
            setIsTemplate(data.form.isTemplate)
            if (data.form.closes) {
                setDate(new Date(data.form.closes))
            } else setDate(null)

            setId(id)
            return data.form
        } catch (err) {
            console.log(err)
            return null
        }
    }
    const getAnonymity = async (formId: string) => {
        const res = await fetch(`/api/getanonymity/${formId}`, {
            method: "GET",
            headers: {
                "Content-type": "application/json",
            },
        })
        const data = await res.json()
        if (!data.success) {
            return {
                success: false,
                status: res.status,
                msg: data.msg,
            }
        }
        setAnonymity(data.data)
        setId(formId)
        return data
    }
    const updateForm = async () => {
        if (id === undefined || id.length === 0) {
            return
        }
        if (form?.currentForm?.id)
            fetch("/api/updateform", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    _id: id,
                    description: description,
                    isEditable: editable,
                    anonymous: anonymous,
                    closes: date,
                    title: title,
                    isActive: isActive,
                    editors: editors,
                    multipleResponses: multipleResponses,
                }),
            })
                .then((response) => response.json())
                .then((data) => {
                    // Success
                })
                .catch((error) => {
                    console.error("Error:", error)
                })
    }

    const currentForm: CurrentForm = {
        id,
        anonymous,
        date,
        isActive,
        title,
        description,
        editable,
        multipleResponses,
        editors,
        isQuestionsPage,
        isTemplate,
    }

    const form: Form = {
        currentForm,
        setFormDetails,
        getAnonymity,
        setAnonymity,
        updateForm,
        setTitle,
        setDescription,
        setDate,
        setEditable,
        setMultipleResponses,
        setActive,
        setEditors,
        setQuestionsPage,
    }

    return (
        <CurrentFormContext.Provider value={form}>
            {children}
        </CurrentFormContext.Provider>
    )
}
