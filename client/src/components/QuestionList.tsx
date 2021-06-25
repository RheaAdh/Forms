import React, { useState, useEffect } from "react"
import Question from "./Question"
import "../styles/QuestionList.css"
import { useCurrentForm } from "../context/CurrentFormContext"
import { useQuestionsList } from "../context/QuestionListContext"
import getQuestionsAndResponses from "../context/Actions"

const QuestionList: React.FC = () => {
    const form = useCurrentForm()
    const questions = useQuestionsList()
    useEffect(() => {
        const id = form?.currentForm?.id
        if (id) {
            getQuestionsAndResponses(id).then((data) =>
                questions?.questionActions.getQuestions(id, data.ques)
            )
        }
    }, [form?.currentForm?.id])
    return (
        <div className="list-container">
            <div className="list-body">
                <button
                    onClick={() => questions?.questionActions?.addQuestion()}
                >
                    Add New Question
                </button>
                {console.log(questions?.questions)}
                {questions?.questions.map((question, index: number) => (
                    <Question question={question} index={index} />
                ))}
            </div>
        </div>
    )
}

export default QuestionList

//SO HOW DO I SOLVE IT
//UMMMM THERER MUST BE A WAY
//SO IF I SAY A NEW QUESTION IT SHOULD BASICALLY JUST ADD AN EMPTY QUESTION NO MATTER WAHT
//OK I SO I THOUGH OF SOMETHING BUT DON'T FORGET
//UM SO I HAVE I'LL AN ADD QUESTION ON THE FORM TITLE AND ON EACH QUESTION
//WHENEVER I CLICK THE ADD QUESTION IT WILL CREATE ME A NEW QUESTIONS WITH "Question"
// AS THE DEFAULT TITLE
//ALSO PUSH IT TO THE DATABASE
//AND WHEN I CLICK ON A QUESTION I CAN EDIT ACCORDINGLY
