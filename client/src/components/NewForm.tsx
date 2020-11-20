import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const NewForm = () => {
  const addForm = () => {
    const form = { title: "A lot of forms will have the same title now" };

    fetch("http://localhost:7000/api/addForm", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return <Link to="/newform" ><button onClick={addForm}>Add New Form</button></ Link>
};

export default NewForm;
