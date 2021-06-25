import React, { useEffect, useState } from "react"
import "./App.css"
import EditFormPage from "./pages/EditFormPage"
import DashboardPage from "./pages/DashboardPage"
import LoginPage from "./pages/LoginPage"
import AdminLoginPage from "./pages/AdminLoginPage"
import RegisterPage from "./pages/RegisterPage"
import DisplayForm from "./pages/DisplayForm"
import ResetPassword from "./pages/ResetPassword"
import { Route, Switch } from "react-router-dom"

function App() {
    console.log("APP IS RERENDERED")

    return (
        <div className="App">
            <Switch>
                <Route path="/" exact render={() => <DashboardPage />} />
                <Route
                    path="/editform/:formid"
                    render={() => <EditFormPage />}
                />
                <Route
                    path="/form/:formid"
                    render={() => (
                        <DisplayForm
                            readonly={false}
                            responseOnlyPage={false}
                        />
                    )}
                />
                <Route path="/dashboard" render={() => <DashboardPage />} />
                <Route path="/adminlogin" render={() => <AdminLoginPage />} />
                <Route path="/login/:formid" render={() => <LoginPage />} />
                <Route path="/register" render={() => <RegisterPage />} />
                <Route
                    path="/responses/:formid"
                    render={() => (
                        <DisplayForm readonly={true} responseOnlyPage={false} />
                    )}
                />
                <Route
                    path="/response/:responseId"
                    render={() => (
                        <DisplayForm readonly={true} responseOnlyPage={true} />
                    )}
                />
                <Route
                    path="/resetpassword/:token"
                    render={() => <ResetPassword />}
                />
                <Route component={() => <div>404</div>} />
            </Switch>
        </div>
    )
}

export default App
