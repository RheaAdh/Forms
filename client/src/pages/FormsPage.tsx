import React from "react";
import FormList from "../components/FormList";
import NewForm from "../components/NewForm";
import Forms from "../components/FormList";

interface props {
  forms: any[];
}

const FormsPage: React.FC<props> = ({ forms }) => {
  return (
    <div>
      <FormList forms={forms} />
      <NewForm />
    </div>
  );
};

export default FormsPage;
