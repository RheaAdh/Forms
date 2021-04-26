import React, { useEffect, useState } from "react"
import "../styles/DashboardPage.css"
import FormsPage from "./FormsPage"
import { useAuth } from "../context/AuthContext"
import AdminLoginPage from "./AdminLoginPage"
import { useHistory } from "react-router"

const DashboardPage: React.FC = () => {
    const auth = useAuth()
    const [current, setCurrent] = useState<string>("forms")
    const handleChange = (e: any) => {
        let element = document.getElementById(current)
        element?.setAttribute("style", "color : black;")
        e.target.style.color = "red"
        setCurrent(e.target.id)
    }
    const history = useHistory()
    useEffect(() => {
        auth?.getCurrentUser()
    }, [])
    const handleLogout = async () => {
        auth?.logout()
            .then((res) => history.push("/adminlogin"))
            .catch((err) => console.log(err))
    }
    return (
        <div className="dashboard">
            <div className="sidebar">
                <p
                    className="btn"
                    id="forms"
                    style={{ color: "red" }}
                    onClick={(e) => handleChange(e)}
                >
                    All Forms
                </p>
                <p
                    className="btn"
                    id="responses"
                    onClick={(e) => handleChange(e)}
                >
                    Admin Form Responses
                </p>
                <p className="btn" id="users" onClick={(e) => handleChange(e)}>
                    Board Form responses
                </p>
                {auth?.currentUser === null ? (
                    <p
                        className="btn"
                        id="admin-login"
                        onClick={(e) => {
                            history.push("/adminlogin")
                        }}
                    >
                        Login
                    </p>
                ) : (
                    <p className="btn" id="logout" onClick={handleLogout}>
                        Logout
                    </p>
                )}
            </div>
            <div className="main-column">
                {current === "forms" ? (
                    <FormsPage />
                ) : current === "responses" ? (
                    <h3>Nothing to see here</h3>
                ) : current === "users" ? (
                    <h3>Nothing to see here</h3>
                ) : current === "admin-login" ? (
                    <AdminLoginPage />
                ) : (
                    <p>lmao</p>
                )}
            </div>
        </div>
    )
}

export default DashboardPage
