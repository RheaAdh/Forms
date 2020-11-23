import React from "react";
import Form from "../components/Form";

interface props {
  forms: any[];
}

const Forms: React.FC<props> = ({ forms }) => {
  return (
    <div>
      Forms:
      {!forms ? (
        "Loading..."
      ) : (
        <div>
          {forms.map((form) => (
            <Form form={form} key={form._id} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Forms;
