import React, { useState, FormEvent } from "react";
import { useHistory } from "react-router-dom";

import useFormState from "../hooks/useFormState";

const NewForm = () => {
  const [addedForm, setAddedForm] = useState<any | null>(null);

  const history = useHistory();

  const [title, handleTitle] = useFormState("");

  //INITALLY addedForm IS NULL SO HISTORY DOESNT PUSH, BUT WHEN THE POST REQUEST IS
  //COMPLETE THE addedForm IS SET TO THE ADDED FORM, TRIGGERING A RERENDER, SO THAN
  //HISTORY GETS PUSHED    

  addedForm && history.push(`/editForm/${addedForm._id}`);

  console.log({ title });

  console.log({ addedForm });

  const addForm = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = { title: title, color_theme: "#ffffff" };

    fetch("http://localhost:7000/api/addForm", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    })
      .then((response) => response.json())
      .then((data) => {
        setAddedForm(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <div>
      <form onSubmit={addForm}>
        <input type="text" value={title} onChange={handleTitle} />
        <button type="submit">Add New Form</button>
      </form>
    </div>
  );
};

export default NewForm;
