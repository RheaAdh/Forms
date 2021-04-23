import React, { useEffect, useState } from "react";
import "../styles/Login.css";
import useFormState from "../hooks/useFormState";
import { useHistory, Redirect } from "react-router"
import { useAuth } from "../context/AuthContext";

const LoginPage: React.FC = () => {
  
  const value = useAuth();
  const history = useHistory()

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("This function runs");

  };

  const handleClick = (e:React.MouseEventHandler<HTMLButtonElement>) =>{
        // fetch("http://localhost:7000/auth/google")
  }

  useEffect(
    () => {
      if(value?.currentUser === null)
          value.getCurrentUser()
    },
    []
  )
  
  return ( value?.currentUser ?
    <Redirect to="/"/>
    :
    <div className="form-container">
      <form id="form" >
        <h3>Login</h3>
        <div className="container">
            <button
            style={{padding : "10px", borderRadius : "15px", background : "red", color : "white",
                    cursor : "pointer", width : "auto", border : "none"
            }}>
              <a href="http://localhost:7000/user/auth/google" style={{textDecoration : "none", color : "white"}}>
                Login With Google
              </a>
            </button>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
