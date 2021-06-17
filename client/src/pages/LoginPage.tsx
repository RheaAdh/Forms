import React, { useEffect, useState } from "react"
import "../styles/Login.css"
import { useHistory, Redirect } from "react-router"
import { useParams } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const LoginPage: React.FC = () => {
    const auth = useAuth()
    const [loading, setLoading] = useState<boolean>(true)
    const { formid }: any = useParams()
    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        console.log("This function runs")
    }

    useEffect(() => {
        const fetchStore = async () => {
            await auth?.getCurrentUser().then((res: any) => setLoading(false))
        }
        fetchStore()
    }, [])

    if (loading) {
        return <div>Loading</div>
    }

    if (auth?.currentUser && formid) {
        return <Redirect to={`/form/${formid}`} />
    }

    return (
        <div className="form-container">
            <form id="form">
                
                <h3>Login</h3>
                <div className="container">
                    {auth?.currentUser ? (
                        <h4 style={{ color: "white" }}>You are logged in</h4>
                    ) : (
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
                                style={{
                                    textDecoration: "none",
                                    color: "white",
                                }}
                            >
                                Login With Google
                            </a>
                        </button>
                    )}
                </div>
            </form>
        </div>
    )
}

export default LoginPage
