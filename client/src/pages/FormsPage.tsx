import React, { useEffect, useState } from "react";
import FormList from "../components/FormList";
import NewForm from "../components/NewForm";
import Forms from "../components/FormList";

const FormsPage: React.FC = () => {
  const [forms, setForms] = useState<any[]>([]);

  useEffect(() => {
    fetch("http://localhost:7000/api/getforms")
      .then((resp: any) => {
        return resp.json();
      })

      .then((data: any) => {
        setForms(data);
      });
  }, []);
  return (
    <div>
      <FormList forms={forms} />
      <NewForm />
    </div>
  );
};

export default FormsPage;
