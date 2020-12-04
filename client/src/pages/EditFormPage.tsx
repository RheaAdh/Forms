import React, { useState, useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";

import QuestionList from "../components/QuestionList";

import useFormState from "../hooks/useFormState";

//TODO:
////MAKE UPDATE FORM ROUTE
//ADD THE FORM TITLE CHANGE EFFECT
//CHANGES THE DELETE FORM ROUTE TO DELETE THOSE QUESTION CORRESPOINDING TO FORM
//CHANGE THE DELETE FORM THING TO CALL USE EFFECT INSTEAD OF REFRESHING
//ERROR HANDLING IF YOU FEEL LIKE IT

const EditFormPage: React.FC = () => {
  console.log("EDIT FORM PAGE RERENDERS");
  const { formid } = useParams();

  const [form, setForm] = useState<any>();
  const [questions, setQuestions] = useState<any[]>();

  const [title, handleTitle, resetTitle] = useFormState("");

  useEffect(() => {
    fetch(`http://localhost:7000/api/getform/${formid}`)
      .then((resp: any) => {
        return resp.json();
      })

      .then((data: any) => {
        setForm(data);
      });
  }, []);

  useEffect(() => {
    if (form) {
      fetch(`http://localhost:7000/api/getquestionsbyformid/${formid}`)
        .then((resp: any) => {
          return resp.json();
        })

        .then((data: any) => {
          console.log(data);
          setQuestions(data);
        });
    }

    console.log(questions);
  }, []);

  useEffect(() => {
    fetch("http://localhost:7000/api/updateform", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, [form]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setForm({ ...form, title: title });
  };

  return form ? (
    <div>
      {/*MAKE THIS FORM TOGGLABLE ON CLICK OF THE TITLE H1 */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={title ? title : form.title}
          onChange={handleTitle}
        ></input>
      </form>
      <h1>{form.title}</h1>
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
