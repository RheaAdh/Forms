import React, { useEffect, useState } from "react"
import { useParams } from "react-router"
import { getByResponseIdPublic } from "../../context/form/FormActions"
import { useAuth } from "../../context/auth/AuthContext"
import { useCurrentForm } from "../../context/form/CurrentFormContext"
import {
    Question,
    useQuestionsList,
} from "../../context/questions/QuestionListContext"
import { useResponses } from "../../context/responses/ResponseListContext"
import QuestionResponse from "../../components/shared/QuestionResponse"
import "../../styles/DisplayForm.css"
import Loading from "../../components/shared/Loading"

const FormForUserResponseOnly = () => {
    const auth = useAuth()
    const form = useCurrentForm()
    const responseList = useResponses()
    const questions = useQuestionsList()

    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

    const { responseId }: any = useParams()

    useEffect(() => {
        //Get current logged in user
        if (auth?.currentUser) auth?.getCurrentUser()
        // Get response for response ID if this is a response only type page (/response/:responseId)
        if (responseId) {
            getByResponseIdPublic(responseId).then((data) => {
                if (!data.success) {
                    if (data.status === 404) {
                        setError(data.msg)
                        return setLoading(false)
                    }
                    return
                }
                const formId = data.data.formId._id
                const formData = data.data.formId
                const questionsData = data.data.responses.map(
                    (q: any) => q.questionId
                )
                const responses = data.data
                form?.setFormDetails(formId, formData)
                questions?.questionActions?.getQuestions(formId, questionsData)
                responseList?.responseActions?.getResponse(
                    formId,
                    responses,
                    questionsData.map((q: any) => q.required),
                    true
                )
            })
        }
    }, [responseId])

    if (loading) {
        return <Loading />
    }

    if (error) {
        return <div>{error}</div>
    }

    return (
        <div className="display-form-page">
            <div className="display-form-container">
                <div className="display-form-component form-header">
                    <h2>{form?.currentForm?.title}</h2>
                    <p>{form?.currentForm?.description}</p>
                </div>
                {questions?.questions?.map((q: Question, idx: number) => {
                    return (
                        <QuestionResponse
                            question={q}
                            prevResponse={responseList?.responses?.[idx]}
                            index={idx}
                            key={q.qid}
                        />
                    )
                })}
            </div>
        </div>
    )
}

export default FormForUserResponseOnly
