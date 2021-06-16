import React, { useEffect, useState } from "react"
import "../styles/DashboardPage.css"
import FormsPage from "./FormsPage"
import { useAuth } from "../context/AuthContext"
import AdminLoginPage from "./AdminLoginPage"
import { useHistory } from "react-router"
import TemplateList from "../components/TemplateList"
import ResponseList from "../components/ResponseList"

const DashboardPage: React.FC = () => {
    const auth = useAuth()
    const [loading, setLoading] = useState<boolean>(true)
    const [current, setCurrent] = useState<string>("allForms")

    // Sidenav
    const handleChange = (e: any) => {
        let element = document.getElementById(current)
        element?.setAttribute("style", "color : black;")
        e.target.style.color = "red"
        setCurrent(e.target.id)
    }

    const history = useHistory()
    useEffect(() => {
        auth?.getCurrentUser().then((res: any) => setLoading(false))
    }, [])
    const handleLogout = async () => {
        auth?.logout()
            .then((res) => history.push("/adminlogin"))
            .catch((err) => console.log(err))
    }

    if (loading) {
        return <div>Loading...</div>
    }

    return (
        <div className="dashboard">
            <div className="sidebar">
                {auth?.currentUser !== null ? (
                    <p
                        className="btn"
                        id="allForms"
                        onClick={(e) => handleChange(e)}
                    >
                        All Forms
                    </p>
                ) : null}
                {auth?.currentUser !== null ? (
                    <p
                        className="btn"
                        id="templates"
                        onClick={(e) => handleChange(e)}
                    >
                        Templates
                    </p>
                ) : null}
                {auth?.currentUser !== null ? (
                    <p
                        className="btn"
                        id="adminForms"
                        onClick={(e) => handleChange(e)}
                    >
                        Admin Form Responses
                    </p>
                ) : null}
                {auth?.currentUser?.role === "superadmin" ? (
                    <p
                        className="btn"
                        id="superAdminForms"
                        onClick={(e) => handleChange(e)}
                    >
                        Board Form responses
                    </p>
                ) : null}
                {auth?.currentUser === null ? (
                    <div>
                        <p
                            className="btn"
                            id="admin-login"
                            onClick={(e) => {
                                history.push("/adminlogin")
                            }}
                        >
                            Login
                        </p>
                        <p
                            className="btn"
                            id="admin-login"
                            onClick={(e) => {
                                history.push("/register")
                            }}
                        >
                            Register
                        </p>
                    </div>
                ) : (
                    <p className="btn" id="logout" onClick={handleLogout}>
                        Logout
                    </p>
                )}
            </div>
            <div className="main-column">
                {auth?.currentUser?.role !== null ? (
                    current === "allForms" ? (
                        <FormsPage />
                    ) : current === "adminForms" ? (
                        <ResponseList creatorRole="admin" />
                    ) : current === "superAdminForms" &&
                      auth?.currentUser?.role === "superadmin" ? (
                        <ResponseList creatorRole="superadmin" />
                    ) : current === "admin-login" ? (
                        <AdminLoginPage />
                    ) : current === "templates" ? (
                        <TemplateList />
                    ) : (
                        <p>lmao</p>
                    )
                ) : (
                    <ResponseList creatorRole="admin" />
                )}
            </div>
        </div>
    )
}

export default DashboardPage
