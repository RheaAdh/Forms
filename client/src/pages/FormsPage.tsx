import React, { useEffect, useState } from "react";
import FormList from "../components/FormList";
import NewForm from "../components/NewForm";
import Forms from "../components/FormList";

const FormsPage: React.FC = () => {
  const [forms, setForms] = useState<any[]>([]);

  useEffect(() => {
    fetch("http://localhost:7000/api/getforms", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((resp: any) => {
        return resp.json();
      })
      .catch((e) => console.log(e))

      .then((data: any) => {
        console.log({ data });
        if (data.success == true) {
          setForms(data.forms);
        } else {
          console.log("There is an imposter among us!!");
          //REDIRECT TO DASHBOARD PAGE I GUESS
        }
      });
  }, []);

  const deleteForm = (id: any) => {
    setForms((prevForms) => prevForms.filter((form) => form._id !== id));
  };
  return (
    <div>
      <FormList forms={forms} deleteForm={deleteForm} />
      <NewForm />
    </div>
  );
};

export default FormsPage;
