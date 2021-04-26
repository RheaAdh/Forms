import React, { useEffect } from "react"
import "../styles/Login.css"
import { useHistory, Redirect } from "react-router"
import { useParams } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const LoginPage: React.FC = () => {
    const auth = useAuth()
    const history = useHistory()
    const { formid }: any = useParams()
    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        console.log("This function runs")
    }

    useEffect(() => {
        if (auth?.currentUser === null) auth.getCurrentUser()
    }, [])
    return auth?.currentUser ? (
        <Redirect to={`form/${formid}`} />
    ) : (
        <div className="form-container">
            <form id="form">
                <h3>Login</h3>
                <div className="container">
                    <button
                        style={{
                            padding: "10px",
                            borderRadius: "15px",
                            background: "red",
                            color: "white",
                            cursor: "pointer",
                            width: "auto",
                            border: "none",
                        }}
                    >
                        <a
                            href="http://localhost:7000/user/auth/google"
                            style={{ textDecoration: "none", color: "white" }}
                        >
                            Login With Google
                        </a>
                    </button>
                </div>
            </form>
        </div>
    )
}

export default LoginPage
