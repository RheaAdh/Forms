import React, { useState, useEffect } from "react"

import useFormState from "../hooks/useFormState"

import "../styles/Questions.css"
interface props {
    question: any
    deleteQuestion?: any
    index: number
}
const Question: React.FC<props> = ({ question, deleteQuestion, index }) => {
    const questions_types = [
        "short-answer",
        "paragraph-answer",
        "mcq-answer",
        "checkbox-answer",
        "dropdown-answer",
        "linearscale-answer",
        "multiplechoicegrid-answer",
        "checkboxgrid-answer",
        "email-answer",
        "file-upload",
        "date-answer",
        "time-answer",
    ]
    const [type, setType] = useState<any>(
        question ? questions_types.indexOf(question["question-type"]) : 0
    )
    const [requiredVal, setRequired] = useState(
        question ? question.required : false
    )
    const [questionText, handleQuestionText] = useFormState(
        question ? question.question_text : ""
    )

    //Works up to linear scale
    const [options, setOptions] = useState(
        question.options !== undefined ? question.options : [""]
    )
    const [rows, setRows] = useState(
        question.rowLabel !== undefined ? question.rowLabel : [""]
    )
    const [cols, setCols] = useState(
        question.colLabel !== undefined ? question.colLabel : [""]
    )
    const [lowRating, setLowRating] = useState<number>(
        question.lowRating !== undefined ? question.lowRating : 0
    )
    const [highRating, setHighRating] = useState<number>(
        question.highRating !== undefined ? question.highRating : 2
    )
    const [lowRatingLabel, setLowRatingLabel] = useState<string>(
        question.lowRatingLabel !== undefined ? question.lowRatingLabel : ""
    )
    const [highRatingLabel, setHighRatingLabel] = useState<string>(
        question.highRatingLabel !== undefined ? question.highRatingLabel : ""
    )
    const addOptions = () => {
        setOptions(() => [...options, ""])
    }

    const updateOptions = (
        i: any,
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        let opt = options
        opt[i] = event.target.value
        setOptions(opt)
        updateQuestion()
    }

    const addRows = () => {
        setRows(() => [...rows, ""])
    }

    const addCols = () => {
        setCols(() => [...cols, ""])
    }

    const updateRows = (
        i: number,
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        let r = rows
        r[i] = event.target.value
        setRows(r)
        updateQuestion()
    }

    const updateCols = (
        i: number,
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        let c = cols
        c[i] = event.target.value
        setCols(c)
        updateQuestion()
    }
    //

    const updateQuestion = () => {
        let body = null
        if (options.length >= 2) {
            body = JSON.stringify({
                ...question,
                question_text: questionText,
                required: requiredVal,
                options: options,
                lowRating: lowRating,
                highRating: highRating,
                lowRatingLabel: lowRatingLabel,
                highRatingLabel: highRatingLabel,
                "question-type": questions_types[type],
            })
        } else {
            body = JSON.stringify({
                ...question,
                question_text: questionText,
                required: requiredVal,
                lowRating: lowRating,
                highRating: highRating,
                lowRatingLabel: lowRatingLabel,
                highRatingLabel: highRatingLabel,
                "question-type": questions_types[type],
            })
        }
        if (rows.length >= 2 && cols.length >= 2) {
            body = JSON.stringify({
                ...question,
                question_text: questionText,
                required: requiredVal,
                rowLabel: rows,
                colLabel: cols,
                lowRating: lowRating,
                highRating: highRating,
                lowRatingLabel: lowRatingLabel,
                highRatingLabel: highRatingLabel,
                "question-type": questions_types[type],
            })
        }
        fetch("http://localhost:7000/api/updatequestion", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: body,
        })
            .then((response) => response.json())
            .then((data) => null)
    }

    const handleClick = () => {
        fetch("http://localhost:7000/api/deletequestion", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
                id: question._id,
                formid: question.formid,
            }),
        })
            .then((res: any) => res.json())
            .then((data) => {
                if (data.success) {
                    deleteQuestion(index)
                    console.log(question._id)
                } else {
                    console.log("Something went wrong")
                }
            })
            .catch((err) => {
                console.log(err)
            })
    }

    //CALL UPDATE QUESTION EVERY TIME QUESTIONS TITLE CHANGES
    useEffect(updateQuestion, [
        questionText,
        requiredVal,
        type,
        lowRating,
        highRating,
        lowRatingLabel,
        highRatingLabel,
    ])
    const types = [
        <div>
            <b>Short answer text</b>
        </div>,

        <div>
            <b>Paragraph text</b>
        </div>,

        <div>
            <b>Multiple choice</b>
            <ol>
                {options.map((a: string, i: number) => (
                    <li key={i}>
                        <input
                            type="text"
                            onChange={(event) => updateOptions(i, event)}
                            defaultValue={a}
                        />
                    </li>
                ))}
            </ol>
            <button onClick={addOptions}>Add option</button>
        </div>,

        <div>
            <b>Checkbox</b>
            <ol>
                {options.map((a: string, i: number) => (
                    <li key={i}>
                        <input
                            type="text"
                            onChange={(event) => updateOptions(i, event)}
                            defaultValue={a}
                        />
                    </li>
                ))}
            </ol>
            <button onClick={addOptions}>Add option</button>
        </div>,

        <div>
            <b>Dropdown</b>
            <ol>
                {options.map((a: string, i: number) => (
                    <li key={i}>
                        <input
                            type="text"
                            onChange={(event) => updateOptions(i, event)}
                            defaultValue={a}
                        />
                    </li>
                ))}
            </ol>
            <button onClick={addOptions}>Add option</button>
        </div>,

        <div>
            <b>Linear scale</b>
            <table cellSpacing="10">
                <tr>
                    <td>
                        <select
                            name="minVal"
                            onChange={(event) => {
                                setLowRating(parseInt(event.target.value))
                            }}
                            defaultValue={lowRating}
                        >
                            <option value="0">0</option>
                            <option value="1">1</option>
                        </select>
                    </td>
                    <td>to</td>
                    <td>
                        <select
                            name="maxVal"
                            onChange={(event) => {
                                setHighRating(parseInt(event.target.value))
                            }}
                            defaultValue={highRating}
                        >
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                            <option value="7">7</option>
                            <option value="8">8</option>
                            <option value="9">9</option>
                            <option value="10">10</option>
                        </select>
                    </td>
                </tr>
            </table>
            <br />
            <br />
            <input
                type="text"
                name=""
                placeholder="Label (Optional)"
                defaultValue={lowRatingLabel}
                onChange={(event) => {
                    setLowRatingLabel(event.target.value)
                }}
            />
            <br />
            <br />
            <input
                type="text"
                name=""
                placeholder="Label (Optional)"
                defaultValue={highRatingLabel}
                onChange={(event) => {
                    setHighRatingLabel(event.target.value)
                }}
            />
        </div>,

        <div>
            <b>Multiple choice grid</b>
            <p>Rows:</p>
            <ol>
                {rows.map((a: any, i: number) => (
                    <li key={i}>
                        <input
                            type="text"
                            onChange={(event) => updateRows(i, event)}
                            defaultValue={a}
                        />
                    </li>
                ))}
            </ol>
            <button onClick={addRows}>Add row</button>
            <p>Columns:</p>
            <ol>
                {cols.map((a: any, i: number) => (
                    <li key={i}>
                        <input
                            type="text"
                            onChange={(event) => updateCols(i, event)}
                            defaultValue={a}
                        />
                    </li>
                ))}
            </ol>
            <button onClick={addCols}>Add column</button>
        </div>,

        <div>
            <b>Checkbox grid</b>
            <p>Rows:</p>
            <ol>
                {rows.map((a: any, i: number) => (
                    <li key={i}>
                        <input
                            type="text"
                            onChange={(event) => updateRows(i, event)}
                            defaultValue={a}
                        />
                    </li>
                ))}
            </ol>
            <button onClick={addRows}>Add row</button>
            <p>Columns:</p>
            <ol>
                {cols.map((a: any, i: number) => (
                    <li key={i}>
                        <input
                            type="text"
                            onChange={(event) => updateCols(i, event)}
                            defaultValue={a}
                        />
                    </li>
                ))}
            </ol>
            <button onClick={addCols}>Add column</button>
        </div>,

        <div>
            <b>Email</b>
        </div>,

        <div>
            <b>File upload</b>
            <table cellSpacing="20">
                <tr>
                    <td>Allow only specific file types</td>
                    <td>
                        <label className="switch">
                            <input type="checkbox" />
                            <span className="slider round"></span>
                        </label>
                    </td>
                </tr>
                <tr>
                    <td>Maximum number of files</td>
                    <td>
                        <select name="maxNum">
                            <option value="1">1</option>
                            <option value="5">5</option>
                            <option value="10">10</option>
                        </select>
                    </td>
                </tr>
                <tr>
                    <td>Maximum file size</td>
                    <td>
                        <select name="maxSize">
                            <option value="1MB">1 MB</option>
                            <option value="10MB">10 MB</option>
                            <option value="100MB">100 MB</option>
                            <option value="1GB">1 GB</option>
                            <option value="10GB">10 GB</option>
                        </select>
                    </td>
                </tr>
            </table>
        </div>,

        <div>
            <b>Date [dd:mm:yy]</b>
        </div>,

        <div>
            <b>Time [hh:mm]</b>
        </div>,
    ]

    return (
        <div className="question-component">
            <div className="question-meta">
                {/*<span>Question:</span>*/}
                <input
                    className="question-text"
                    type="text"
                    onChange={handleQuestionText}
                    value={questionText}
                />

                {/*This is only for testing, you can remove it*/}
                {requiredVal ? "*" : ""}

                {/*<span>Type:</span>*/}
                <select
                    className="question-select"
                    onChange={(e) => {
                        let selectedType: number = parseInt(e.target.value)
                        setType(selectedType)
                    }}
                    value={type}
                >
                    <option value={0}>Short text</option>
                    <option value={1}>Paragraph</option>
                    <option value={2}>Multiple choice</option>
                    <option value={3}>Checkbox</option>
                    <option value={4}>Dropdown</option>
                    <option value={5}>Linear scale</option>
                    <option value={6}>Multiple choice grid</option>
                    <option value={7}>Checkbox grid</option>
                    <option value={8}>Email</option>
                    <option value={9}>File upload</option>
                    <option value={10}>Date</option>
                    <option value={11}>Time</option>
                </select>
            </div>

            <div className="required">
                <input
                    type="checkbox"
                    checked={requiredVal}
                    onChange={(e) => {
                        const reqVal = e.target.checked
                        setRequired(reqVal)
                    }}
                />
                <span>Required</span>
            </div>

            {types[type]}
            <button onClick={handleClick}>Delete Question</button>
        </div>
    )
}

export default Question
