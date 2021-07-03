import React, { useEffect, useState } from "react"
import autoAdjustHeight from "../util"
import { Option, Question } from "../context/QuestionListContext"
import { Response, useResponses } from "../context/ResponseListContext"
import { ReactComponent as DropdownArrow } from "../images/DropdownArrow.svg"

interface props {
    question: Question
    index: number
    prevResponse?: Response
}

const QuestionResponse: React.FC<props> = ({
    question,
    prevResponse,
    index,
}) => {
    const typeToIdx = [
        "short-answer",
        "paragraph-answer",
        "mcq-answer",
        "checkbox-answer",
        "dropdown-answer",
        "email-answer",
        "multiplechoicegrid-answer",
        "checkboxgrid-answer",
        "linearscale-answer",
    ]

    const responseList = useResponses()
    const [emailError, setEmailError] = useState<string | null>(null)

    // For linear scale
    const [arr, setArr] = useState<string[]>([])

    const fillArray = (low: number, hi: number) => {
        for (let i: number = low; i <= hi; i++) {
            setArr((prevState) => [...prevState, (i as unknown) as string])
        }
    }

    useEffect(() => {
        if (
            arr.length === 0 &&
            question.questionType === "linearscale-answer"
        ) {
            question?.lowRating !== undefined &&
                question?.highRating !== undefined &&
                fillArray(question.lowRating, question.highRating)
        }
    }, [])

    const handleShortAnswer = (e: any) => {
        var submit: boolean = !question.required
        if ((e?.target.value).length === 0 && question.required) {
            submit = false
        }
        if (question?.qid) {
            const answer = {
                answerType: "short-answer",
                questionId: question.qid,
                shortText: e?.target.value,
                canSubmit: submit,
                formId: question.formId,
            }
            responseList?.responseActions?.updateResponse(index, answer)
        }
    }
    const handleParagraphAnswer = (e: any) => {
        var submit: boolean = true
        if ((e?.target.value).length === 0 && question["required"]) {
            submit = false
        }
        const answer = {
            answerType: "paragraph-answer",
            paragraphText: e?.target.value,
            formId: question.formId,
            canSubmit: submit,
            questionId: question.qid ? question.qid : "",
        }
        responseList?.responseActions?.updateResponse(index, answer)
    }
    const handleMcq = (e: any, option: Option) => {
        var submit: boolean = !question.required
        if (question["required"]) submit = true
        const answer = {
            answerType: "mcq-answer",
            selectedOption: option.text,
            formId: question.formId,
            canSubmit: submit,
            questionId: question.qid ? question.qid : "",
        }
        responseList?.responseActions?.updateResponse(index, answer)
    }

    const handleCheckbox = (e: any, option: Option) => {
        var submit = true
        console.log(prevResponse)
        if (prevResponse?.multipleSelected === undefined) return
        const opt = prevResponse?.multipleSelected.slice()
        if (e.target.checked) {
            opt.push(option.text)
        } else {
            opt.splice(opt.indexOf(option.text), 1)
        }
        if (question["required"]) {
            if (opt.length === 0) {
                submit = false
            }
        }
        const answer = {
            answerType: "checkbox-answer",
            multipleSelected: opt,
            formId: question.formId,
            canSubmit: submit,
            questionId: question.qid ? question.qid : "",
        }
        responseList?.responseActions?.updateResponse(index, answer)
    }

    const handleDropdown = (e: React.ChangeEvent<HTMLSelectElement>) => {
        var submit = !question.required
        const answer = {
            answerType: "dropdown-answer",
            selectedOption: e.target.value,
            formId: question.formId,
            canSubmit: submit,
            questionId: question.qid ? question.qid : "",
        }
        if (question["required"]) {
            submit = true
        }
        responseList?.responseActions?.updateResponse(index, answer)
    }

    const handleEmail = (e: any) => {
        var submit: boolean = !question.required
        if (
            !/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(
                e.target.value
            )
        ) {
            setEmailError("Please enter a valid email")
            submit = false
        } else {
            setEmailError(null)
        }
        const answer = {
            answerType: "email-answer",
            emailAnswer: e.target.value,
            formId: question.formId,
            canSubmit: submit,
            questionId: question.qid ? question.qid : "",
        }
        responseList?.responseActions?.updateResponse(index, answer)
    }

    const handleMcqGrid = (row: string, col: string) => {
        if (prevResponse?.selectedOptionsGrid === undefined) return
        const mcq = prevResponse?.selectedOptionsGrid?.slice()
        var submit = false
        let idx = mcq.findIndex((obj: any, i: number) => {
            if (obj["row"] === row) {
                return true
            }
        })
        if (idx !== -1) {
            mcq[idx] = { row: row, col: col }
        } else {
            mcq.push({ row: row, col: col })
        }
        if (question.required && question.rows?.length === mcq.length) {
            submit = true
        }
        const answer = {
            answerType: "multiplechoicegrid-answer",
            selectedOptionsGrid: mcq,
            formId: question.formId,
            canSubmit: submit,
            questionId: question.qid ? question.qid : "",
        }
        responseList?.responseActions?.updateResponse(index, answer)
    }
    const handleCheckboxGrid = (e: any, row: string, col: string) => {
        if (prevResponse?.selectedOptionsGrid === undefined) return
        const mcq = prevResponse?.selectedOptionsGrid?.slice()
        var submit: boolean = !question.required
        if (e.target.checked) {
            // Push new data
            mcq.push({ row: row, col: col })
            if (question["required"]) {
                submit = true
            }
        } else {
            //Unchecked, hence find and delete
            let idx = mcq.findIndex((obj: any, i: number) => {
                if (obj["row"] === row && obj["col"] === col) {
                    return true
                }
            })
            mcq.splice(idx, 1)
            if (mcq.length === 0 && question["required"]) {
                submit = false
            } else submit = true
        }

        const answer = {
            answerType: "checkboxgrid-answer",
            selectedOptionsGrid: mcq,
            formId: question.formId,
            canSubmit: submit,
            questionId: question.qid ? question.qid : "",
        }
        responseList?.responseActions?.updateResponse(index, answer)
    }
    const handleLinearScale = (e: any) => {
        var submit: boolean = !question.required
        if (question["required"]) {
            submit = true
        }
        const answer = {
            answerType: "linearscale-answer",
            selectedOption: e.target.value,
            formId: question.formId,
            canSubmit: submit,
            questionId: question.qid ? question.qid : "",
        }
        responseList?.responseActions?.updateResponse(index, answer)
    }

    const types = [
        //Short
        <div>
            {responseList?.readOnly === true ? (
                <input
                    type="text"
                    placeholder="Short Answer"
                    defaultValue={prevResponse?.shortText}
                    readOnly
                />
            ) : (
                <input
                    type="text"
                    placeholder="Short Answer"
                    onChange={(e) => handleShortAnswer(e)}
                    defaultValue={prevResponse?.shortText}
                />
            )}
        </div>,
        //Paragraph
        <div>
            {responseList?.readOnly === true ? (
                <textarea
                    onChange={(e) => autoAdjustHeight(e)}
                    placeholder="Paragraph Answer"
                    readOnly
                    defaultValue={prevResponse?.paragraphText}
                ></textarea>
            ) : (
                <textarea
                    placeholder="Paragraph Answer"
                    onChange={(e) => {
                        handleParagraphAnswer(e)
                        autoAdjustHeight(e)
                    }}
                    defaultValue={prevResponse?.paragraphText}
                ></textarea>
            )}
        </div>,
        // Multiple choice question
        <div>
            <form>
                {question["options"]?.map((option: Option, i: number) => {
                    return (
                        // Check if responseList?.readOnly or not. Then in both cases, check whether or not to add default checked attribute.
                        // disabled attribute needed for responseList?.readOnly
                        <div className="radio-checkbox" key={option.text}>
                            {responseList?.readOnly ? (
                                prevResponse?.selectedOption === option.text ? (
                                    <>
                                        <input
                                            disabled
                                            type="radio"
                                            name="mcq-answer"
                                            defaultChecked
                                            id={option.text + question.qid}
                                        />
                                    </>
                                ) : (
                                    <>
                                        <input
                                            disabled
                                            type="radio"
                                            name="mcq-answer"
                                            id={option.text + question.qid}
                                        />
                                    </>
                                )
                            ) : prevResponse?.selectedOption === option.text ? (
                                <>
                                    <input
                                        type="radio"
                                        name="mcq-answer"
                                        onClick={(e) => handleMcq(e, option)}
                                        defaultChecked
                                        id={option.text + question.qid}
                                    />
                                </>
                            ) : (
                                <>
                                    <input
                                        type="radio"
                                        name="mcq-answer"
                                        onClick={(e) => handleMcq(e, option)}
                                        id={option.text + question.qid}
                                    />
                                </>
                            )}
                            <span className="styled-radio-checkbox"></span>

                            <label htmlFor={option.text + question.qid}>
                                {option.text}
                            </label>
                        </div>
                    )
                })}
            </form>
        </div>,
        //Checkbox
        <div>
            <form>
                {question["options"]?.map((option: Option, i: number) => {
                    return (
                        <div key={option.text} className="radio-checkbox">
                            {responseList?.readOnly ? (
                                prevResponse?.multipleSelected?.includes(
                                    option.text
                                ) ? (
                                    <input
                                        id={option.text + question.qid}
                                        type="checkbox"
                                        disabled
                                        name="checkbox-answer"
                                        defaultChecked
                                    />
                                ) : (
                                    <input
                                        id={option.text + question.qid}
                                        type="checkbox"
                                        disabled
                                        name="checkbox-answer"
                                    />
                                )
                            ) : prevResponse?.multipleSelected?.includes(
                                  option.text
                              ) ? (
                                <input
                                    id={option.text + question.qid}
                                    type="checkbox"
                                    name="checkbox-answer"
                                    onClick={(e) => handleCheckbox(e, option)}
                                    defaultChecked
                                />
                            ) : (
                                <input
                                    id={option.text + question.qid}
                                    type="checkbox"
                                    name="checkbox-answer"
                                    onClick={(e) => handleCheckbox(e, option)}
                                />
                            )}
                            <span className="styled-radio-checkbox"></span>
                            <label htmlFor={option.text + question.qid}>
                                {option.text}
                            </label>
                        </div>
                    )
                })}
            </form>
        </div>,
        //Dropdown
        <div className="select">
            {responseList?.readOnly ? (
                <select value={prevResponse?.selectedOption} disabled>
                    {question["options"]?.map((option: Option, i: number) => {
                        return (
                            <option key={option.text} value={option.text}>
                                {option.text}
                            </option>
                        )
                    })}
                </select>
            ) : (
                <select
                    value={prevResponse?.selectedOption}
                    onChange={(e) => {
                        e.persist()
                        handleDropdown(e)
                    }}
                >
                    {question["options"]?.map((option: Option, i: number) => {
                        return (
                            <option key={i} value={option.text}>
                                {option.text}
                            </option>
                        )
                    })}
                </select>
            )}
            <span className="select-arrow">
                <DropdownArrow />
            </span>
        </div>,
        //Email
        <div>
            {responseList?.readOnly === true ? (
                <input
                    readOnly
                    type="text"
                    defaultValue={prevResponse?.emailAnswer}
                />
            ) : (
                <input
                    type="text"
                    onChange={(e) => handleEmail(e)}
                    defaultValue={prevResponse?.emailAnswer}
                />
            )}
            <br />
            <b>{emailError}</b>
        </div>,
        //MCQ grid
        <div>
            {question.cols?.map((data: Option, i: number) => {
                return (
                    <span key={data.key} style={{ marginRight: "10px" }}>
                        {data.text}
                    </span>
                )
            })}
            {question?.rows?.map((row: Option, i: number) => {
                return (
                    <div key={row.key} className="radio-checkbox">
                        <span>{row.text} </span>
                        {question?.cols?.map((col: Option, j: number) => {
                            // Iterating through rows and columns to return radio element.
                            // Based on previous response, return element with default checked set to true if checked
                            // else leave the attribute out. (Setting to false wasn't working)

                            return prevResponse?.selectedOptionsGrid?.find(
                                (ob) => {
                                    return (
                                        ob["row"] === row.text &&
                                        ob["col"] === col.text
                                    )
                                }
                            ) !== undefined ? (
                                responseList?.readOnly ? (
                                    <input
                                        type="radio"
                                        key={col.key}
                                        name={row.text}
                                        style={{
                                            display: "inline",
                                            marginRight: "10px",
                                        }}
                                        disabled
                                        defaultChecked
                                    />
                                ) : (
                                    <input
                                        onClick={() =>
                                            handleMcqGrid(row.text, col.text)
                                        }
                                        type="radio"
                                        key={col.key}
                                        name={row.text}
                                        style={{
                                            display: "inline",
                                            marginRight: "10px",
                                        }}
                                        defaultChecked
                                    />
                                )
                            ) : responseList?.readOnly ? (
                                <input
                                    disabled
                                    type="radio"
                                    key={col.key}
                                    name={row.text}
                                    style={{
                                        display: "inline",
                                        marginRight: "10px",
                                    }}
                                />
                            ) : (
                                <input
                                    onClick={() =>
                                        handleMcqGrid(row.text, col.text)
                                    }
                                    type="radio"
                                    key={col.text}
                                    name={row.text}
                                    style={{
                                        display: "inline",
                                        marginRight: "10px",
                                    }}
                                />
                            )
                        })}
                        <span className="styled-radio-checkbox"></span>
                    </div>
                )
            })}
        </div>,
        //CheckboxGrid
        <div>
            {question?.cols?.map((data: Option, i: number) => {
                return (
                    <span key={data.key} style={{ marginRight: "10px" }}>
                        {data.text}
                    </span>
                )
            })}
            {question?.rows?.map((row: Option, i: number) => {
                return (
                    <div key={row.key} className="radio-checkbox">
                        <p>{row.text}</p>
                        {question?.cols?.map((col: Option, i: number) => {
                            return prevResponse?.selectedOptionsGrid?.find(
                                (obj) => {
                                    return (
                                        obj["row"] === row.text &&
                                        obj["col"] === col.text
                                    )
                                }
                            ) !== undefined ? (
                                responseList?.readOnly ? (
                                    <>
                                        <input
                                            disabled
                                            type="checkbox"
                                            key={col.key}
                                            name={row.text}
                                            id={row.text + col.text}
                                            defaultChecked
                                        />
                                        <span className="styled-radio-checkbox"></span>
                                    </>
                                ) : (
                                    <>
                                        <input
                                            onClick={(e) =>
                                                handleCheckboxGrid(
                                                    e,
                                                    row.text,
                                                    col.text
                                                )
                                            }
                                            type="checkbox"
                                            key={col.key}
                                            name={row.text}
                                            id={row.text + col.text}
                                            defaultChecked
                                        />
                                        <span className="styled-radio-checkbox"></span>
                                    </>
                                )
                            ) : responseList?.readOnly ? (
                                <>
                                    <input
                                        readOnly
                                        type="checkbox"
                                        key={col.key}
                                        name={row.text}
                                        id={row.text + col.text}
                                    />
                                    <span className="styled-radio-checkbox"></span>
                                </>
                            ) : (
                                <>
                                    <input
                                        onChange={(e) =>
                                            handleCheckboxGrid(
                                                e,
                                                row.text,
                                                col.text
                                            )
                                        }
                                        type="checkbox"
                                        key={col.key}
                                        name={row.text}
                                        id={row.text + col.text}
                                    />
                                    <span className="styled-radio-checkbox"></span>
                                </>
                            )
                        })}
                    </div>
                )
            })}
        </div>,
        //Linear Scale
        <div>
            {question.lowRatingLabel ? (
                <span>{question.lowRatingLabel}</span>
            ) : null}
            {arr.map((num: string, idx: number) => {
                return (
                    <span key={String(num)}>
                        {responseList?.readOnly ? (
                            <input
                                readOnly
                                value={num}
                                type="radio"
                                name={question.qid}
                                style={{
                                    marginLeft: "15px",
                                    display: "inline",
                                }}
                                defaultChecked={
                                    prevResponse?.selectedOption == num
                                }
                                disabled
                            />
                        ) : (
                            <input
                                onChange={(e) => handleLinearScale(e)}
                                value={num}
                                type="radio"
                                name={question.qid}
                                style={{
                                    marginLeft: "15px",
                                    display: "inline",
                                }}
                                defaultChecked={
                                    prevResponse?.selectedOption == num
                                }
                            />
                        )}
                        {num}
                    </span>
                )
            })}
            {question.highRatingLabel ? (
                <span style={{ marginLeft: "15px" }}>
                    {question["highRatingLabel"]}
                </span>
            ) : null}
        </div>,
    ]
    return (
        <div className="display-form-component">
            <b>{question.questionText}</b>
            {question["required"] ? (
                <span style={{ color: "red" }}>*</span>
            ) : null}
            {types[typeToIdx.indexOf(question["questionType"])]}
        </div>
    )
}

export default QuestionResponse
