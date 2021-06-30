import React, { useEffect, useState } from "react"
import { useHistory } from "react-router"
import { useAuth } from "../context/AuthContext"
import { useCurrentForm } from "../context/CurrentFormContext"
import "../styles/AdminNavbar.css"

interface props {
    questionsPage: boolean
}

const AdminNavbar = ({ questionsPage }: props) => {
    const auth = useAuth()
    const form = useCurrentForm()
    const history = useHistory()

    useEffect(() => {
        if (questionsPage !== undefined) {
            form?.setQuestionsPage(questionsPage)
        }
    }, [questionsPage])

    return (
        <div className="navbar">
            <div className="navbar-row1">
                <button className="navbar-btn" onClick={auth?.logout}>
                    Logout
                </button>
                {questionsPage ? (
                    <button
                        className="navbar-btn"
                        onClick={() => history.push("/")}
                    >
                        Save
                    </button>
                ) : null}
                {questionsPage ? (
                    <button className="navbar-icon-btn">
                        <svg
                            width="32"
                            height="22"
                            viewBox="0 0 32 22"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                opacity="0.87"
                                d="M16 0C8.72727 0 2.51636 4.56133 0 11C2.51636 17.4387 8.72727 22 16 22C23.2727 22 29.4836 17.4387 32 11C29.4836 4.56133 23.2727 0 16 0ZM16 18.3333C11.9855 18.3333 8.72727 15.048 8.72727 11C8.72727 6.952 11.9855 3.66667 16 3.66667C20.0145 3.66667 23.2727 6.952 23.2727 11C23.2727 15.048 20.0145 18.3333 16 18.3333ZM16 6.6C13.5855 6.6 11.6364 8.56533 11.6364 11C11.6364 13.4347 13.5855 15.4 16 15.4C18.4145 15.4 20.3636 13.4347 20.3636 11C20.3636 8.56533 18.4145 6.6 16 6.6Z"
                            />
                        </svg>
                    </button>
                ) : null}

                <h2>{form?.currentForm?.title}</h2>
            </div>
            <div className="navbar-row2">
                <button
                    onClick={() =>
                        form?.setQuestionsPage(
                            !form?.currentForm?.isQuestionsPage
                        )
                    }
                    style={{
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
                </button>
                <button
                    onClick={() =>
                        form?.setQuestionsPage(
                            !form?.currentForm?.isQuestionsPage
                        )
                    }
                    style={{
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
                </button>
            </div>
        </div>
    )
}

export default AdminNavbar
