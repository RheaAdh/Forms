import React from "react"
import "./App.css"
import DashboardPage from "./pages/dashboard/DashboardPage"
import LoginPage from "./pages/auth/LoginPage"
import AdminLoginPage from "./pages/auth/AdminLoginPage"
import RegisterPage from "./pages/auth/RegisterPage"
import ResetPassword from "./pages/auth/ResetPassword"
import { Route, Switch } from "react-router-dom"
import { Protected } from "./Routes"
import FormForUser from "./pages/allUsers/FormForUser"
import FormForUserResponseOnly from "./pages/allUsers/FormForUserResponseOnly"
import EditFormPage from "./pages/admin/EditFormPage"
import FormForAllResponses from "./pages/admin/FormForAllResponses"

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
