import React, { createElement, useEffect } from "react"
import { Redirect, Route } from "react-router"
import Error from "./components/Error"
import { useAuth } from "./context/AuthContext"
import { useCurrentForm } from "./context/CurrentFormContext"

const LoggedIn = ({ comp, ...rest }: any) => {
    const auth = useAuth()?.currentUser
    const routeComponent = (props: any) => {
        return auth?.userid === "x" ? (
            <Redirect to={`/login/${props.match.params.formid}`} />
        ) : (
            createElement(comp, props)
        )
    }
    return <Route {...rest} component={routeComponent} />
}

export const Protected = ({ comp, ...rest }: any) => {
    const auth = useAuth()?.currentUser
    const routeComponent = (props: any) => {
        return auth?.role === "admin" ||
            auth?.role === "superadmin" ||
            auth === null ? (
            createElement(comp, props)
        ) : (
            <Error />
        )
    }

    return <Route {...rest} component={routeComponent} />
}

export default LoggedIn
