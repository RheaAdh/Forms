import React from "react";
import QuestionList from "../components/QuestionList";
import { Link } from "react-router-dom";

const NewFormPage = () => {
    return(
        <div>
            <Link to="/"><button>Back</button></Link>
            <QuestionList/>
        </div>
    )
}

export default NewFormPage;