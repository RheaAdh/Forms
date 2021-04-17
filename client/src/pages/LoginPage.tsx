import React from "react";
import "../styles/Login.css";
import useFormState from "../hooks/useFormState";
import { AnyARecord } from "dns";

const LoginPage: React.FC = () => {
  const [email, handleEmail] = useFormState("");
  const [password, handlePassword] = useFormState("");

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    //UPDATING ON BACK END
    fetch("http://localhost:7000/admin/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email, password: password }),
      credentials: "include",
    })
      .then((response: any) => {
        console.log(response.cookies);
        return response.json();
      })
      //   .catch((e) => console.log(e))
      .then((data) => {
        console.log("Success:", data);
        console.log({ data });

        //UPDATING ON FRONT END
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };
  return (
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
        <input type="submit" value="login" />
      </form>
    </div>
  );
};

export default LoginPage;
