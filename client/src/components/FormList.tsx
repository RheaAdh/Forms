import React from "react";
import Form from "../components/Form";

interface props {
  forms: any[];
  deleteForm: any;
}

const Forms: React.FC<props> = ({ forms, deleteForm }) => {
  return (
    <div>
      Forms:
      {!forms ? (
        "Loading..."
      ) : (
        <div>
          {forms.map((form) => (
            <Form deleteForm={deleteForm} form={form} key={form._id} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Forms;
