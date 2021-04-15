import React, { useEffect, useState } from "react";
import "../styles/DashboardPage.css"
import FormsPage from "./FormsPage"

const DashboardPage : React.FC = () =>{
    const [current, setCurrent] = useState<string>("forms")
    const handleChange = (e:any) =>{
       let element = document.getElementById(current)
       element?.setAttribute("style", "color : balck;")
       e.target.style.color = "red"
       setCurrent(e.target.id)
    }
    return (
        <div className="dashboard">
            <div className="sidebar">
                <p className="btn" id="forms" style={{color : "red"}} onClick={e => handleChange(e)}>
                Forms
                </p>
                <p className="btn" id="responses" onClick={e => handleChange(e)} >
                Responses
                </p>
                <p className="btn" id="users" onClick={e => handleChange(e)}>
                Users
                </p>
            </div>
            <div className="main-column">
              {
                current === "forms" ? 
                <FormsPage/>
                :
                current === "responses" ? 
                <h3>Nothing to see here</h3>
                :
                <h3>Nothing to see here</h3>
              }
                
            </div>
        </div>
    )
}

export default DashboardPage