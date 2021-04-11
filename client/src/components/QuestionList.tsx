import React, { useState, useEffect } from "react";
import Question from "./Question";

import "../styles/QuestionList.css";

interface props {
  questions?: any[];
  formid: any;
}
const QuestionList: React.FC<props> = ({questions, formid}) => {
  const [list, setList] = useState<any[]>([]);

  useEffect(() => {
    console.log({ questions });
    if (questions) setList(questions);
  }, [questions]);

  const addQuestion = () => {
    const newQuestion = {
      question_text: "Question",
      question_type: "short-answer",
      formid: formid,
    };
    fetch("http://localhost:7000/api/addquestion", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newQuestion),
    })
      .then((response) => response.json())
      .then((data) => setList((prev) => [...prev, data]))
      .catch((error) => {
        console.log("Error: ", error);
      });
    // setList(() => [...list, question]);
  };

  const deleteQuestion = (id : any) =>{
    setList((prevList:any)=> prevList.filter((question:any)=> question._id != id) )
    console.log(id)
  }

  return (
    <div className="list-container">
      <div className="list-body">
        {list.map((question) => (
          <Question question={question} deleteQuestion={deleteQuestion}/>
        ))}    
      </div>
      <button className="add-button" onClick={addQuestion}>Add Question</button>
    </div>
  );
};

export default QuestionList;

//SO HOW DO I SOLVE IT
//UMMMM THERER MUST BE A WAY
//SO IF I SAY A NEW QUESTION IT SHOULD BASICALLY JUST ADD AN EMPTY QUESTION NO MATTER WAHT
//OK I SO I THOUGH OF SOMETHING BUT DON'T FORGET
//UM SO I HAVE I'LL AN ADD QUESTION ON THE FORM TITLE AND ON EACH QUESTION
//WHENEVER I CLICK THE ADD QUESTION IT WILL CREATE ME A NEW QUESTIONS WITH "Question"
// AS THE DEFAULT TITLE
//ALSO PUSH IT TO THE DATABASE
//AND WHEN I CLICK ON A QUESTION I CAN EDIT ACCORDINGLY
