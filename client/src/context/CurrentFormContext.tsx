import React, { ReactElement, useContext, useState } from "react"

export interface CurrentForm {
    id: string
    date?: Date | null
    title?: string
    description?: string
    editable?: boolean
    mulitipleResponses?: boolean
    isActive?: boolean
}
interface Props {
    children: ReactElement
}
export interface Form {
    currentForm: CurrentForm | null
    setTitle: (title: string) => void
    setDescription: (description: string) => void
    setDate: (date: Date | null) => void
    setEditable: (editable: boolean) => void
    setMultipleResponses: (multiple: boolean) => void
    setFormDetails: (id: string, toEdit: boolean) => Promise<any>
    setActive: (isActive: boolean) => void
}

const CurrentFormContext = React.createContext<Form | null>(null)

export const useCurrentForm = () => {
    return useContext(CurrentFormContext)
}

export default function CurrentFormProvider({ children }: Props): ReactElement {
    const [currentForm, setCurrentForm] = useState<CurrentForm | null>(null)

    const setTitle = (title: string) => {
        setCurrentForm((prevForm) => {
            if (prevForm)
                return {
                    ...prevForm,
                    title: title,
                }
            return null
        })
    }

    const setDescription = (description: string) => {
        setCurrentForm((prevForm) => {
            if (prevForm)
                return {
                    ...prevForm,
                    description: description,
                }
            return null
        })
    }

    const setDate = (date: Date | null) => {
        setCurrentForm((prevForm) => {
            if (prevForm)
                return {
                    ...prevForm,
                    date: date ? date : null,
                }
            return null
        })
    }
    const setEditable = (editable: boolean) => {
        setCurrentForm((prevForm) => {
            if (prevForm)
                return {
                    ...prevForm,
                    editable: editable,
                }
            return null
        })
    }
    const setMultipleResponses = (multiple: boolean) => {
        setCurrentForm((prevForm) => {
            if (prevForm) {
                return {
                    ...prevForm,
                    mulitipleResponses: multiple,
                }
            }
            return null
        })
    }
    const setActive = (isActive: boolean) => {
        setCurrentForm((prevForm) => {
            if (prevForm) {
                return {
                    ...prevForm,
                    isActive: isActive,
                }
            }
            return null
        })
    }
    const setFormDetails = async (id: string, toEdit: boolean) => {
        setCurrentForm({ id: id })
        let fetchRoute = ``
        if (toEdit) {
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
                return data
            }
            setTitle(data.form.title)
            setDescription(data.form.description)
            setEditable(data.form.isEditable)
            setMultipleResponses(data.form.multipleResponses)
            setActive(data.form.isActive)
            if (data.form.closes) {
                setDate(new Date(data.form.closes))
            }
            return data.form
        } catch (err) {
            console.log(err)
            return null
        }
    }
    const form: Form = {
        currentForm,
        setFormDetails,
        setTitle,
        setDescription,
        setDate,
        setEditable,
        setMultipleResponses,
        setActive,
    }

    return (
        <CurrentFormContext.Provider value={form}>
            {children}
        </CurrentFormContext.Provider>
    )
}
