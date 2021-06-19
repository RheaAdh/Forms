import React, { useState, useEffect } from "react"
import Question from "./Question"

import "../styles/QuestionList.css"

interface props {
    form: any
}
const QuestionList: React.FC<props> = ({ form }) => {
    const [questionList, setQuestionList] = useState<any[]>([])

    useEffect(() => {
        fetch(`http://localhost:7000/api/getquestionsbyformid/${form._id}`, {
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
            formid: form._id,
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
        console.log("before" + idx)
        for (let i = 0; i < questionList.length; i++) {
            console.log(questionList[i])
        }

        setQuestionList((prevList) =>
            prevList.filter((question, i) => idx !== i)
        )
        console.log("after" + idx)
        for (let i = 0; i < questionList.length; i++) {
            console.log(questionList[i])
        }
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
            {console.log("ahasdiafiejpf"+form.isTemplate)}
            {form.isTemplate ? null : (
                <button className="add-button" onClick={addQuestion}>
                    Add Question
                </button>
            )}
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
