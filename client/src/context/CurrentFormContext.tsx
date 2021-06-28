import React, { ReactElement, useContext, useState } from "react"

export interface CurrentForm {
    id: string
    date?: Date | null
    title?: string
    description?: string
    editable?: boolean
    multipleResponses?: boolean
    isActive?: boolean
    editors?: string[]
}
interface Props {
    children: ReactElement
}
export interface Form {
    currentForm: CurrentForm | null
    updateForm: () => void
    setTitle: (title: string) => void
    setDescription: (description: string) => void
    setDate: (date: Date | null) => void
    setEditable: (admin: boolean) => void
    setMultipleResponses: (multiple: boolean) => void
    setFormDetails: (
        id: string,
        toEdit: boolean,
        formData?: any
    ) => Promise<any>
    setActive: (isActive: boolean) => void
    setEditors: (editor: string[]) => void
}

const CurrentFormContext = React.createContext<Form | null>(null)

export const useCurrentForm = () => {
    return useContext(CurrentFormContext)
}

export default function CurrentFormProvider({ children }: Props): ReactElement {
    const [id, setId] = useState<string>("")
    const [title, setTitle] = useState<string>()
    const [description, setDescription] = useState<string>()
    const [date, setDate] = useState<Date | null>()
    const [editable, setEditable] = useState<boolean>()
    const [multipleResponses, setMultipleResponses] = useState<boolean>()
    const [editors, setEditors] = useState<string[]>()
    const [isActive, setActive] = useState<boolean>()

    const setFormDetails = async (
        id: string,
        admin: boolean,
        formData?: any
    ) => {
        setId(id)
        // if data has already been fetched
        if (formData !== undefined) {
            console.log(formData)
            setTitle(formData.title)
            setDescription(formData.description)
            setEditable(formData.isEditable)
            setMultipleResponses(formData.multipleResponses)
            setActive(formData.isActive)
            setEditors(formData.editors)
            if (formData.closes) {
                new Date(formData.closes)
            } else setDate(null)
            return { success: true, form: formData }
        }
        let fetchRoute = ``
        if (admin) {
            fetchRoute = `http://localhost:7000/api/getform/${id}`
        } else {
            fetchRoute = `http://localhost:7000/api/getformforresp/${id}`
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
            setMultipleResponses(data.form.multipleResponses)
            setActive(data.form.isActive)
            setEditors(data.form.editors)
            if (data.form.closes) {
                setDate(new Date(data.form.closes))
            } else setDate(null)
            return data.form
        } catch (err) {
            console.log(err)
            return null
        }
    }
    const updateForm = async () => {
        if (
            description === undefined ||
            editable === undefined ||
            multipleResponses === undefined ||
            date === undefined ||
            title === undefined ||
            isActive === undefined ||
            editors === undefined
        ) {
            return
        }
        if (form?.currentForm?.id)
            fetch("http://localhost:7000/api/updateform", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    _id: id,
                    description: description,
                    isEditable: editable,
                    multipleResponses: multipleResponses,
                    closes: date,
                    title: title,
                    isActive: isActive,
                    editors: editors,
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
        date,
        isActive,
        title,
        description,
        editable,
        multipleResponses,
        editors,
    }

    const form: Form = {
        currentForm,
        setFormDetails,
        updateForm,
        setTitle,
        setDescription,
        setDate,
        setEditable,
        setMultipleResponses,
        setActive,
        setEditors,
    }

    return (
        <CurrentFormContext.Provider value={form}>
            {children}
        </CurrentFormContext.Provider>
    )
}
