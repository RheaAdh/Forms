import React, { useEffect, useState } from "react";
import "./App.css";
import EditFormPage from "./pages/EditFormPage";
import FormsPage from "./pages/FormsPage";
import DashboardPage from "./pages/DashboardPage"
import LoginPage from "./pages/LoginPage"
import { Route } from "react-router-dom";

function App() {
  console.log("APP IS RERENDERED");

  return (
    <div className="App">
      <Route path="/" exact render={() => <FormsPage />} />
      <Route path="/editform/:formid" render={() => <EditFormPage />} />
      <Route path="/dashboard" render={()=><DashboardPage/>}/>
      <Route path="/login" render = {()=><LoginPage/>}/>
    </div>
  );
}

export default App;
