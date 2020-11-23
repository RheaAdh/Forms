import React from "react";
import { useHistory } from "react-router-dom";
interface props {
  form: any;
}

const Form: React.FC<props> = ({ form }) => {
  let history = useHistory();

  const handleClick = () => {
    history.push(`/editForm/${form._id}`);
  };
  return (
    <div onClick={handleClick}>
      <h1 style={{ backgroundColor: "paleturquoise", cursor: "pointer" }}>
        {form.title}--{form.color_theme}
      </h1>
    </div>
  );
};

export default Form;
