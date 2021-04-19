import React, { useState, useContext, ReactElement } from "react";

export type Nullable<T> = T | null;

export interface IUser {
  username: string;
  role: string;
}

interface Props {
  children: ReactElement;
}

export interface Value {
  currentUser: Nullable<IUser>;
  setCurrentUser: any;
  register: (email: string, password: string) => Promise<any>;
  login: (email: string, password: string) => Promise<any>;
  logout: () => Promise<any>;
}

const AuthContext = React.createContext<Nullable<Value>>(null);

export const useAuth = () => {
  return useContext(AuthContext);
};

export default function AuthProvider({ children }: Props): ReactElement {
  const [currentUser, setCurrentUser] = useState<Nullable<IUser>>(null);

  const register = async (email: string, password: string) => {};

  const login = async (email: string, password: string) => {
    const response = await fetch("http://localhost:7000/admin/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email, password: password }),
      credentials: "include",
    });

    const data = await response.json();
    if (data.success === true) {
      setCurrentUser(data.user);
      return data;
    }
    return data;
    //   .then((response: any) => {
    //     console.log(response.cookies);
    //     return response.json();
    //   })
    //   //   .catch((e) => console.log(e))
    //   .then((data) => {
    //     console.log("Success:", data);
    //     console.log({ data });

    //     //UPDATING ON FRONT END
    //   })
    //   .catch((error) => {
    //     console.error("Error:", error);
    //   });
  };

  const logout = async () => {
    const response = await fetch("http://localhost:7000/admin/logout", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    const data = await response.json();

    setCurrentUser(null);

    return data;
  };

  const value: Value = {
    currentUser,
    setCurrentUser,
    register,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
