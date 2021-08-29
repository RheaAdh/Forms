import React, { useState } from "react"
import "../../styles/Login.css"
import useFormState from "../../hooks/useFormState"
import { Redirect } from "react-router"
import { useParams } from "react-router-dom"
import { post } from "../../utils/requests"

const ResetPassword: React.FC = () => {
    const [password, handlePassword] = useFormState(null)
    const [confirmPassword, handleConfirmPassword] = useFormState(null)
    const [successfulReset, setSuccessfulReset] = useState<boolean>(false)
    const { token }: any = useParams()

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const data = await (
            await post(
                `/resetpassword/${token}`,
                {
                    newPassword: password,
                    newConfirmPassword: confirmPassword,
                },
                false
            )
        ).json()
        if (data.success) {
            setSuccessfulReset(true)
        } else {
            console.log("Something went wrong")
        }
    }

    if (successfulReset) {
        return <Redirect to="/adminlogin" />
    }

    return (
        <div className="form-container">
            <form id="form" onSubmit={(e) => handleFormSubmit(e)}>
                <h3>Reset Password</h3>
                <div className="container">
                    <span className="icon">
                        <i className="fas fa-at"></i>
                    </span>
                    <input
                        value={password}
                        onChange={handlePassword}
                        type="password"
                        placeholder="password"
                    />
                </div>
                <div className="container">
                    <span className="icon">
                        <i className="fas fa-at"></i>
                    </span>
                    <input
                        value={confirmPassword}
                        onChange={handleConfirmPassword}
                        type="password"
                        placeholder="confirm password"
                    />
                </div>
                <input type="submit" value="reset" />
            </form>
        </div>
    )
}

export default ResetPassword
