import React, { useEffect, useState } from "react"
import "../../styles/Login.css"
import { Redirect } from "react-router"
import { useParams } from "react-router-dom"
import { useAuth } from "../../context/auth/AuthContext"
import { GoogleLogin } from "react-google-login"
import { post } from "../../utils/requests"
import config from "./config"

const LoginPage: React.FC = () => {
    const auth = useAuth()
    const [loading, setLoading] = useState<boolean>(true)
    const { formId }: any = useParams()
    const [redirect, setRedirect] = useState<boolean>(false)

    useEffect(() => {
        const fetchStore = async () => {
            await auth?.getCurrentUser().then((res: any) => setLoading(false))
        }
        fetchStore()
    }, [])

    const handleLogin = async (googleData: any) => {
        const res = await post(
            "/api/user/auth/google",
            { token: googleData.tokenId },
            false
        )
        const data = await res.json()
        setRedirect(true)
    }

    if (loading) {
        return <div>Loading</div>
    }

    if (
        (auth?.currentUser && auth.currentUser.userid !== "x" && formId) ||
        redirect
    ) {
        return <Redirect to={`/form/${formId}`} />
    }

    return (
        <div className="form-container">
            <form id="form">
                <h3>Login</h3>
                <div className="container">
                    <GoogleLogin
                        clientId={config.REACT_APP_CLIENT_ID}
                        buttonText={"Login with Google"}
                        onSuccess={handleLogin}
                        onFailure={handleLogin}
                        cookiePolicy={"single_host_origin"}
                    />
                </div>
            </form>
        </div>
    )
}

export default LoginPage
