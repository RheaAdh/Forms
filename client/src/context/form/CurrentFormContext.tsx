import React, { ReactElement, useContext, useState } from "react"
import { useMutation, useQueryClient } from "react-query"
import { Question } from "../questions/QuestionListContext"
import { updateFormAction } from "./FormActions"

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
    pages?: number
    question?: Question // For form card in dashboard only
}
interface Props {
    children: ReactElement
}
export interface Form {
    currentForm: CurrentForm | null
    updateForm: () => void
    getAnonymity: (formId: string) => Promise<any>
    setTitle: React.Dispatch<React.SetStateAction<string | undefined>>
    setDescription: React.Dispatch<React.SetStateAction<string | undefined>>
    setDate: React.Dispatch<React.SetStateAction<Date | null | undefined>>
    setEditable: React.Dispatch<React.SetStateAction<boolean | undefined>>
    setMultipleResponses: React.Dispatch<
        React.SetStateAction<boolean | undefined>
    >
    setAnonymity: React.Dispatch<React.SetStateAction<boolean | undefined>>
    setFormDetails: (id: string, formData: any) => void
    setActive: React.Dispatch<React.SetStateAction<boolean | undefined>>
    setEditors: React.Dispatch<React.SetStateAction<string[] | undefined>>
    setPages: React.Dispatch<React.SetStateAction<number | undefined>>
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
    const [isTemplate, setIsTemplate] = useState<boolean>()
    const [pages, setPages] = useState<number>()

    const { mutateAsync: updateFormMutation } = useMutation((data: any) =>
        updateFormAction(data)
    )

    const queryClient = useQueryClient()

    const setFormDetails = async (id: string, formData?: any) => {
        if (formData === null) {
            // Small hack to prevent a form from getting updated with details from previous context
            setId("")
            return
        }
        // if data has already been fetched
        setTitle(formData.title)
        setDescription(formData.description)
        setEditable(formData.isEditable)
        setActive(formData.isActive)
        setEditors(formData.editors)
        setAnonymity(formData.anonymous)
        setIsTemplate(formData.isTemplate)
        setMultipleResponses(formData.multipleResponses)
        setPages(formData.pages)
        if (formData.closes) {
            new Date(formData.closes)
        } else setDate(null)
        setId(id)
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
        if (form?.currentForm?.id) {
            const data = {
                _id: id,
                description: description,
                isEditable: editable,
                anonymous: anonymous,
                closes: date,
                title: title,
                isActive: isActive,
                editors: editors,
                multipleResponses: multipleResponses,
                isTemplate,
                pages,
            }
            updateFormMutation(data).catch((error) => {
                console.log(error.message)
                queryClient.invalidateQueries("currentForm")
            })
        }
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
        isTemplate,
        pages,
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
        setPages,
    }

    return (
        <CurrentFormContext.Provider value={form}>
            {children}
        </CurrentFormContext.Provider>
    )
}
