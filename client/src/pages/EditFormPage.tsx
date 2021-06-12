import React, { useState, useEffect, useRef, useMemo } from "react"
import { Link, Redirect, useParams } from "react-router-dom"

import QuestionList from "../components/QuestionList"

import useFormState from "../hooks/useFormState"

import { useAuth } from "../context/AuthContext"

import DatePicker from "react-datepicker"

import "react-datepicker/dist/react-datepicker.css"

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

    const [questions, setQuestions] = useState<any[]>([])

    const [showEditTitle, setShowEditTitle] = useState<boolean>(false)

    // date and time stored in db format, not input element format
    const [date, setDate] = useState<Date>(new Date())

    const [title, handleTitle, resetTitle, setTitle] = useFormState("")

    const [loading, setLoading] = useState<boolean>(true)

    const [colour, handleColour, resetColour, setColour] = useFormState(
        "#FFFFFF"
    )

    const [desc, handleDesc, resetDesc, setDesc] = useFormState("")

    const [edit, setEdit] = useState(false)

    const [multi, setMulti] = useState(false)

    const inputRef = useRef<HTMLInputElement>(null)

    const auth = useAuth()

    useEffect(() => {
        auth?.getCurrentUser().then((res: any) => {
            setLoading(false)
        })
    }, [])
    //?TO GET THE FORM
    useEffect(() => {
        fetch(`http://localhost:7000/api/getform/${formid}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        })
            .then((resp: any) => {
                return resp.json()
            })

            .then((data: any) => {
                if (data.success) {
                    setForm(data.form)
                    setTitle(data.form.title)
                    setColour(data.form.color_theme)
                    setDesc(data.form.description)
                    setEdit(data.form.isEditable)
                    setMulti(data.form.multipleResponses)
                    if (data.form.closes) {
                        setDate(new Date(data.form.closes))
                    }
                } else {
                    console.log("failed to fetch form")
                }
            })
    }, [])

    //?TO GET THE QUESTIONS OF THAT FORM

    //SHOW AND HIDE EDIT FORM TITLE LOGIC
    useEffect(() => {
        if (showEditTitle) {
            if (null !== inputRef.current) inputRef.current.focus()
        }
    }, [showEditTitle])

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

    const updateForm = () => {
        fetch("http://localhost:7000/api/updateform", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
                ...form,
                color_theme: colour,
                description: desc,
                isEditable: edit,
                multipleResponses: multi,
                closes: date,
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                setForm(data)
            })
            .catch((error) => {
                console.error("Error:", error)
            })
    }

    useEffect(updateForm, [colour, desc, edit, multi, date])

    const handleTitleClick = () => {
        setShowEditTitle(true)
    }

    if (loading) {
        return <div>Loading</div>
    }
    //console.log(form?.closes)
    return form ? (
        auth?.currentUser &&
        (auth?.currentUser.role === "admin" ||
            auth?.currentUser.role === "superadmin") ? (
            <div className="edit-form-page" style={{ backgroundColor: colour }}>
                <Link to="/">
                    <button>Back</button>
                </Link>
                {showEditTitle ? (
                    <input
                        onBlur={handleSubmit}
                        type="text"
                        defaultValue={title}
                        onChange={handleTitle}
                        ref={inputRef}
                    ></input>
                ) : (
                    <div onClick={handleTitleClick}>
                        <h1>{form.title}</h1>
                    </div>
                )}
                <h3>Description:</h3>
                <textarea
                    value={desc}
                    onChange={handleDesc}
                    rows={5}
                    cols={80}
                    className="description"
                ></textarea>

                <h4>Closing date :</h4>
                <DatePicker
                    selected={date}
                    showTimeSelect
                    dateFormat="MMMM d, yyyy h:mm aa"
                    onChange={(date: Date) => {
                        setDate(date)
                        console.log(date)
                    }}
                />
                <h3>Colour theme: </h3>
                <input
                    type="color"
                    onChange={handleColour}
                    value={colour}
                ></input>
                <h3>{form.color_theme}</h3>
                <h4>
                    <input
                        type="checkbox"
                        checked={edit}
                        onChange={(e) => {
                            const editVal = e.target.checked
                            setEdit(editVal)
                            if(editVal)
                            {
                                setMulti(false)
                            }
                        }}
                    ></input>
                    Editable
                    <input
                        type="checkbox"
                        checked={multi}
                        onChange={(e) => {
                            const multiVal = e.target.checked
                            setMulti(multiVal)
                            if(multiVal)
                            {
                                setEdit(false)
                            }
                        }}
                    ></input>
                    Multiple responses
                </h4>
                <h2>Questions:</h2>
                <QuestionList formid={form._id} />
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
