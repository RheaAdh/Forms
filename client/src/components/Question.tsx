import React, { useState, useEffect } from "react";

import useFormState from "../hooks/useFormState";

import "../styles/Questions.css";
interface props {
  addQuestion: any;
  question?: any;
}
const Question: React.FC<props> = ({ addQuestion, question }) => {
  const [type, setType] = useState<any>(0);
  const [options, setOptions] = useState([0]);
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
      body: JSON.stringify({ ...question, question_text: questionText }),
    })
      .then((response) => response.json())
      .then((data) => console.log({ data }));
  };

  //CALL UPDATE QUESTION EVERY TIME QUESTIONS TITLE CHANGES
  useEffect(updateQuestion, [questionText]);

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
      <b>File upload #will add later#</b>
    </div>,
    <div>
      <b>Linear scale #will add later#</b>
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
        <input type="checkbox" />
        <span>Required</span>
      </div>
      {types[type]}
      <button onClick={addQuestion}>Add Question</button>
    </div>
  );
};

export default Question;
