import React, { useState, useEffect } from "react"
import Question from "./Question"

import "../styles/QuestionList.css"

interface props {
    formid: any
}
const QuestionList: React.FC<props> = ({ formid }) => {
    const [questionList, setQuestionList] = useState<any[]>([])

    useEffect(() => {
        fetch(`http://localhost:7000/api/getquestionsbyformid/${formid}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        })
            .then((resp: any) => {
                return resp.json()
            })
            .then((data: any) => {
                setQuestionList(data.ques)
            })
    }, [])

    const addQuestion = () => {
        const newQuestion = {
            question_text: "Question",
            question_type: "short-answer",
            formid: formid,
        }
        fetch("http://localhost:7000/api/addquestion", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(newQuestion),
        })
            .then((response) => response.json())
            .then((data) => setQuestionList((prevList) => [...prevList, data]))
            .catch((error) => {
                console.log("Error: ", error)
            })
        // setList(() => [...list, question]);
    }

    const deleteQuestion = (idx: number) => {
        setQuestionList((prevList) =>
            prevList.filter((question, i) => idx !== i)
        )
    }

    return (
        <div className="list-container">
            <div className="list-body">
                {questionList?.map((question, index: number) => (
                    <Question
                        question={question}
                        index={index}
                        deleteQuestion={deleteQuestion}
                    />
                ))}
            </div>
            <button className="add-button" onClick={addQuestion}>
                Add Question
            </button>
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
