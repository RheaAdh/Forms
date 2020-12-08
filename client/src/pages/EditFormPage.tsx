import React, { useState, useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";

import QuestionList from "../components/QuestionList";

import useFormState from "../hooks/useFormState";

//TODO:
////MAKE UPDATE FORM ROUTE
////ADD THE FORM TITLE CHANGE EFFECT
//CHANGES THE DELETE FORM ROUTE TO DELETE THOSE QUESTION CORRESPOINDING TO FORM
////CHANGE THE DELETE FORM THING TO CALL USE EFFECT INSTEAD OF REFRESHING
//ERROR HANDLING IF YOU FEEL LIKE IT

const EditFormPage: React.FC = () => {
  const { formid } = useParams();

  const [form, setForm] = useState<any>();
  const [questions, setQuestions] = useState<any[]>();

  const [showEditTitle, setShowEditTitle] = useState<boolean>(false);

  const [title, handleTitle, resetTitle, setTitle] = useFormState("");

  const inputRef = useRef<HTMLInputElement>(null);

  //?TO GET THE FORM
  useEffect(() => {
    fetch(`http://localhost:7000/api/getform/${formid}`)
      .then((resp: any) => {
        return resp.json();
      })

      .then((data: any) => {
        setForm(data);
        setTitle(data.title);
      });
  }, []);

  //?TO GET THE QUESTIONS OF THAT FORM
  useEffect(() => {
    if (form) {
      fetch(`http://localhost:7000/api/getquestionsbyformid/${formid}`)
        .then((resp: any) => {
          return resp.json();
        })

        .then((data: any) => {
          setQuestions(data);
        });
    }

    console.log(questions);
  }, []);

  const handleSubmit = (event: React.FocusEvent<HTMLInputElement>) => {
    event.preventDefault();
    //UPDATING ON BACK END
    fetch("http://localhost:7000/api/updateform", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...form, title: title }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        //UPDATING ON FRONT END
        setForm(data);
        setShowEditTitle(false);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleTitleClick = () => {
    setShowEditTitle(true);
  };

  useEffect(() => {
    if (showEditTitle) {
      if (null !== inputRef.current) inputRef.current.focus();
    }
  }, [showEditTitle]);

  return form ? (
    <div>
      {showEditTitle ? (
        <input
          onBlur={handleSubmit}
          type="text"
          value={title}
          onChange={handleTitle}
          ref={inputRef}
        ></input>
      ) : (
        <div onClick={handleTitleClick}>
          <h1>{form.title}</h1>
        </div>
      )}

      <h2>{form.color_theme}</h2>
      <Link to="/">
        <button>Back</button>
      </Link>
      <QuestionList />
    </div>
  ) : (
    <div>loading</div>
  );
};

//!POSTMAN COPY-PASTE
// "formid": "5fb61c61ac3bc523cf528434",
// "question_type": "mcq-answer",
// "question_text": "Who is your favourite Rick?",
// "options": [{"text": "Rick Riordan"}, {"text": "Rick Sanchez"}, {"text": "Rick Astley"}]

export default EditFormPage;
