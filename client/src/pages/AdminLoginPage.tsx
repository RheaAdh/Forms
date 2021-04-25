import React, { useEffect, useState } from "react";
import "../styles/Login.css";
import useFormState from "../hooks/useFormState";
import { useHistory, Redirect } from "react-router"
import { useAuth } from "../context/AuthContext";

const AdminLoginPage: React.FC = () => {
  const [email, handleEmail] = useFormState("");
  const [password, handlePassword] = useFormState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const value = useAuth();
  const history = useHistory()

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("This function runs");

    // value
    //   ?.login(email, password)
    //   .then((data: any) => {
    //     console.log("bruh");
    //     console.log({ data });
    //   })
    //   .catch((e) => console.log(e));
    
    const resp = await value?.login(email, password);
    console.log(resp)
    if(resp.success === true){
        history.push('/')
    }
    else{
      setErrorMessage(resp.data)
    }
    //UPDATING ON BACK END
    // fetch("http://localhost:7000/admin/login", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({ email: email, password: password }),
    //   credentials: "include",
    // })
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
      <form id="form" onSubmit={handleFormSubmit}>
        <h3>Login</h3>
        <div className="container">
          <span className="icon">
            <i className="fas fa-at"></i>
          </span>
          <input
            value={email}
            onChange={handleEmail}
            type="email"
            placeholder="email"
          />
        </div>
        <div className="container">
          <span className="icon">
            <i className="fas fa-lock"></i>
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
            <i className="fas fa-lock"></i>
          </span>
          <h4 className="error-message">
            {errorMessage}
          </h4>
        </div>
        <input type="submit" value="login" />
        
        <button style={{border : "none", color : "white", cursor : "pointer", background : "none"}}>
          Forgot password
        </button>
      </form>
    </div>
  );
};

export default AdminLoginPage;
