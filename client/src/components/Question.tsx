import React, {useState} from "react"

const Question = () => {
    const [type, setType] = useState<any>(0);
    const types=[
        <div><b>Short answer text</b></div>,
        <div><b>Paragraph text</b></div>,
        <div><b>Multiple choice #will add later#</b></div>,
        <div><b>Checkbox #will add later#</b></div>,
        <div><b>Dropdown #will add later#</b></div>,
        <div><b>File upload #will add later#</b></div>,
        <div><b>Linear scale #will add later#</b></div>,
        <div><b>Multiple choice grid #will add later#</b></div>,
        <div><b>Checkbox grid #will add later#</b></div>,
        <div><b>Date #will add later#</b></div>,
        <div><b>Time #will add later#</b></div>,
    ]
    return(
        <div className="question-component" >
            <div className="question-title">
                <span>Question:</span>
                <input type="text" />
            </div>
            <div className="question-type">
                <span>Type:</span>
                <select >
                    {/*Selection only work by click */}
                    <option onClick={()=>{setType(0)}}>Short text</option>
                    <option onClick={()=>{setType(1)}}>Paragraph</option>
                    <option onClick={()=>{setType(2)}}>Multiple choice</option>
                    <option onClick={()=>{setType(3)}}>Checkbox</option>
                    <option onClick={()=>{setType(4)}}>Dropdown</option>
                    <option onClick={()=>{setType(5)}}>File upload</option>
                    <option onClick={()=>{setType(6)}}>Linear scale</option>
                    <option onClick={()=>{setType(7)}}>Multiple choice grid</option>
                    <option onClick={()=>{setType(8)}}>Checkbox grid</option>
                    <option onClick={()=>{setType(9)}}>Date</option>
                    <option onClick={()=>{setType(10)}}>Time</option>
                </select>
            </div>
            <div className="required">
                <input type="checkbox" />
                <span>Required</span>
            </div>
            {types[type]}
        </div>
    )
}

export default Question;