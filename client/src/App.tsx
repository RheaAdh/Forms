import React, { useEffect, useState } from "react";
import "./App.css";
import NewFormPage from "./pages/NewFormPage";
import FormsPage from "./pages/FormsPage";
import { BrowserRouter as Router, Route } from "react-router-dom";

function App() {
  const [text, setText] = useState("loading...");
  useEffect(() => {
    fetch("http://localhost:7000/api/helloworld")
      .then((resp: any) => resp.json())

      .then((data: any) => setText(data.data));
  });
  return (
    <div className="App">
      <Router>
        <Route path="/" exact component={FormsPage} />
        <Route path="/newform" component={NewFormPage} />
      </ Router>
    </div>
  );
}

export default App;
