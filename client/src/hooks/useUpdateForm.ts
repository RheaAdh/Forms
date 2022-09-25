import { useEffect } from "react"
import { useCurrentForm } from "../context/form/CurrentFormContext"

export default () => {
    const currentForm = useCurrentForm()?.currentForm
    const form = useCurrentForm()

    useEffect(
        () => {
            form?.updateForm()
        },
        // eslint-disable-next-line
        [
            currentForm?.description,
            currentForm?.editable,
            currentForm?.anonymous,
            currentForm?.date,
            currentForm?.title,
            currentForm?.editors,
            currentForm?.multipleResponses,
            currentForm?.pages,
        ]
    )
}
