import React, { useEffect, useState } from "react"
import "../styles/DashboardPage.css"
import FormsPage from "./FormsPage"
import { useAuth } from "../context/AuthContext"
import AdminLoginPage from "./AdminLoginPage"
import { useHistory } from "react-router"
import TemplatePage from "../pages/TemplatePage"
import Error from "../components/Error"
import ResponseList from "../components/ResponseList"
import { Link } from "react-router-dom"

const DashboardPage: React.FC = () => {
    const auth = useAuth()
    const [loading, setLoading] = useState<boolean>(true)
    const [current, setCurrent] = useState<string>("allForms")

    // Sidenav
    const handleChange = (e: any) => {
        let element = document.getElementById(current)
        element?.setAttribute("style", "color : var(--fontColor);")
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
        <div className="dashboard-page">
            <div className="dashboard">
                <div className="sidebar">
                    {auth?.currentUser?.role === "admin" ||
                    auth?.currentUser?.role === "superadmin" ? (
                        <button
                            className="btn"
                            id="allForms"
                            onClick={(e) => handleChange(e)}
                        >
                            All Forms / Create Form
                        </button>
                    ) : null}
                    {auth?.currentUser?.role === "admin" ||
                    auth?.currentUser?.role === "superadmin" ? (
                        <button
                            className="btn"
                            id="templates"
                            onClick={(e) => handleChange(e)}
                        >
                            Templates(Create Copy and work)
                        </button>
                    ) : null}
                    {auth?.currentUser?.role === "admin" ||
                    auth?.currentUser?.role === "superadmin" ? (
                        <button
                            className="btn"
                            id="adminForms"
                            onClick={(e) => handleChange(e)}
                        >
                            Mancomm Form Responses
                        </button>
                    ) : null}
                    {auth?.currentUser?.role === "superadmin" ? (
                        <button
                            className="btn"
                            id="superAdminForms"
                            onClick={(e) => handleChange(e)}
                        >
                            Board Form responses
                        </button>
                    ) : null}
                    {auth?.currentUser?.userid === "x" ||
                    auth?.currentUser === null ? (
                        <div>
                            <Link
                                to="/adminlogin"
                                style={{
                                    textDecoration: "none",
                                    color: "#FFF",
                                }}
                            >
                                Login (ADMIN ONLY)
                            </Link>
                        </div>
                    ) : (
                        <p className="btn" id="logout" onClick={handleLogout}>
                            Logout
                        </p>
                    )}
                </div>
                <div className="main-column">
                    {auth?.currentUser?.role === "admin" ||
                    auth?.currentUser?.role === "superadmin" ? (
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
                            <TemplatePage />
                        ) : (
                            <p>lmao</p>
                        )
                    ) : (
                        <div>What are you doing here??</div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default DashboardPage
