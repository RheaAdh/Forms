import React, { useState, useEffect } from "react";

import useFormState from "../hooks/useFormState";

import "../styles/Questions.css";
interface props {
  question?: any;
}
const Question: React.FC<props> = ({ question }) => {
  const [type, setType] = useState<any>(0);
  const [options, setOptions] = useState([0]);
  const [requiredVal, setRequired] = useState(question?question.required:false);
  const [questionText, handleQuestionText] = useFormState(
    question ? question.question_text : ""
  );
  const addOption = () => {
    setOptions(() => [...options, options.length]);
  };

  const updateQuestion = () => {
    fetch("http://localhost:7000/api/updatequestion", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...question, question_text: questionText, required: requiredVal }),
    })
      .then((response) => response.json())
      .then((data) => console.log({ data }));
  };

  //CALL UPDATE QUESTION EVERY TIME QUESTIONS TITLE CHANGES
  useEffect(updateQuestion, [questionText,requiredVal]);

  const types = [
    <div>
      <b>Short answer text</b>
    </div>,
    <div>
      <b>Paragraph text</b>
    </div>,
    <div>
      <b>Multiple choice</b>
      <ol>
        {options.map((a) => (
          <li key={a}>
            <input type="text" />
          </li>
        ))}
      </ol>
      <button onClick={addOption}>Add option</button>
    </div>,
    <div>
      <b>Checkbox</b>
      <ol>
        {options.map((a) => (
          <li key={a}>
            <input type="text" />
          </li>
        ))}
      </ol>
      <button onClick={addOption}>Add option</button>
    </div>,
    <div>
      <b>Dropdown</b>
      <ol>
        {options.map((a) => (
          <li key={a}>
            <input type="text" />
          </li>
        ))}
      </ol>
      <button onClick={addOption}>Add option</button>
    </div>,
    <div>
      <b>File upload</b>
      <table cellSpacing="20">
    <tr>
      <td>Allow only specific file types</td>
      <td><label className="switch">
          <input type="checkbox" />
          <span className="slider round"></span>
        </label>
      </td>
    </tr>
    <tr>
      <td>Maximum number of files</td>
      <td>
        <select name="maxNum">
          <option value="1">1</option>
          <option value="5">5</option>
          <option value="10">10</option>
        </select>
      </td>
    </tr>
    <tr>
      <td>Maximum file size</td>
      <td>
        <select name="maxSize">
          <option value="1MB">1 MB</option>
          <option value="10MB">10 MB</option>
          <option value="100MB">100 MB</option>
          <option value="1GB">1 GB</option>
          <option value="10GB">10 GB</option>
        </select>
      </td>
    </tr>
  </table>
    </div>,
    <div>
      <b>Linear scale</b>
      <table cellSpacing="10">
      <tr>
      <td><select name="minVal">
        <option value="0">0</option>
        <option value="1">1</option>
      </select>
      </td>
      <td>to</td>
      <td>
        <select name="minVal">
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
        <option value="6">6</option>
        <option value="7">7</option>
        <option value="8">8</option>
        <option value="9">9</option>
        <option value="10">10</option>
        </select>
      </td>
      </tr>
    </table>
    <br/>
    <br/>
    <input type="text" name="" placeholder="Label (Optional)"/>
    <br/>
    <br/>
    <input type="text" name="" placeholder="Label (Optional)"/>
    </div>,
    <div>
      <b>Multiple choice grid #will add later#</b>
    </div>,
    <div>
      <b>Checkbox grid #will add later#</b>
    </div>,
    <div>
      <b>Date [dd:mm:yy]</b>
    </div>,
    <div>
      <b>Time [hh:mm]</b>
    </div>,
  ];

  const questions_types = [
    "short-answer",
    "paragraph-answer",
    "mcq-answer",
    "checkbox-answer",
  ];
  return (
    <div className="question-component">
      <div className="question-meta">
        {/*<span>Question:</span>*/}
        <input
          className="question-text"
          type="text"
          onChange={handleQuestionText}
          value={questionText}
        />

        {/*This is only for testing, you can remove it*/}
        {requiredVal?"*":""}

        {/*<span>Type:</span>*/}
        <select
          className="question-select"
          onChange={(e) => {
            const selectedType = e.target.value;
            setType(selectedType);
          }}
        >
          <option value={0}>Short text</option>
          <option value={1}>Paragraph</option>
          <option value={2}>Multiple choice</option>
          <option value={3}>Checkbox</option>
          <option value={4}>Dropdown</option>
          <option value={5}>File upload</option>
          <option value={6}>Linear scale</option>
          <option value={7}>Multiple choice grid</option>
          <option value={8}>Checkbox grid</option>
          <option value={9}>Date</option>
          <option value={10}>Time</option>
        </select>
      </div>

      <div className="required">
        <input type="checkbox" checked={requiredVal} onChange={(e)=>{const reqVal = e.target.checked; setRequired(reqVal);}} />
        <span>Required</span>
      </div>
      {types[type]}
    </div>
  );
};

export default Question;
