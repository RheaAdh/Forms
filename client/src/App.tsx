import React, { useEffect, useState } from "react";
import "./App.css";
import EditFormPage from "./pages/EditFormPage";
import FormsPage from "./pages/FormsPage";
import { Route } from "react-router-dom";

function App() {
  console.log("APP IS RERENDERED");

  return (
    <div className="App">
      <Route path="/" exact render={() => <FormsPage />} />
      <Route path="/editform/:formid" render={() => <EditFormPage />} />
    </div>
  );
}

export default App;
