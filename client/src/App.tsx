import React, { useEffect, useState } from "react";
import "./App.css";
import EditFormPage from "./pages/EditFormPage";
import FormsPage from "./pages/FormsPage";
import { BrowserRouter as Router, Route } from "react-router-dom";

function App() {
  console.log("APP IS RERENDERED");
  // const [text, setText] = useState("loading...");

  // useEffect(() => {
  //   fetch("http://localhost:7000/api/helloworld")
  //     .then((resp: any) => resp.json())

  //     .then((data: any) => {setText(data.data);
  // });

  //!WHY IS THIS NOT WORKING??
  //   const fetchForms = async () => {
  //     setLoading(true);
  //     const resp = await fetch("http://localhost:7000/api/getforms");
  //     console.log(resp);
  //     const data: any = resp.json();
  //     setForms(data);
  //     setLoading(false);
  //   };

  return (
    <div className="App">
      <Route path="/" exact render={() => <FormsPage />} />
      <Route path="/editform/:formid" render={() => <EditFormPage />} />
    </div>
  );
}

export default App;
