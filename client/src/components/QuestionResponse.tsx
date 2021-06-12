import React, { useEffect, useState } from "react"

interface props {
    question: any
    handleChange?: any
    index?: Number
    submitStatus?: any
    prevResponse?: any
    readonly: boolean
}

const QuestionResponse: React.FC<props> = ({
    question,
    prevResponse,
    handleChange,
    index,
    submitStatus,
    readonly,
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

    // For both mcq and checkbox
    const [optionsChecked, setOptionsChecked] = useState<string[]>([])

    // For both mcq grid and checkbox grid
    const [mcqGrid, setMcqgrid] = useState<any[]>([])

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
            question["question-type"] === "linearscale-answer"
        ) {
            fillArray(question["lowRating"], question["highRating"])
        } else if (
            question["question-type"] === "multiplechoicegrid-answer" ||
            question["question-type"] === "checkboxgrid-answer"
        ) {
            //map to get rid of object id (Since it is an array of objects, mongo adds objectId by default)

            prevResponse?.["selectedOptionsGrid"]
                ? setMcqgrid(
                      prevResponse?.["selectedOptionsGrid"]?.map(
                          (res: any, idx: Number) => {
                              return { row: res["row"], col: res["col"] }
                          }
                      )
                  )
                : setMcqgrid([])
        } else if (
            question["question-type"] === "mcq-answer" ||
            question["question-type"] === "checkbox-answer"
        ) {
            setOptionsChecked(
                prevResponse?.["multipleSelected"]
                    ? prevResponse?.["multipleSelected"]
                    : []
            )
        } else if (question["question-type"] === "dropdown-answer") {
            const answer = {
                answerType: "dropdown-answer",
                questionId: question["_id"],
                selectedOption: question["options"][0],
            }
            handleChange(index, answer)
        }
    }, [])

    const handleShortAnswer = (e: any) => {
        if ((e?.target.value).length === 0 && question["required"]) {
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
        if ((e?.target.value).length === 0 && question["required"]) {
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
            submitStatus(index, true)
        }
        const answer = {
            answerType: "email-answer",
            questionId: question["_id"],
            emailAnswer: e.target.value,
        }
        handleChange(index, answer)
    }

    const handleMcqGrid = (row: string, col: string) => {
        let mcq = mcqGrid
        let idx = mcq.findIndex((obj: any, i: Number) => {
            if (obj["row"] === row) {
                return true
            }
        })
        if (idx !== -1) {
            mcq[idx] = { row: row, col: col }
        } else {
            mcq.push({ row: row, col: col })
        }
        setMcqgrid(mcq)
        if (
            question["required"] &&
            question["rowLabel"]?.length === mcqGrid.length
        ) {
            submitStatus(index, true)
        }
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
            answerType: "checkboxgrid-answer",
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
            {readonly === true ? (
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
            {readonly === true ? (
                <textarea
                    placeholder="Paragraph answer"
                    style={{ resize: "none", width: "300px", height: "100px" }}
                    readOnly
                    defaultValue={prevResponse?.paragraphText}
                ></textarea>
            ) : (
                <textarea
                    placeholder="Paragraph answer"
                    style={{ resize: "none", width: "300px", height: "100px" }}
                    onChange={(e) => handleParagraphAnswer(e)}
                    defaultValue={prevResponse?.paragraphText}
                ></textarea>
            )}
        </div>,
        // MCQ
        <div>
            <form>
                {question["options"]?.map((optionText: string, i: Number) => {
                    return (
                        // Check if readonly or not. Then in both cases, check whether or not to add default checked attribute.
                        // disabled attribute needed for readonly
                        <div key={optionText}>
                            {readonly ? (
                                prevResponse?.selectedOption === optionText ? (
                                    <input
                                        disabled
                                        type="radio"
                                        name="mcq-answer"
                                        defaultChecked
                                    />
                                ) : (
                                    <input
                                        disabled
                                        type="radio"
                                        name="mcq-answer"
                                    />
                                )
                            ) : prevResponse?.selectedOption === optionText ? (
                                <input
                                    type="radio"
                                    name="mcq-answer"
                                    onClick={(e) => handleMcq(e, optionText)}
                                    defaultChecked
                                />
                            ) : (
                                <input
                                    type="radio"
                                    name="mcq-answer"
                                    onClick={(e) => handleMcq(e, optionText)}
                                />
                            )}
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
                            {readonly ? (
                                prevResponse?.multipleSelected?.includes(
                                    optionText
                                ) ? (
                                    <input
                                        type="checkbox"
                                        disabled
                                        name="checkbox-answer"
                                        value={optionText}
                                        defaultChecked
                                    />
                                ) : (
                                    <input
                                        type="checkbox"
                                        disabled
                                        name="checkbox-answer"
                                        value={optionText}
                                    />
                                )
                            ) : prevResponse?.multipleSelected?.includes(
                                  optionText
                              ) ? (
                                <input
                                    type="checkbox"
                                    name="checkbox-answer"
                                    value={optionText}
                                    onClick={(e) =>
                                        handleCheckbox(e, optionText)
                                    }
                                    defaultChecked
                                />
                            ) : (
                                <input
                                    type="checkbox"
                                    name="checkbox-answer"
                                    value={optionText}
                                    onClick={(e) =>
                                        handleCheckbox(e, optionText)
                                    }
                                />
                            )}
                            {optionText}
                            {/* <label htmlFor={optionText}>{optionText}</label> */}
                        </div>
                    )
                })}
            </form>
        </div>,
        //Dropdown
        <div>
            {readonly ? (
                <select defaultValue={prevResponse?.selectedOption} disabled>
                    {question["options"]?.map(
                        (optionText: string, i: Number) => {
                            return (
                                <option value={optionText}>{optionText}</option>
                            )
                        }
                    )}
                </select>
            ) : (
                <select defaultValue={prevResponse?.selectedOption}>
                    {question["options"]?.map(
                        (optionText: string, i: Number) => {
                            return (
                                <option
                                    value={optionText}
                                    onClick={(e) => handleDropdown(e)}
                                >
                                    {optionText}
                                </option>
                            )
                        }
                    )}
                </select>
            )}
        </div>,
        //Email
        <div>
            {readonly === true ? (
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
                        {question["colLabel"]?.map((col: string, j: Number) => {
                            // Iterating through rows and columns to return radio element.
                            // Based on previous response, return element with default checked set to true if checked
                            // else leave the attribute out. (Setting to false wasn't working)

                            return mcqGrid?.find((ob) => {
                                return ob["row"] === row && ob["col"] === col
                            }) !== undefined ? (
                                readonly ? (
                                    <input
                                        type="radio"
                                        key={col}
                                        name={row}
                                        style={{
                                            display: "inline",
                                            marginRight: "10px",
                                        }}
                                        disabled
                                        defaultChecked
                                    />
                                ) : (
                                    <input
                                        onClick={() => handleMcqGrid(row, col)}
                                        type="radio"
                                        key={col}
                                        name={row}
                                        style={{
                                            display: "inline",
                                            marginRight: "10px",
                                        }}
                                        defaultChecked
                                    />
                                )
                            ) : readonly ? (
                                <input
                                    disabled
                                    type="radio"
                                    key={col}
                                    name={row}
                                    style={{
                                        display: "inline",
                                        marginRight: "10px",
                                    }}
                                />
                            ) : (
                                <input
                                    onClick={() => handleMcqGrid(row, col)}
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
                            return mcqGrid?.find((obj) => {
                                return obj["row"] === row && obj["col"] === col
                            }) !== undefined ? (
                                readonly ? (
                                    <input
                                        disabled
                                        type="checkbox"
                                        key={col}
                                        name={row}
                                        style={{
                                            display: "inline",
                                            marginRight: "10px",
                                        }}
                                        defaultChecked
                                    />
                                ) : (
                                    <input
                                        onClick={(e) =>
                                            handleCheckboxGrid(e, row, col)
                                        }
                                        type="checkbox"
                                        key={col}
                                        name={row}
                                        style={{
                                            display: "inline",
                                            marginRight: "10px",
                                        }}
                                        defaultChecked={true}
                                    />
                                )
                            ) : readonly ? (
                                <input
                                    readOnly
                                    type="checkbox"
                                    key={col}
                                    name={row}
                                    style={{
                                        display: "inline",
                                        marginRight: "10px",
                                    }}
                                />
                            ) : (
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
            {arr.map((num: string, idx: Number) => {
                return (
                    <span key={String(num)}>
                        {readonly ? (
                            <input
                                readOnly
                                value={num}
                                type="radio"
                                name={question["_id"]}
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
                                name={question["_id"]}
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
