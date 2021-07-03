import React from "react"
import "./App.css"
import DashboardPage from "./pages/DashboardPage"
import LoginPage from "./pages/LoginPage"
import AdminLoginPage from "./pages/AdminLoginPage"
import RegisterPage from "./pages/RegisterPage"
import ResetPassword from "./pages/ResetPassword"
import { Route, Switch } from "react-router-dom"
import { Protected } from "./Routes"
import FormForUser from "./pages/FormForUser"
import FormForUserResponseOnly from "./pages/FormForUserResponseOnly"
import EditFormPage from "./pages/EditFormPage"
import FormForAllResponses from "./pages/FormForAllResponses"

function App() {
    console.log("APP IS RERENDERED")

    return (
        <div className="App">
            <Switch>
                <Route path="/" exact render={() => <DashboardPage />} />

                <Protected
                    path="/form-admin/:formId"
                    component={() => <EditFormPage />}
                />

                <Route path={"/form/:formId"} render={() => <FormForUser />} />
                <Route path="/dashboard" render={() => <DashboardPage />} />
                <Route path="/adminlogin" render={() => <AdminLoginPage />} />
                <Route path="/login/:formId" render={() => <LoginPage />} />
                <Route path="/register" render={() => <RegisterPage />} />

                <Protected
                    path="/responses/:formId"
                    component={() => <FormForAllResponses />}
                />

                <Route
                    path="/response/:responseId"
                    render={() => <FormForUserResponseOnly />}
                />
                <Route
                    path="/resetpassword/:token"
                    render={() => <ResetPassword />}
                />
                <Route render={() => <div>404</div>} />
            </Switch>
        </div>
    )
}

export default App
