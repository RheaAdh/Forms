import React from "react";
import { useHistory } from "react-router-dom";
interface props {
  form: any;
  deleteForm: any;
}

const Form: React.FC<props> = ({ form, deleteForm }) => {
  let history = useHistory();

  const handleClick = () => {
    history.push(`/editForm/${form._id}`);
  };

  const handleDelete = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.stopPropagation();

    //!CHANGE ON BACK END
    const body = { id: form._id };
    fetch("http://localhost:7000/api/deleteform", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        //!CHANGE ON FRONT END
        deleteForm(form._id);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <div onClick={handleClick}>
      <div>
        <h1 style={{ backgroundColor: form.color_theme, cursor: "pointer" }}>
          {form.title}--{form.color_theme}
          <button onClick={handleDelete}>Delete Form</button>
        </h1>
      </div>
    </div>
  );
};

export default Form;
