import React, { useState } from "react"
import Question from "./Question";

const QuestionList = () => {
    const [list, setList] = useState([0]);

    const addQuestion = () => {
        setList(() => [...list, list[list.length-1]+1 ]);
    };

    return(
        <div className="list-container">
            <span>Title:</span>
            <input type="text" />
            <div className="list-body">
                {list.map((a)=>(<Question key={a}/>))}
            </div>
            <button onClick={addQuestion}>Add Question</button>
        </div>
    )
}

export default QuestionList;