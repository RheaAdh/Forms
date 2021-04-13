import React from "react"
import "../styles/Login.css"

const LoginPage:React.FC = () => {
    return (
        <div className="form-container">
        <form id="form">
            <h3>Login</h3>
            <div className="container">
                <span className="icon"><i className="fas fa-at"></i></span>
                <input type="email" placeholder="email"/>
            </div>
            <div className="container">
                <span className="icon"><i className="fas fa-lock"></i></span>
                <input type="password" placeholder="password"/>
            </div>
            <input type="submit" value="login" />
        </form>
    </div>
    )
}

export default LoginPage;