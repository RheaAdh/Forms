import React, { useEffect, useState } from "react"

interface props {
    question: any
    handleChange: any
    index: Number
    submitStatus: any
}

const QuestionResponse: React.FC<props> = ({
    question,
    handleChange,
    index,
    submitStatus,
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

    const [optionsChecked, setOptionsChecked] = useState<string[]>([])
    const [mcqGrid, setMcqgrid] = useState<any[]>([])
    const [emailError, setEmailError] = useState<string | null>(null)
    const [arr, setArr] = useState<number[]>([])

    const fillArray = (low: number, hi: number) => {
        for (let i: number = low; i <= hi; i++) {
            setArr((prevState) => [...prevState, i])
        }
    }

    useEffect(() => {
        if (arr.length === 0) {
            fillArray(question["lowRating"], question["highRating"])
        }
    })

    const handleShortAnswer = (e: any) => {
        if (e?.target.value === null && question["required"]) {
            submitStatus(index, false)
            return
        } else submitStatus(index, true)
        const answer = {
            answerType: "short-answer",
            questionId: question["_id"],
            shortText: e?.target.value,
        }
        handleChange(index, answer)
    }
    const handleParagraphAnswer = (e: any) => {
        if (e?.target.value === null && question["required"]) {
            submitStatus(index, false)
        } else submitStatus(index, true)
        const answer = {
            questionId: question["_id"],
            answerType: "paragraph-answer",
            paragraphText: e?.target.value,
        }
        handleChange(index, answer)
    }
    const handleMcq = (e: any, optionText: string) => {
        const answer = {
            answerType: "mcq-answer",
            questionId: question["_id"],
            selectedOption: optionText,
        }
        if (question["required"]) submitStatus(index, true)
        handleChange(index, answer)
    }

    const handleCheckbox = (e: any, optionText: string) => {
        let answer = {}
        let opt = optionsChecked
        if (e.target.checked) {
            opt.push(optionText)
            setOptionsChecked(opt)
        } else {
            opt.splice(opt.indexOf(optionText), 1)
            setOptionsChecked(opt)
        }
        if (question["required"]) {
            if (opt.length === 0) {
                submitStatus(index, false)
            } else {
                submitStatus(index, true)
            }
        }
        answer = {
            answerType: "checkbox-answer",
            questionId: question["_id"],
            multipleSelected: opt,
        }
        handleChange(index, answer)
    }

    const handleDropdown = (e: any) => {
        const answer = {
            answerType: "dropdown-answer",
            questionId: question["_id"],
            selectedOption: e.target.value,
        }
        if (question["required"]) {
            submitStatus(index, true)
        }
        handleChange(index, answer)
    }

    const handleEmail = (e: any) => {
        if (
            !/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(
                e.target.value
            )
        ) {
            setEmailError("Please enter a valid email")
            submitStatus(index, false)
        } else {
            setEmailError(null)
        }
        const answer = {
            answerType: "email-answer",
            questionId: question["_id"],
            emailAnswer: e.target.value,
        }
        handleChange(index, answer)
    }

    const handleMcqGrid = (row: string, col: string) => {
        if (question["required"]) {
            submitStatus(index, true)
        }
        let mcq = mcqGrid
        let idx = mcq.findIndex((obj: any, i: Number) => {
            if (obj["row"] === row) {
                return true
            }
        })
        if (idx !== -1) {
            mcq = mcq.filter((obj) =>
                obj["row"] === row ? { row: row, col: col } : obj
            )
        } else {
            mcq.push({ row: row, col: col })
        }
        setMcqgrid(mcq)
        const answer = {
            answerType: "multiplechoicegrid-answer",
            questionId: question["_id"],
            selectedOptionsGrid: mcq,
        }
        handleChange(index, answer)
    }
    const handleCheckboxGrid = (e: any, row: string, col: string) => {
        let mcq = mcqGrid
        if (e.target.checked) {
            // Push new data
            mcq.push({ row: row, col: col })
            setMcqgrid(mcq)
            if (question["required"]) {
                submitStatus(index, true)
            }
        } else {
            //Unchecked, hence find and delete
            let idx = mcq.findIndex((obj: any, i: Number) => {
                if (obj["row"] === row && obj["col"] === col) {
                    return true
                }
            })
            mcq.splice(idx, 1)
            setMcqgrid(mcq)
            if (mcq.length === 0 && question["required"]) {
                submitStatus(index, false)
            }
        }
        const answer = {
            answerType: "multiplechoicegrid-answer",
            questionId: question["_id"],
            selectedOptionsGrid: mcq,
        }
        handleChange(index, answer)
    }
    const handleLinearScale = (e: any) => {
        if (question["required"]) {
            submitStatus(index, true)
        }
        const answer = {
            answerType: "linearscale-answer",
            questionId: question["_id"],
            selectedOption: e.target.value,
        }
        handleChange(index, answer)
    }
    const types = [
        //Short
        <div>
            <input
                type="text"
                placeholder="Short Answer"
                onChange={(e) => handleShortAnswer(e)}
            ></input>
        </div>,
        //Paragraph
        <div>
            <textarea
                placeholder="Paragraph answer"
                style={{ resize: "none", width: "300px", height: "100px" }}
                onChange={(e) => handleParagraphAnswer(e)}
            ></textarea>
        </div>,
        // MCQ
        <div>
            <form>
                {question["options"]?.map((optionText: string, i: Number) => {
                    return (
                        <div key={optionText}>
                            <input
                                type="radio"
                                name="mcq-answer"
                                value={optionText}
                                onChange={(e) => handleMcq(e, optionText)}
                            />
                            {optionText}
                            {/* <label htmlFor={optionText}>{optionText}</label> */}
                        </div>
                    )
                })}
            </form>
        </div>,
        //Checkbox
        <div>
            <form>
                {question["options"]?.map((optionText: string, i: Number) => {
                    return (
                        <div key={optionText}>
                            <input
                                type="checkbox"
                                name="checkbox-answer"
                                value={optionText}
                                onChange={(e) => handleCheckbox(e, optionText)}
                            />
                            {optionText}
                            {/* <label htmlFor={optionText}>{optionText}</label> */}
                        </div>
                    )
                })}
            </form>
        </div>,
        //Dropdown
        <div>
            <select onChange={(e) => handleDropdown(e)}>
                {question["options"]?.map((optionText: string, i: Number) => {
                    return <option value={optionText}>{optionText}</option>
                })}
            </select>
        </div>,
        //Email
        <div>
            <input type="text" onChange={(e) => handleEmail(e)} />
            <br />
            <b>{emailError}</b>
        </div>,
        //MCQ grid
        <div>
            {question["colLabel"]?.map((data: string, i: Number) => {
                return (
                    <span key={data} style={{ marginRight: "10px" }}>
                        {data}
                    </span>
                )
            })}
            {question["rowLabel"]?.map((row: string, i: Number) => {
                return (
                    <div>
                        <span key={row} style={{ marginRight: "25px" }}>
                            {row}{" "}
                        </span>
                        {question["colLabel"]?.map((col: string, i: Number) => {
                            return (
                                <input
                                    onChange={() => handleMcqGrid(row, col)}
                                    type="radio"
                                    key={col}
                                    name={row}
                                    style={{
                                        display: "inline",
                                        marginRight: "10px",
                                    }}
                                />
                            )
                        })}
                        <br />
                    </div>
                )
            })}
        </div>,
        //CheckboxGrid
        <div>
            {question["colLabel"]?.map((data: string, i: Number) => {
                return (
                    <span key={data} style={{ marginRight: "10px" }}>
                        {data}
                    </span>
                )
            })}
            {question["rowLabel"]?.map((row: string, i: Number) => {
                return (
                    <div>
                        <span key={row} style={{ marginRight: "25px" }}>
                            {row}{" "}
                        </span>
                        {question["colLabel"]?.map((col: string, i: Number) => {
                            return (
                                <input
                                    onChange={(e) =>
                                        handleCheckboxGrid(e, row, col)
                                    }
                                    type="checkbox"
                                    key={col}
                                    name={row}
                                    style={{
                                        display: "inline",
                                        marginRight: "10px",
                                    }}
                                />
                            )
                        })}
                        <br />
                    </div>
                )
            })}
        </div>,
        //Linear Scale
        <div>
            {question["lowRatingLabel"] ? (
                <span>{question["lowRatingLabel"]}</span>
            ) : null}
            {arr.map((num: Number, idx: Number) => {
                return (
                    <span key={String(num)}>
                        <input
                            onChange={(e) => handleLinearScale(e)}
                            value={num as number}
                            type="radio"
                            name={question["_id"]}
                            style={{
                                marginLeft: "15px",
                                display: "inline",
                            }}
                        />
                        {num}
                    </span>
                )
            })}
            {question["highRatingLabel"] ? (
                <span style={{ marginLeft: "15px" }}>
                    {question["highRatingLabel"]}
                </span>
            ) : null}
        </div>,
    ]

    return (
        <div>
            <b>{question["question_text"]}</b>{" "}
            {question["required"] ? (
                <span style={{ color: "red" }}>*</span>
            ) : null}
            {types[typeToIdx.indexOf(question["question-type"])]}
            <br />
            <br />
        </div>
    )
}

export default QuestionResponse
