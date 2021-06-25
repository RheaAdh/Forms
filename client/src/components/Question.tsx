import React, { useState, useEffect } from "react"
import { useCurrentForm } from "../context/CurrentFormContext"
import { questionTypes, useQuestionsList } from "../context/QuestionListContext"

import "../styles/Questions.css"
interface props {
    question: any
    index: number
}
const Question: React.FC<props> = ({ question, index }) => {
    const form = useCurrentForm()
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
        <div>
            <b>Short answer text</b>
        </div>,

        <div>
            <b>Paragraph text</b>
        </div>,

        <div>
            <b>Multiple choice</b>
            <ol>
                {question?.options?.map((a: string, i: number) => (
                    <li key={i}>
                        <input
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
                    </li>
                ))}
            </ol>
            <button onClick={() => questionActions?.addOptions(question.qid)}>
                Add option
            </button>
        </div>,

        <div>
            <b>Checkbox</b>
            <ol>
                {question?.options?.map((a: string, i: number) => (
                    <li key={i}>
                        <input
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
                    </li>
                ))}
            </ol>
            <button onClick={() => questionActions?.addOptions(question.qid)}>
                Add option
            </button>
        </div>,

        <div>
            <b>Dropdown</b>
            <ol>
                {question?.options?.map((a: string, i: number) => (
                    <li key={i}>
                        <input
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
                    </li>
                ))}
            </ol>
            <button onClick={() => questionActions?.addOptions(question.qid)}>
                Add option
            </button>
        </div>,

        <div>
            <b>Linear scale</b>
            <table cellSpacing="10">
                <tr>
                    <td>
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
                    </td>
                    <td>to</td>
                    <td>
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
                    </td>
                </tr>
            </table>
            <br />
            <br />
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
            <br />
            <br />
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

        <div>
            <b>Multiple choice grid</b>
            <p>Rows:</p>
            <ol>
                {question?.rows?.map((a: any, i: number) => (
                    <li key={i}>
                        <input
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
                    </li>
                ))}
            </ol>
            <button
                onClick={() => {
                    questionActions?.addRows(question.qid)
                }}
            >
                Add row
            </button>
            <p>Columns:</p>
            <ol>
                {question?.cols?.map((a: any, i: number) => (
                    <li key={i}>
                        <input
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
                    </li>
                ))}
            </ol>
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
            <ol>
                {question?.rows?.map((a: any, i: number) => (
                    <li key={i}>
                        <input
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
                    </li>
                ))}
            </ol>
            <button
                onClick={() => {
                    questionActions?.addRows(question.qid)
                }}
            >
                Add row
            </button>
            <p>Columns:</p>
            <ol>
                {question?.cols?.map((a: any, i: number) => (
                    <li key={i}>
                        <input
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
                    </li>
                ))}
            </ol>
            <button
                onClick={() => {
                    questionActions?.addCols(question.qid)
                }}
            >
                Add column
            </button>
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
                <input
                    className="question-text"
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
                {/*<span>Type:</span>*/}
                <select
                    className="question-select"
                    onChange={(e) => {
                        let selectedType: number = parseInt(e.target.value)
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
                    <option value={10}>Date</option>
                    <option value={11}>Time</option>
                </select>
            </div>

            <div className="required">
                <input
                    type="checkbox"
                    checked={question.required}
                    onChange={(e) => {
                        const reqVal = e.target.checked
                        questionActions?.setRequired(question.qid, reqVal)
                    }}
                />
                <span>Required</span>
            </div>

            {types[type]}
            <button
                onClick={() => {
                    questionActions?.deleteQuestion(question.qid)
                }}
            >
                Delete Question
            </button>
        </div>
    )
}

export default Question
