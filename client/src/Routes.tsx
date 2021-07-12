import React from "react"
import { Redirect, Route, RouteProps, useParams } from "react-router"
import Error from "./components/Error"
import { useAuth } from "./context/auth/AuthContext"

export interface props extends RouteProps {}

const LoggedIn: React.FC<props> = ({ ...rest }) => {
    const auth = useAuth()?.currentUser
    const { formId }: any = useParams()
    if (formId !== undefined && auth?.userid === "x") {
        return <Redirect to={`/login/${formId}`} />
    }
    return <Route {...rest} />
}

export const Protected: React.FC<props> = ({ ...rest }: any) => {
    const auth = useAuth()?.currentUser
    if (
        auth?.role === "admin" ||
        auth?.role === "superadmin" ||
        auth === null
    ) {
        return <Route {...rest} />
    }
    return <Error />
}

export default LoggedIn
