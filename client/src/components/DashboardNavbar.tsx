import React from "react"
import { useHistory } from "react-router"
import { useAuth } from "../context/AuthContext"
import { ReactComponent as ProfileIcon } from "../images/ProfileIcon.svg"
import "../styles/AdminNavbar.css"
import "../styles/DashboardNavbar.css"

const DashboardNavbar = () => {
    const auth = useAuth()

    const history = useHistory()

    return (
        <div className="dashboard-navbar">
            <div className="container">
                <button className="navbar-icon-btn">
                    <ProfileIcon />
                    <div className="icon-info profile-icon">
                        <p>{auth?.currentUser?.username}</p>
                        <p>{auth?.currentUser?.email}</p>
                        <p>{auth?.currentUser?.role}</p>
                        <p
                            className="logout-btn"
                            onClick={() => {
                                auth?.logout().then((data) =>
                                    history.push("/adminlogin")
                                )
                            }}
                        >
                            Logout
                        </p>
                    </div>
                    <span className="text-info-arrow" />
                </button>
                <input
                    type="text"
                    className="search-bar"
                    placeholder="Search"
                ></input>
            </div>
        </div>
    )
}

export default DashboardNavbar
