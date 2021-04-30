import React, { useState, useEffect, useRef } from "react"
import { Link, Redirect, useParams } from "react-router-dom"

import QuestionList from "../components/QuestionList"

import useFormState from "../hooks/useFormState"

import { useAuth } from "../context/AuthContext"

import "../styles/EditFormPage.css"

//TODO:
////MAKE UPDATE FORM ROUTE
////ADD THE FORM TITLE CHANGE EFFECT
//CHANGES THE DELETE FORM ROUTE TO DELETE THOSE QUESTION CORRESPOINDING TO FORM
////CHANGE THE DELETE FORM THING TO CALL USE EFFECT INSTEAD OF REFRESHING
//ERROR HANDLING IF YOU FEEL LIKE IT

const EditFormPage: React.FC = () => {
    const { formid }: any = useParams()

    const [form, setForm] = useState<any>()
    const [questions, setQuestions] = useState<any[]>()

    const [showEditTitle, setShowEditTitle] = useState<boolean>(false)

    const [title, handleTitle, resetTitle, setTitle] = useFormState("")

    const [colour, handleColour, resetColour, setColour] = useFormState(
        "#FFFFFF"
    )

    const inputRef = useRef<HTMLInputElement>(null)

    const value = useAuth()

    //?TO GET THE FORM
    useEffect(() => {
        if (value?.currentUser === null) value.getCurrentUser()
        fetch(`http://localhost:7000/api/getform/${formid}`)
            .then((resp: any) => {
                return resp.json()
            })

            .then((data: any) => {
                console.log(data)
                setForm(data)
                setTitle(data.title)
                setColour(data.color_theme)
            })
    }, [])

    //?TO GET THE QUESTIONS OF THAT FORM
    useEffect(() => {
        if (form) {
            fetch(`http://localhost:7000/api/getquestionsbyformid/${formid}`)
                .then((resp: any) => {
                    return resp.json()
                })
                .then((data: any) => {
                    console.log(data.ques)
                    setQuestions(data.ques)
                })
        }

        console.log(questions)
    }, [form])

    const handleSubmit = (event: React.FocusEvent<HTMLInputElement>) => {
        event.preventDefault()
        //UPDATING ON BACK END
        fetch("http://localhost:7000/api/updateform", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ ...form, title: title }),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("Success:", data)
                //UPDATING ON FRONT END
                setForm(data)
                setShowEditTitle(false)
            })
            .catch((error) => {
                console.error("Error:", error)
            })
    }

    const updateColour = () => {
        fetch("http://localhost:7000/api/updateform", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ ...form, color_theme: colour }),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data)
                setForm(data)
            })
            .catch((error) => {
                console.error("Error:", error)
            })
    }

    const handleTitleClick = () => {
        setShowEditTitle(true)
    }

    //SHOW AND HIDE EDIT FORM TITLE LOGIC
    useEffect(() => {
        if (showEditTitle) {
            if (null !== inputRef.current) inputRef.current.focus()
        }
    }, [showEditTitle])

    useEffect(updateColour, [colour])

    return form ? (
        value?.currentUser &&
        (value?.currentUser.role === "admin" ||
            value?.currentUser.role === "superadmin") ? (
            <div className="edit-form-page" style={{ backgroundColor: colour }}>
                <Link to="/">
                    <button>Back</button>
                </Link>
                {showEditTitle ? (
                    <input
                        onBlur={handleSubmit}
                        type="text"
                        value={title}
                        onChange={handleTitle}
                        ref={inputRef}
                    ></input>
                ) : (
                    <div onClick={handleTitleClick}>
                        <h1>{form.title}</h1>
                    </div>
                )}

                <h2>Colour theme: </h2>
                <input
                    type="color"
                    onChange={handleColour}
                    value={colour}
                ></input>
                <h3>{form.color_theme}</h3>

                <QuestionList questions={questions} formid={form._id} />
            </div>
        ) : (
            <Redirect to="/login" />
        )
    ) : (
        <div>loading</div>
    )
}

//!POSTMAN COPY-PASTE
// "formid": "5fb61c61ac3bc523cf528434",
// "question_type": "mcq-answer",
// "question_text": "Who is your favourite Rick?",
// "options": [{"text": "Rick Riordan"}, {"text": "Rick Sanchez"}, {"text": "Rick Astley"}]

export default EditFormPage
