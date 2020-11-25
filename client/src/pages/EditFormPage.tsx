import React, { useState, useEffect, useRef } from "react";
import QuestionList from "../components/QuestionList";
import { Link, useParams } from "react-router-dom";

const EditFormPage: React.FC = () => {
  console.log("EDIT FORM PAGE RERENDERS");
  const { formid } = useParams();

  const [form, setForm] = useState<any>();

  let questions = [];

  useEffect(() => {
    fetch(`http://localhost:7000/api/getform/${formid}`)
      .then((resp: any) => {
        return resp.json();
      })

      .then((data: any) => {
        setForm(data);
      });
  }, []);

  // useEffect(() => {
  //   if (form) {
  //     questions = form.questions.map((q) => fetch)
  //   }
  // });

  //!WHY DOES THIS WORK
  //setForm(forms.find((ele) => ele._id === formid));

  //const form = forms.find((ele) => ele._id === formid);

  // useEffect(() => {
  //   if (form) {
  //   }
  // }, []);

  return form ? (
    <div>
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

// "formid": "5fb61c61ac3bc523cf528434",
// "question_type": "mcq-answer",
// "question_text": "Who is your favourite Rick?",
// "options": [{"text": "Rick Riordan"}, {"text": "Rick Sanchez"}, {"text": "Rick Astley"}]

export default EditFormPage;