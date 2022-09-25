import React, { useEffect } from "react"
import Question from "./Question"
import "../../styles/QuestionList.css"
import { useCurrentForm } from "../../context/form/CurrentFormContext"
import { useQuestionsList } from "../../context/questions/QuestionListContext"
import { getQuestionsAndResponses } from "../../context/form/FormActions"
import { useQuery } from "react-query"
import useScrollDown from "../../hooks/useScrollDown"

const QuestionList: React.FC = () => {
    const form = useCurrentForm()
    const questions = useQuestionsList()
    const setNewQuestionIndex = useScrollDown()

    const {} = useQuery(
        "questionsAndResponses",
        () => getQuestionsAndResponses(form?.currentForm?.id, true),
        {
            onSuccess: (data) =>
                questions?.questionActions?.getQuestions(
                    form?.currentForm?.id ? form?.currentForm?.id : "",
                    data.ques
                ),
        }
    )

    return (
        <div>
            <div>
                <button
                    onClick={() => {
                        questions?.questionActions?.addQuestion(-1, 1, false)
                        setNewQuestionIndex(0)
                    }}
                >
                    Add Question
                </button>
                {questions?.questions.map((question, index: number) => (
                    <Question
                        key={question.qid}
                        question={question}
                        index={index}
                    />
                ))}
            </div>
        </div>
    )
}

export default QuestionList
