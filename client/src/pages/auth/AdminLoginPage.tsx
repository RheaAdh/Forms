import React, { useEffect, useState } from "react"
import "../../styles/Login.css"
import useFormState from "../../hooks/useFormState"
import { useHistory, Redirect } from "react-router"
import { useAuth } from "../../context/auth/AuthContext"

const AdminLoginPage: React.FC = () => {
    const [email, handleEmail] = useFormState("")
    const [password, handlePassword] = useFormState("")
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [forgotPassword, setForgotPassword] = useState<boolean>(false)
    const [token, setToken] = useState<null | string>(null)
    const auth = useAuth()
    const history = useHistory()

    useEffect(() => {
        if (auth?.currentUser === null) {
            auth.getCurrentUser()
                .then((data) => setLoading(false))
                .catch((error) => {
                    setLoading(false)
                    console.log(error.message)
                })
        }
    }, [])

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        console.log("called")
        if (forgotPassword) {
            const resp = await auth?.forgotPassword(email)
            console.log(resp)
            if (resp.success) {
                setToken(resp.data)
                alert("check your mail")
            } else {
                setErrorMessage(resp.data)
            }
        } else {
            const resp = await auth?.login(email, password)
            if (resp.success === true) {
                history.push("/")
            } else {
                setErrorMessage(resp.data)
            }
        }
    }

    const handleForgotPassword = () => {
        console.log("called")
        setForgotPassword(true)
    }

    if (loading) {
        return <div>Loading</div>
    }
    return (
        <div className="form-container">
            <form id="form" onSubmit={handleFormSubmit}>
                {forgotPassword ? <h3>Enter your email</h3> : <h3>Login</h3>}
                <div className="container">
                    <input
                        value={email}
                        onChange={handleEmail}
                        type="email"
                        placeholder="email"
                    />
                </div>
                {forgotPassword ? null : (
                    <div className="container">
                        <input
                            value={password}
                            onChange={handlePassword}
                            type="password"
                            placeholder="password"
                        />
                    </div>
                )}
                <div className="container">
                    <h4 className="error-message">{errorMessage}</h4>
                </div>

                <input
                    type="submit"
                    style={{
                        border: "none",
                        cursor: "pointer",
                        background: "none",
                    }}
                    value={forgotPassword ? "Confirm email" : "Login"}
                />

                {forgotPassword ? null : (
                    <input
                        type="button"
                        value="Forgot Password"
                        style={{
                            border: "none",
                            cursor: "pointer",
                            background: "none",
                        }}
                        onClick={(e) => handleForgotPassword()}
                    />
                )}
            </form>
        </div>
    )
}

export default AdminLoginPage
