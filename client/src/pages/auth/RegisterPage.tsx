import React, { useEffect, useState } from "react"
import "../../styles/Login.css"
import useFormState from "../../hooks/useFormState"
import { Redirect, useHistory } from "react-router"
import { useAuth } from "../../context/auth/AuthContext"

const RegisterPage: React.FC = () => {
    const [username, handleUsername] = useFormState("")
    const [email, handleEmail] = useFormState("")
    const [password, handlePassword] = useFormState("")
    const [confirmPassword, handleConfirmPassword] = useFormState("")
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    const value = useAuth()
    const history = useHistory()

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const response = await value?.register(
            username,
            email,
            password,
            confirmPassword
        )
        console.log({ response })
        if (response.success === true) {
            history.push("/adminlogin")
        } else {
            setErrorMessage(response.data)
        }
    }

    useEffect(() => {
        if (value?.currentUser === null) value.getCurrentUser()
    }, [])
    return value?.currentUser && value?.currentUser?.userid !== "x" ? (
        <Redirect to="/" />
    ) : (
        <div className="form-container">
            <form
                id="form"
                onSubmit={handleFormSubmit}
                style={{ height: "550px" }}
            >
                <h3>Register</h3>
                <div className="container">
                    <input
                        value={username}
                        onChange={handleUsername}
                        type="text"
                        placeholder="username"
                    />
                </div>
                <div className="container">
                    <input
                        value={email}
                        onChange={handleEmail}
                        type="email"
                        placeholder="email"
                    />
                </div>
                <div className="container">
                    <input
                        value={password}
                        onChange={handlePassword}
                        type="password"
                        placeholder="password"
                    />
                </div>
                <div className="container">
                    <input
                        value={confirmPassword}
                        onChange={handleConfirmPassword}
                        type="password"
                        placeholder="confirm password"
                    />
                </div>
                <div className="container">
                    <h5 className="error-message">{errorMessage}</h5>
                </div>
                <input
                    type="submit"
                    value="register"
                    style={{ color: "black" }}
                />
            </form>
        </div>
    )
}

export default RegisterPage
