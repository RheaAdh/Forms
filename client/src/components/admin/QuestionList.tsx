import React, { useEffect } from "react"
import Question from "./Question"
import "../../styles/QuestionList.css"
import { useCurrentForm } from "../../context/form/CurrentFormContext"
import { useQuestionsList } from "../../context/questions/QuestionListContext"
import getQuestionsAndResponses from "../../context/form/FormActions"
import { useQuery } from "react-query"

const QuestionList: React.FC = () => {
    const form = useCurrentForm()
    const questions = useQuestionsList()

    const {} = useQuery(
        "questionsAndResponses",
        () => getQuestionsAndResponses(form?.currentForm?.id, true, -1),
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
                    onClick={() =>
                        questions?.questionActions?.addQuestion(-1, 1, false)
                    }
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
