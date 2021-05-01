import React, { useEffect, useState } from "react"
import "./App.css"
import EditFormPage from "./pages/EditFormPage"
import DashboardPage from "./pages/DashboardPage"
import LoginPage from "./pages/LoginPage"
import AdminLoginPage from "./pages/AdminLoginPage"
import RegisterPage from "./pages/RegisterPage"
import DisplayForm from "./pages/DisplayForm"
import ResetPassword from "./pages/ResetPassword"
import { Route } from "react-router-dom"

function App() {
    console.log("APP IS RERENDERED")

    return (
        <div className="App">
            <Route path="/" exact render={() => <DashboardPage />} />
            <Route path="/editform/:formid" render={() => <EditFormPage />} />
            <Route path="/form/:formid" render={() => <DisplayForm />} />
            <Route path="/dashboard" render={() => <DashboardPage />} />
            <Route path="/adminlogin" render={() => <AdminLoginPage />} />
            <Route path="/login/:formid" render={() => <LoginPage />} />
            <Route exact path="/login" render={() => <LoginPage />} />
            <Route path="/register" render={() => <RegisterPage />} />
            <Route
                path="/resetpassword/:token"
                render={() => <ResetPassword />}
            />
        </div>
    )
}

export default App
