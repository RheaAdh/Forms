import React, { useEffect, useState } from "react";
import "./App.css";
import NewFormPage from "./pages/NewForm";
import Forms from "./components/FormList";
import NewForm from "./components/NewForm";

function App() {
  const [text, setText] = useState("loading...");
  useEffect(() => {
    fetch("http://localhost:7000/api/helloworld")
      .then((resp: any) => resp.json())

      .then((data: any) => setText(data.data));
  });
  return (
    <div className="App">
      {text}
      <NewFormPage />
      <Forms />
      <NewForm />
    </div>
  );
}

export default App;
