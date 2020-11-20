import React from "react"

const Question = () => {
    return(
        <div >
            <div className="question-title">
                <span>Question:</span>
                <input type="text" />
            </div>
            <div className="question-type">
                <span>Type:</span>
                <select>
                    <option>Short text</option>
                    <option>Paragraph</option>
                    <option>Multiple choice</option>
                    <option>Checkbox</option>
                </select>
            </div>
        </div>
    )
}

export default Question;