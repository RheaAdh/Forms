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
    updateForm: () => void
    setTitle: (title: string) => void
    setDescription: (description: string) => void
    setDate: (date: Date | null) => void
    setEditable: (editable: boolean) => void
    setMultipleResponses: (multiple: boolean) => void
    setFormDetails: (
        id: string,
        toEdit: boolean,
        formData?: any
    ) => Promise<any>
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
    const setFormDetails = async (
        id: string,
        toEdit: boolean,
        formData?: any
    ) => {
        setCurrentForm({ id: id })
        if (formData !== undefined) {
            console.log(formData)
            setTitle(formData.title)
            setDescription(formData.description)
            setEditable(formData.isEditable)
            setMultipleResponses(formData.multipleResponses)
            setActive(formData.isActive)
            if (formData.closes) {
                new Date(formData.closes)
            } else setDate(null)
            return { success: true, form: formData }
        }
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
            currentForm?.description === undefined ||
            currentForm?.editable === undefined ||
            currentForm?.mulitipleResponses === undefined ||
            currentForm?.date === undefined ||
            currentForm?.title === undefined ||
            currentForm?.isActive === undefined
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
                    _id: currentForm.id,
                    description: currentForm?.description,
                    isEditable: currentForm?.editable,
                    multipleResponses: currentForm?.mulitipleResponses,
                    closes: currentForm?.date,
                    title: currentForm?.title,
                    isActive: currentForm?.isActive,
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
    }

    return (
        <CurrentFormContext.Provider value={form}>
            {children}
        </CurrentFormContext.Provider>
    )
}
