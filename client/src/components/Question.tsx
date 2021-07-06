import React, { useState, useEffect } from "react"
import {
    Option,
    questionTypes,
    useQuestionsList,
} from "../context/QuestionListContext"
import "../styles/Question.css"
import { ReactComponent as DeleteIcon } from "../images/DeleteIcon.svg"
import { ReactComponent as DropdownArrow } from "../images/DropdownArrow.svg"
import { ReactComponent as AddQuestionIcon } from "../images/AddQuestionIcon.svg"

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
            <div>
                <b>Multiple choice</b>
                {question?.options?.map((a: Option, i: number) => (
                    <div className="option-container" key={a.key}>
                        <input
                            type="text"
                            onChange={(event) =>
                                questionActions?.updateOptions(
                                    question.qid,
                                    i,
                                    {
                                        text: event.target.value,
                                        key: a.key,
                                    }
                                )
                            }
                            value={a.text}
                        />
                        <button
                            onClick={() =>
                                questionActions?.deleteOption(question.qid, i)
                            }
                        >
                            <DeleteIcon className="delete-option-btn" />
                        </button>
                    </div>
                ))}

                <button
                    className="add-option-btn"
                    onClick={() => questionActions?.addOptions(question.qid)}
                >
                    {" "}
                    Add Option{" "}
                </button>
            </div>
        </div>,

        <div className="admin-question-container">
            <b>Checkbox</b>
            {question?.options?.map((a: Option, i: number) => (
                <div className="option-container" key={a.key}>
                    <input
                        type="text"
                        onChange={(event) =>
                            questionActions?.updateOptions(question.qid, i, {
                                text: event.target.value,
                                key: a.key,
                            })
                        }
                        value={a.text}
                    />
                    <button
                        onClick={() =>
                            questionActions?.deleteOption(question.qid, i)
                        }
                    >
                        <DeleteIcon className="delete-option-btn" />
                    </button>
                </div>
            ))}
            <button
                className="add-option-btn"
                onClick={() => questionActions?.addOptions(question.qid)}
            >
                Add option
            </button>
        </div>,

        <div className="admin-question-container">
            <b>Dropdown</b>
            {question?.options?.map((a: Option, i: number) => (
                <div className="option-container" key={a.key}>
                    <input
                        type="text"
                        onChange={(event) =>
                            questionActions?.updateOptions(question.qid, i, {
                                text: event.target.value,
                                key: a.key,
                            })
                        }
                        value={a.text}
                    />
                    <button
                        onClick={() =>
                            questionActions?.deleteOption(question.qid, i)
                        }
                    >
                        <DeleteIcon className="delete-option-btn" />
                    </button>
                </div>
            ))}
            <button
                className="add-option-btn"
                onClick={() => questionActions?.addOptions(question.qid)}
            >
                Add option
            </button>
        </div>,

        <div className="admin-question-container">
            <b>Linear scale</b>
            <div className="linear-scale-flexbox">
                <div className="select">
                    <select
                        name="minVal"
                        onChange={(event) => {
                            event.persist()
                            questionActions?.setLowRating(
                                question.qid,
                                parseInt(event.target.value)
                            )
                        }}
                        value={question.lowRating}
                    >
                        <option value="0">0</option>
                        <option value="1">1</option>
                    </select>
                    <span className="select-arrow">
                        <DropdownArrow />
                    </span>
                </div>
                <span>to</span>
                <div className="select">
                    <select
                        name="maxVal"
                        onChange={(event) => {
                            event.persist()
                            questionActions?.setHighRating(
                                question.qid,
                                parseInt(event.target.value)
                            )
                        }}
                        value={question.highRating}
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
                    <span className="select-arrow">
                        <DropdownArrow />
                    </span>
                </div>
            </div>
            <input
                type="text"
                name=""
                placeholder="Low Rating Label (Optional)"
                value={question.lowRatingLabel}
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
                placeholder="High Rating Label (Optional)"
                value={question.highRatingLabel}
                onChange={(event) => {
                    questionActions?.setHighRatingLabel(
                        question.qid,
                        event.target.value
                    )
                }}
            />
        </div>,

        <div className="admin-question-container">
            <div>
                <b>Multiple choice grid</b>
            </div>
            <div className="grid-container">
                <div>
                    <p>Rows:</p>
                    {question?.rows?.map((a: Option, i: number) => (
                        <div className="option-container" key={a.key}>
                            <input
                                type="text"
                                onChange={(event) =>
                                    questionActions?.updateRows(
                                        question.qid,
                                        i,
                                        {
                                            text: event.target.value,
                                            key: a.key,
                                        }
                                    )
                                }
                                value={a.text}
                            />
                            <button
                                onClick={() =>
                                    questionActions?.deleteRow(question.qid, i)
                                }
                            >
                                <DeleteIcon className="delete-option-btn" />
                            </button>
                        </div>
                    ))}
                    <button
                        className="add-option-btn"
                        onClick={() => {
                            questionActions?.addRows(question.qid)
                        }}
                    >
                        Add row
                    </button>
                </div>
                <div>
                    <p>Columns:</p>
                    {question?.cols?.map((a: Option, i: number) => (
                        <div className="option-container" key={a.key}>
                            <input
                                type="text"
                                onChange={(event) =>
                                    questionActions?.updateCols(
                                        question.qid,
                                        i,
                                        {
                                            text: event.target.value,
                                            key: a.key,
                                        }
                                    )
                                }
                                value={a.text}
                            />
                            <button
                                onClick={() =>
                                    questionActions?.deleteCol(question.qid, i)
                                }
                            >
                                <DeleteIcon className="delete-option-btn" />
                            </button>
                        </div>
                    ))}
                    <button
                        className="add-option-btn"
                        onClick={() => {
                            questionActions?.addCols(question.qid)
                        }}
                    >
                        Add column
                    </button>
                </div>
            </div>
        </div>,

        <div className="admin-question-container">
            <b>Checkbox grid</b>
            <div className="grid-container">
                <div>
                    <p>Rows:</p>
                    {question?.rows?.map((a: Option, i: number) => (
                        <div className="option-container" key={a.key}>
                            <input
                                type="text"
                                onChange={(event) =>
                                    questionActions?.updateRows(
                                        question.qid,
                                        i,
                                        {
                                            text: event.target.value,
                                            key: a.key,
                                        }
                                    )
                                }
                                value={a.text}
                            />
                            <button
                                onClick={() =>
                                    questionActions?.deleteRow(question.qid, i)
                                }
                            >
                                <DeleteIcon className="delete-option-btn" />
                            </button>
                        </div>
                    ))}
                    <button
                        className="add-option-btn"
                        onClick={() => {
                            questionActions?.addRows(question.qid)
                        }}
                    >
                        Add row
                    </button>
                </div>
                <div>
                    <p>Columns:</p>
                    {question?.cols?.map((a: Option, i: number) => (
                        <div className="option-container" key={a.key}>
                            <input
                                type="text"
                                onChange={(event) =>
                                    questionActions?.updateCols(
                                        question.qid,
                                        i,
                                        {
                                            text: event.target.value,
                                            key: a.key,
                                        }
                                    )
                                }
                                value={a.text}
                            />
                            <button
                                onClick={() =>
                                    questionActions?.deleteCol(question.qid, i)
                                }
                            >
                                <DeleteIcon className="delete-option-btn" />
                            </button>
                        </div>
                    ))}
                    <button
                        className="add-option-btn"
                        onClick={() => {
                            questionActions?.addCols(question.qid)
                        }}
                    >
                        Add column
                    </button>
                </div>
            </div>
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
                        }}
                        value={question?.questionText}
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
                        <span className="select-arrow">
                            <DropdownArrow />
                        </span>
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
                                id={question.qid}
                                defaultChecked
                                onChange={(e) =>
                                    questionActions?.setRequired(
                                        question.qid,
                                        e.target.checked
                                    )
                                }
                            ></input>
                        ) : (
                            <input
                                type="checkbox"
                                id={question.qid}
                                onChange={(e) =>
                                    questionActions?.setRequired(
                                        question.qid,
                                        e.target.checked
                                    )
                                }
                            ></input>
                        )}
                        <span className="styled-radio-checkbox"></span>
                        <label htmlFor={question.qid}>Required</label>
                    </div>

                    <button
                        onClick={() => {
                            console.log(question.qid)
                            questionActions?.deleteQuestion(question.qid)
                        }}
                    >
                        <DeleteIcon />
                        <span className="icon-info">Delete Question</span>
                        <span className="text-info-arrow" />
                    </button>
                    <button
                        onClick={() => {
                            questionActions?.addQuestion(index)
                        }}
                    >
                        <AddQuestionIcon />
                        <span className="icon-info">New Question</span>
                        <span className="text-info-arrow" />
                    </button>
                </div>
            </div>
            <div className="question-component-secondary"></div>
        </div>
    )
}

export default Question
