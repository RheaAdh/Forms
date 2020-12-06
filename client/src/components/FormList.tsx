import React from "react";
import Form from "../components/Form";

interface props {
  forms: any[];
  setCall: any;
}

const Forms: React.FC<props> = ({ forms, setCall }) => {
  return (
    <div>
      Forms:
      {!forms ? (
        "Loading..."
      ) : (
        <div>
          {forms.map((form) => (
            <Form form={form} key={form._id} setCall={setCall} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Forms;
