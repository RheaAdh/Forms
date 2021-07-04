import React, { useEffect, useState } from "react"
import { Redirect, useHistory, useParams } from "react-router"
import { useAuth } from "../context/AuthContext"
import { useCurrentForm } from "../context/CurrentFormContext"
import "../styles/AdminNavbar.css"
import { Link } from "react-router-dom"
import { ReactComponent as PreviewIcon } from "../images/PreviewForm.svg"
import { ReactComponent as ProfileIcon } from "../images/ProfileIcon.svg"
import { ReactComponent as CopyIcon } from "../images/CopyIcon.svg"
import { CopyToClipboard } from "react-copy-to-clipboard"
import { ReactComponent as HomeIcon } from "../images/HomeIcon.svg"

interface props {
    questionsPage: boolean
}

const AdminNavbar = ({ questionsPage }: props) => {
    const auth = useAuth()
    const form = useCurrentForm()
    const history = useHistory()
    const { formId }: any = useParams()

    useEffect(() => {
        if (questionsPage !== undefined) {
            form?.setQuestionsPage(questionsPage)
        }
    }, [questionsPage])

    return (
        <div className="navbar">
            <div className="navbar-row1">
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
                {questionsPage ? (
                    <button
                        className="navbar-icon-btn"
                        onClick={() => history.push(`/form/${formId}`)}
                    >
                        <PreviewIcon style={{ width: "2rem" }} />
                        <span className="icon-info">Preview Form</span>
                        <span className="text-info-arrow" />
                    </button>
                ) : null}

                <CopyToClipboard
                    text={`http://localhost:3000/form/${form?.currentForm?.id}`}
                >
                    <button className="navbar-icon-btn">
                        <CopyIcon style={{ width: "1.5rem" }} />
                        <span className="icon-info">Copy Link to Form</span>
                        <span className="text-info-arrow" />
                    </button>
                </CopyToClipboard>
                <button
                    className="navbar-icon-btn"
                    onClick={() => history.push("/")}
                >
                    <HomeIcon />
                    <span className="icon-info">Dashboard</span>
                    <span className="text-info-arrow" />
                </button>
                <h2>{form?.currentForm?.title}</h2>
            </div>
            <div className="navbar-row2">
                <Link
                    to={`/form-admin/${formId}`}
                    onClick={() =>
                        form?.setQuestionsPage(
                            !form?.currentForm?.isQuestionsPage
                        )
                    }
                    style={{
                        textDecoration: "none",
                        borderColor: form?.currentForm?.isQuestionsPage
                            ? "var(--fontColor)"
                            : "var(--secondaryBackground)",
                        backgroundColor: form?.currentForm?.isQuestionsPage
                            ? "var(--secondaryBackground)"
                            : "inherit",
                    }}
                    className="navbar-row2-btn"
                >
                    Questions
                </Link>
                <Link
                    to={`/responses/${formId}`}
                    style={{
                        textDecoration: "none",
                        borderColor: !form?.currentForm?.isQuestionsPage
                            ? "var(--fontColor)"
                            : "var(--secondaryBackground)",
                        backgroundColor: !form?.currentForm?.isQuestionsPage
                            ? "var(--secondaryBackground)"
                            : "inherit",
                    }}
                    className="navbar-row2-btn"
                >
                    Responses
                </Link>
            </div>
        </div>
    )
}

export default AdminNavbar
