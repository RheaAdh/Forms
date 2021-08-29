import React, { useState, useContext, ReactElement } from "react"
import { get, post } from "../../utils/requests"
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

export interface IAuth {
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
    getCurrentUser: () => Promise<any>
}

const AuthContext = React.createContext<Nullable<IAuth>>(null)

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
        const data = await (
            await post("/api/admin/register", {
                username: username,
                email: email,
                password: password,
                confirmPassword: confirmPassword,
            })
        ).json()
        return data
    }

    const login = async (email: string, password: string) => {
        const data = await (
            await post("/api/admin/login", { email: email, password: password })
        ).json()
        if (data.success === true) {
            setCurrentUser(data.user)
            return data
        }
        return data
    }

    const logout = async () => {
        let data
        if (currentUser?.role === "user") {
            data = await (await get("/api/user/logout")).json()
        } else {
            data = await (await get("/api/admin/logout")).json()
        }
        setCurrentUser(null)
        return data
    }

    const getCurrentUser = async () => {
        const data = await (await get("/api/sessiondetail")).json()
        const user = {
            username: data.username,
            email: data.email,
            role: data.role,
            userid: data.userId,
        }
        if (user.email) setCurrentUser(user)
        else {
            setCurrentUser({
                username: "x",
                userid: "x",
                role: "x",
                email: "x",
            })
        }
        return data
    }

    const forgotPassword = async (email: string) => {
        const data = await (await post("/api/forgotpassword", { email })).json()
        return data
    }

    const value: IAuth = {
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
