import React, { useState } from "react"
import { useHistory } from "react-router"
import { useAuth } from "../context/AuthContext"
import { CurrentForm } from "../context/CurrentFormContext"
import { ReactComponent as ProfileIcon } from "../images/ProfileIcon.svg"
import "../styles/AdminNavbar.css"
import "../styles/DashboardNavbar.css"

interface props {
    allForms: CurrentForm[] | undefined
    setSearchList: React.Dispatch<
        React.SetStateAction<CurrentForm[] | undefined>
    >
}

const DashboardNavbar: React.FC<props> = ({ allForms, setSearchList }) => {
    const auth = useAuth()

    const history = useHistory()

    const produceResults = (searchString: string) => {
        setSearchList(
            allForms?.filter(
                (form: CurrentForm) =>
                    form.title?.toLowerCase().search(searchString) !== -1
            )
        )
    }

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
                    placeholder="Search Forms"
                    onChange={(e) =>
                        produceResults(
                            e.target.value
                                .replace(/[^a-zA-Z ]/g, "")
                                .toLowerCase()
                        )
                    }
                ></input>
            </div>
        </div>
    )
}

export default DashboardNavbar
