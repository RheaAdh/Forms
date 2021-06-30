import React, { useState, useContext, ReactElement } from "react"
export type Nullable<T> = T | null

export interface IUser {
    userid: string
    username: string
    email: string
    role: string
}

interface Props {
    children: ReactElement
}

export interface Value {
    currentUser: Nullable<IUser>
    setCurrentUser: any
    register: (
        username: string,
        email: string,
        password: string,
        confirmPassword: string
    ) => Promise<any>
    login: (email: string, password: string) => Promise<any>
    logout: () => Promise<any>
    forgotPassword: (email: string) => Promise<any>
    getCurrentUser: any
}

const AuthContext = React.createContext<Nullable<Value>>(null)

export const useAuth = () => {
    return useContext(AuthContext)
}

export default function AuthProvider({ children }: Props): ReactElement {
    const [currentUser, setCurrentUser] = useState<IUser | null>(null)

    const register = async (
        username: string,
        email: string,
        password: string,
        confirmPassword: string
    ) => {
        const response = await fetch("/admin/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: username,
                email: email,
                password: password,
                confirmPassword: confirmPassword,
            }),
            credentials: "include",
        })
        const data = await response.json()
        return data
    }

    const login = async (email: string, password: string) => {
        const response = await fetch("/admin/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: email, password: password }),
            credentials: "include",
        })

        const data = await response.json()
        if (data.success === true) {
            setCurrentUser(data.user)
            return data
        }
        return data
    }

    const logout = async () => {
        let response
        if (currentUser?.role === "user") {
            response = await fetch("/user/logout", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            })
        } else {
            response = await fetch("/admin/logout", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            })
        }
        const data = await response.json()

        setCurrentUser(null)
        return data
    }

    const getCurrentUser = async () => {
        const res = await fetch("/sessiondetail", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        })
        const data = await res.json()
        const user = {
            username: data.username,
            email: data.email,
            role: data.role,
            userid: data.userId,
        }
        if (user.email) setCurrentUser(user)
        else
            setCurrentUser({
                email: "x",
                userid: "x",
                username: "x",
                role: "x",
            })
        return data
    }

    const forgotPassword = async (email: string) => {
        const res = await fetch("/forgotpassword", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: email,
            }),
        })
        const data = await res.json()
        return data
    }

    const value: Value = {
        currentUser,
        setCurrentUser,
        register,
        login,
        logout,
        getCurrentUser,
        forgotPassword,
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
