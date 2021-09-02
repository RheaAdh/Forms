import React, { useState, useEffect } from "react"
import {
    Option,
    questionTypes,
    useQuestionsList,
} from "../../context/questions/QuestionListContext"
import "../../styles/Question.css"
import { ReactComponent as DeleteIcon } from "../../images/DeleteIcon.svg"
import { ReactComponent as DropdownArrow } from "../../images/DropdownArrow.svg"
import { ReactComponent as AddQuestionIcon } from "../../images/AddQuestionIcon.svg"
import { ReactComponent as NewPageIcon } from "../../images/NewPageIcon.svg"
import autoAdjustHeight from "../../utils/util"
import { useCurrentForm } from "../../context/form/CurrentFormContext"
import useScrollDown from "../../hooks/useScrollDown"

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
    const form = useCurrentForm()
    const setNewQuestionIndex = useScrollDown()

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
        question.description,
    ])

    const types = [
        <div className="admin-question-container text-only">
            <p>Short answer text</p>
        </div>,

        <div className="admin-question-container text-only">
            <p>Paragraph text</p>
        </div>,

        <div className="admin-question-container">
            <p>Multiple choice</p>
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
                {" "}
                Add Option{" "}
            </button>
        </div>,

        <div className="admin-question-container">
            <p>Checkbox</p>
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
            <p>Dropdown</p>
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
            <p>Linear scale</p>
            <div className="linear-scale-flexbox">
                <div className="linear-scale-flexbox-item">
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
                </div>
                <div className="linear-scale-flexbox-item">
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
                </div>
            </div>
        </div>,

        <div className="admin-question-container">
            <p>Multiple choice grid</p>
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
            <p>Checkbox grid</p>
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

        <div className="admin-question-container text-only">
            <p>Email</p>
        </div>,

        <div className="text-type admin-question-container">
            <textarea
                placeholder="Description(optional)"
                onChange={(e) => {
                    autoAdjustHeight(e)
                    questionActions?.setDescription(
                        question.qid,
                        e.target.value
                    )
                }}
                defaultValue={question.description}
            ></textarea>
        </div>,
    ]

    return (
        <div className="question-container" id={question.qid}>
            <div className="question-component-primary">
                <div className="question-component-primary-row1">
                    <input
                        className="question-text-editable"
                        type="text"
                        placeholder={
                            question.questionType === "page-header"
                                ? "Title(optional)"
                                : ""
                        }
                        onChange={(e) => {
                            questionActions?.setQuestionText(
                                question.qid,
                                e.target.value
                            )
                        }}
                        value={
                            question.type === "page-header"
                                ? null
                                : question?.questionText
                        }
                    />
                    {question.questionType !== "page-header" && (
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
                            </select>
                            <span className="select-arrow">
                                <DropdownArrow />
                            </span>
                        </div>
                    )}
                </div>
                <div
                    className={`${
                        question.questionType === "page-header"
                            ? ""
                            : "question-component-primary-row2"
                    }`}
                >
                    {question.questionType === "page-header"
                        ? types[9]
                        : types[type]}
                </div>
                <div className="question-component-primary-row3">
                    {
                        // Required check box has to be removed if it's page-header
                    }
                    {question.questionType !== "page-header" && (
                        <div className="required-checkbox radio-checkbox">
                            <label htmlFor={question.qid}>Required</label>

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

                            <span className="styled-checkbox"></span>
                            <span className="checkbox-tick"></span>
                        </div>
                    )}
                    <button
                        onClick={() => {
                            questionActions?.deleteQuestion(question.qid)
                            if (question.questionType === "page-header") {
                                form?.setPages((pg) => {
                                    if (pg) {
                                        return pg - 1
                                    }
                                })
                            }
                        }}
                    >
                        <DeleteIcon />
                        <span className="icon-info">Delete Question</span>
                        <span className="text-info-arrow" />
                    </button>
                    <button
                        onClick={async () => {
                            questionActions?.addQuestion(
                                index,
                                question.pageNo,
                                false
                            )
                            setNewQuestionIndex(index + 1)
                        }}
                    >
                        <AddQuestionIcon />
                        <span className="icon-info">New Question</span>
                        <span className="text-info-arrow" />
                    </button>
                    <button
                        onClick={async () => {
                            questionActions?.addQuestion(
                                index,
                                question.pageNo + 1,
                                true
                            )
                            form?.setPages((pg) => {
                                if (pg) {
                                    return pg + 1
                                }
                            })
                            setNewQuestionIndex(-1)
                        }}
                    >
                        <NewPageIcon />
                        <span className="icon-info">New Page</span>
                        <span className="text-info-arrow" />
                    </button>
                </div>
            </div>
            <div className="question-component-secondary"></div>
        </div>
    )
}

export default Question
