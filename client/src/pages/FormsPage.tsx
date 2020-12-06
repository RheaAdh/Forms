import React, { useEffect, useState } from "react";
import FormList from "../components/FormList";
import NewForm from "../components/NewForm";
import openSocket from "socket.io-client";
import Forms from "../components/FormList";

const FormsPage: React.FC = () => {
  const [forms, setForms] = useState<any[]>([]);
  const [call, setCall] = useState<any>(0);

  console.log("FORMS PAGE RERENDERS!!!!!!!!");

  useEffect(() => {
    fetch("http://localhost:7000/api/getforms")
      .then((resp: any) => {
        return resp.json();
      })

      .then((data: any) => {
        setForms(data);
      });

    const socket = openSocket("http://localhost:7000");

    socket.on("forms", (data: any) => {
      addFormLocal(data.newForm);
    });
  }, [call]);

  const addFormLocal = (form: any) => {
    setCall((prev: any) => prev + 1);
  };

  return (
    <div>
      <FormList forms={forms} setCall={setCall} />
      <NewForm />
    </div>
  );
};

export default FormsPage;
