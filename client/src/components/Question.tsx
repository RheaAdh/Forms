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
                <select onChange={(e) =>{
                    const selectedType = e.target.value;
                    setType(selectedType);
                }}>
                    {/*Selection only work by click */}
                    <option value={0} >Short text</option>
                    <option value={1} >Paragraph</option>
                    <option value={2} >Multiple choice</option>
                    <option value={3} >Checkbox</option>
                    <option value={4} >Dropdown</option>
                    <option value={5} >File upload</option>
                    <option value={6} >Linear scale</option>
                    <option value={7} >Multiple choice grid</option>
                    <option value={8} >Checkbox grid</option>
                    <option value={9} >Date</option>
                    <option value={10} >Time</option>
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