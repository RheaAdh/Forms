import React, { useState, useEffect } from "react"
import { questionTypes, useQuestionsList } from "../context/QuestionListContext"
import "../styles/Question.css"

interface props {
    question: any
    index: number
}
const Question: React.FC<props> = ({ question, index }) => {
    const questionActions = useQuestionsList()?.questionActions
    const questions = useQuestionsList()
    const [type, setType] = useState<any>(
        question ? questionTypes.indexOf(question["questionType"]) : 0
    )
    //CALL UPDATE QUESTION EVERY TIME QUESTIONS TITLE CHANGES
    useEffect(() => {
        questions?.questionActions?.updateQuestion(question.qid)
    }, [
        question.cols,
        question.highRating,
        question.highRatingLabel,
        question.lowRating,
        question.lowRatingLabel,
        question.options,
        question.questionText,
        question.questionType,
        question.required,
        question.rows,
    ])
    const types = [
        <div className="admin-question-container">
            <b>Short answer text</b>
        </div>,

        <div className="admin-question-container">
            <b>Paragraph text</b>
        </div>,

        <div className="admin-question-container">
            <b>Multiple choice</b>
            {question?.options?.map((a: string, i: number) => (
                <div className="option-container">
                    <input
                        key={i}
                        type="text"
                        onChange={(event) =>
                            questionActions?.updateOptions(
                                question.qid,
                                i,
                                event.target.value
                            )
                        }
                        defaultValue={a}
                    />
                    <button
                        onClick={() =>
                            questionActions?.deleteOption(question.qid, i)
                        }
                    >
                        <svg
                            className="delete-option-btn"
                            width="22"
                            height="29"
                            viewBox="0 0 22 29"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M1.57143 25.7778C1.57143 27.55 2.98571 29 4.71429 29H17.2857C19.0143 29 20.4286 27.55 20.4286 25.7778V6.44444H1.57143V25.7778ZM22 1.61111H16.5L14.9286 0H7.07143L5.5 1.61111H0V4.83333H22V1.61111Z"
                                fill="white"
                                fillOpacity="0.87"
                            />
                        </svg>
                    </button>
                </div>
            ))}

            <button onClick={() => questionActions?.addOptions(question.qid)}>
                Add option
            </button>
        </div>,

        <div className="admin-question-container">
            <b>Checkbox</b>
            {question?.options?.map((a: string, i: number) => (
                <div className="option-container">
                    <input
                        key={i}
                        type="text"
                        onChange={(event) =>
                            questionActions?.updateOptions(
                                question.qid,
                                i,
                                event.target.value
                            )
                        }
                        defaultValue={a}
                    />
                    <button
                        onClick={() =>
                            questionActions?.deleteOption(question.qid, i)
                        }
                    >
                        <svg
                            className="delete-option-btn"
                            width="22"
                            height="29"
                            viewBox="0 0 22 29"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M1.57143 25.7778C1.57143 27.55 2.98571 29 4.71429 29H17.2857C19.0143 29 20.4286 27.55 20.4286 25.7778V6.44444H1.57143V25.7778ZM22 1.61111H16.5L14.9286 0H7.07143L5.5 1.61111H0V4.83333H22V1.61111Z"
                                fill="white"
                                fillOpacity="0.87"
                            />
                        </svg>
                    </button>
                </div>
            ))}
            <button onClick={() => questionActions?.addOptions(question.qid)}>
                Add option
            </button>
        </div>,

        <div className="admin-question-container">
            <b>Dropdown</b>
            {question?.options?.map((a: string, i: number) => (
                <div className="option-container">
                    <input
                        key={i}
                        type="text"
                        onChange={(event) =>
                            questionActions?.updateOptions(
                                question.qid,
                                i,
                                event.target.value
                            )
                        }
                        defaultValue={a}
                    />
                    <button
                        onClick={() =>
                            questionActions?.deleteOption(question.qid, i)
                        }
                    >
                        <svg
                            className="delete-option-btn"
                            width="22"
                            height="29"
                            viewBox="0 0 22 29"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M1.57143 25.7778C1.57143 27.55 2.98571 29 4.71429 29H17.2857C19.0143 29 20.4286 27.55 20.4286 25.7778V6.44444H1.57143V25.7778ZM22 1.61111H16.5L14.9286 0H7.07143L5.5 1.61111H0V4.83333H22V1.61111Z"
                                fill="white"
                                fillOpacity="0.87"
                            />
                        </svg>
                    </button>
                </div>
            ))}
            <button onClick={() => questionActions?.addOptions(question.qid)}>
                Add option
            </button>
        </div>,

        <div className="admin-question-container">
            <b>Linear scale</b>
            <div className="select">
                <select
                    name="minVal"
                    onChange={(event) => {
                        questionActions?.setLowRating(
                            question.qid,
                            parseInt(event.target.value)
                        )
                    }}
                    defaultValue={question.lowRating}
                >
                    <option value="0">0</option>
                    <option value="1">1</option>
                </select>
                <span className="select-arrow"></span>
            </div>
            <span>to</span>
            <div className="select">
                <select
                    name="maxVal"
                    onChange={(event) => {
                        questionActions?.setHighRating(
                            question.qid,
                            parseInt(event.target.value)
                        )
                    }}
                    defaultValue={question.highRating}
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
            </div>
            <span className="select-arrow"></span>
            <input
                type="text"
                name=""
                placeholder="Label (Optional)"
                defaultValue={question.lowRatingLabel}
                onChange={(event) => {
                    questionActions?.setLowRatingLabel(
                        question.qid,
                        event.target.value
                    )
                }}
            />
            <input
                type="text"
                name=""
                placeholder="Label (Optional)"
                defaultValue={question.highRatingLabel}
                onChange={(event) => {
                    questionActions?.setHighRatingLabel(
                        question.qid,
                        event.target.value
                    )
                }}
            />
        </div>,

        <div className="admin-question-container">
            <b>Multiple choice grid</b>
            <p>Rows:</p>
            {question?.rows?.map((a: any, i: number) => (
                <input
                    key={i}
                    type="text"
                    onChange={(event) =>
                        questionActions?.updateRows(
                            question.qid,
                            i,
                            event.target.value
                        )
                    }
                    defaultValue={a}
                />
            ))}
            <button
                onClick={() => {
                    questionActions?.addRows(question.qid)
                }}
            >
                Add row
            </button>
            <p>Columns:</p>
            {question?.cols?.map((a: any, i: number) => (
                <input
                    key={i}
                    type="text"
                    onChange={(event) =>
                        questionActions?.updateCols(
                            question.qid,
                            i,
                            event.target.value
                        )
                    }
                    defaultValue={a}
                />
            ))}
            <button
                onClick={() => {
                    questionActions?.addCols(question.qid)
                }}
            >
                Add column
            </button>
        </div>,

        <div>
            <b>Checkbox grid</b>
            <p>Rows:</p>
            {question?.rows?.map((a: any, i: number) => (
                <input
                    key={i}
                    type="text"
                    onChange={(event) =>
                        questionActions?.updateRows(
                            question.qid,
                            i,
                            event.target.value
                        )
                    }
                    defaultValue={a}
                />
            ))}
            <button
                onClick={() => {
                    questionActions?.addRows(question.qid)
                }}
            >
                Add row
            </button>
            <p>Columns:</p>
            {question?.cols?.map((a: any, i: number) => (
                <input
                    key={i}
                    type="text"
                    onChange={(event) =>
                        questionActions?.updateCols(
                            question.qid,
                            i,
                            event.target.value
                        )
                    }
                    defaultValue={a}
                />
            ))}
            <button
                onClick={() => {
                    questionActions?.addCols(question.qid)
                }}
            >
                Add column
            </button>
        </div>,

        <div className="admin-question-container">
            <b>Email</b>
        </div>,

        <div className="admin-question-container">
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
    ]

    return (
        <div className="question-container">
            <div className="question-component-primary">
                <div className="question-component-primary-row1">
                    <input
                        className="question-text-editable"
                        type="text"
                        onChange={(e) => {
                            questionActions?.setQuestionText(
                                question.qid,
                                e.target.value
                            )
                            console.log(questions?.questions)
                        }}
                        defaultValue={question?.questionText}
                    />
                    <div className="select">
                        <select
                            onChange={(e) => {
                                let selectedType: number = parseInt(
                                    e.target.value
                                )
                                setType(selectedType)
                                questions?.questionActions.updateType(
                                    question.qid,
                                    questionTypes[selectedType]
                                )
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
                        </select>
                        <span className="select-arrow"></span>
                    </div>
                </div>
                <div className="question-component-primary-row2">
                    {types[type]}
                </div>
                <div className="question-component-primary-row3">
                    <div className="required-checkbox radio-checkbox">
                        {question.required ? (
                            <input
                                type="checkbox"
                                id="required-checkbox"
                                defaultChecked
                            ></input>
                        ) : (
                            <input
                                type="checkbox"
                                id="required-checkbox"
                            ></input>
                        )}
                        <span className="styled-radio-checkbox"></span>
                        <label htmlFor="required-checkbox">Required</label>
                    </div>

                    <button
                        className="question-delete-btn"
                        onClick={() => {
                            questionActions?.deleteQuestion(question.qid)
                        }}
                    >
                        {
                            //delete btn
                        }
                        <svg
                            width="22"
                            height="29"
                            viewBox="0 0 22 29"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M1.57143 25.7778C1.57143 27.55 2.98571 29 4.71429 29H17.2857C19.0143 29 20.4286 27.55 20.4286 25.7778V6.44444H1.57143V25.7778ZM22 1.61111H16.5L14.9286 0H7.07143L5.5 1.61111H0V4.83333H22V1.61111Z"
                                fill="white"
                                fillOpacity="0.87"
                            />
                        </svg>
                    </button>
                </div>
            </div>
            <div className="question-component-secondary"></div>
        </div>
    )
}

export default Question
