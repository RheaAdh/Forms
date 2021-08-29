import React from "react"
import QuestionResponseForMail from "../../components/allUsers/QuestionResponseForMail"
import { ICurrentForm } from "../../context/form/CurrentFormContext"
import { IQuestion } from "../../context/questions/QuestionListContext"
import { IResponse } from "../../context/responses/ResponseListContext"
import "../../styles/DisplayForm.css"

interface props {
    questions: IQuestion[] | null
    prevResponses: IResponse[] | null
    form: ICurrentForm | null
}
// This component is to be mailed. Hence all css must be written inside the component
export default ({ questions, prevResponses, form }: props) => {
    return (
        <>
            <div
                style={{
                    height: "100vh",
                    width: "100vw",
                    backgroundColor: "var(--backgroundColor)",
                }}
            >
                <div
                    style={{
                        height: "calc(100vh - var(--adminNavbarHeight))",
                        width: "85vw",
                        overflowY: "auto",
                        position: "absolute",
                        left: "15vw",
                    }}
                >
                    <div
                        style={{
                            position: "relative",
                            backgroundColor: "rgba(190, 190, 190, 0.1)",
                            backdropFilter: "saturate(180%) blur(25px)",
                            borderRadius: "1em",
                            width: "80%",
                            padding: "1em 1em 2em 1.5em",
                            margin: "2em 0",
                        }}
                    >
                        <h2>{form?.title}</h2>
                        <p>{form?.description}</p>
                    </div>
                    {questions?.map((q: IQuestion, idx: number) => {
                        return (
                            <QuestionResponseForMail
                                question={q}
                                prevResponse={prevResponses?.[idx]}
                                key={q.qid}
                            />
                        )
                    })}
                </div>
            </div>
        </>
    )
}
