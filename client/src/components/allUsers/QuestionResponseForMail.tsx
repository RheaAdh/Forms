import React from "react"
import { Option, IQuestion } from "../../context/questions/QuestionListContext"
import { IResponse } from "../../context/responses/ResponseListContext"

interface props {
    question: IQuestion
    prevResponse?: IResponse
}
//  This component is to be mailed. Hence all css must be written inside the component
const QuestionResponseForMail: React.FC<props> = ({
    question,
    prevResponse,
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
        "page-header",
    ]

    const arr: string[] = []
    if (
        question?.questionType === "linearscale-answer" &&
        question.lowRating &&
        question.highRating
    ) {
        for (
            var i: number = question.lowRating;
            i <= question.highRating;
            i += 1
        ) {
            arr.push(String(i))
        }
    }

    const types = [
        //Short
        <div className="text-type">
            <p>{prevResponse?.shortText}</p>
        </div>,
        //Paragraph
        <div className="text-type">
            <p>{prevResponse?.paragraphText}</p>
        </div>,
        // Multiple choice question
        <div>
            <form>
                {question["options"]?.map((option: Option, i: number) => {
                    return (
                        <div key={option.text} className="radio-checkbox">
                            {prevResponse?.selectedOption === option.text ? (
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
                            )}
                            <span className="styled-radio"></span>
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
                            {prevResponse?.multipleSelected?.includes(
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
                            )}
                            <span className="styled-checkbox"></span>
                            <label htmlFor={option.text + question.qid}>
                                {option.text}
                            </label>
                            <span className="checkbox-tick"></span>
                        </div>
                    )
                })}
            </form>
        </div>,
        //Dropdown
        <div className="text-type">
            <p>{prevResponse?.selectedOption}</p>
        </div>,
        //Email
        <div className="text-type">
            <p>{prevResponse?.emailAnswer}</p>
        </div>,
        //MCQ grid
        <div className="grid-question">
            <div className="grid-question-row">
                <span key={"0"} className="grid-question-row-item"></span>
                {question.cols?.map((data: Option, i: number) => {
                    return (
                        <span key={data.key} className="grid-question-row-item">
                            {data.text}
                        </span>
                    )
                })}
            </div>
            {question?.rows?.map((row: Option, i: number) => {
                return (
                    <div className="grid-question-row" key={row.key}>
                        <span className="grid-question-row-item">
                            {row.text}{" "}
                        </span>
                        {question?.cols?.map((col: Option, j: number) => {
                            // Iterating through rows and columns to return radio element.
                            // Based on previous response, return element with default checked set to true if checked
                            // else leave the attribute out. (Setting to false wasn't working)

                            return (
                                <div
                                    key={col.key}
                                    className="radio-checkbox grid-question-row-item"
                                >
                                    {prevResponse?.selectedOptionsGrid?.find(
                                        (ob) => {
                                            return (
                                                ob["row"] === row.text &&
                                                ob["col"] === col.text
                                            )
                                        }
                                    ) !== undefined ? (
                                        <input
                                            type="radio"
                                            key={col.key}
                                            name={row.text}
                                            disabled
                                            defaultChecked
                                        />
                                    ) : (
                                        <input
                                            disabled
                                            type="radio"
                                            key={col.key}
                                            name={row.text}
                                        />
                                    )}
                                    <span className="styled-radio"></span>
                                </div>
                            )
                        })}
                    </div>
                )
            })}
        </div>,
        //CheckboxGrid
        <div className="grid-question">
            <div className="grid-question-row">
                <span className="grid-question-row-item"></span>
                {question?.cols?.map((data: Option, i: number) => {
                    return (
                        <span key={data.key} className="grid-question-row-item">
                            {data.text}
                        </span>
                    )
                })}
            </div>
            {question?.rows?.map((row: Option, i: number) => {
                return (
                    <div key={row.key} className="grid-question-row">
                        <span className="grid-question-row-item">
                            {row.text}
                        </span>
                        {question?.cols?.map((col: Option, i: number) => {
                            return (
                                <div
                                    key={col.key}
                                    className="radio-checkbox grid-question-row-item"
                                >
                                    {prevResponse?.selectedOptionsGrid?.find(
                                        (obj) => {
                                            return (
                                                obj["row"] === row.text &&
                                                obj["col"] === col.text
                                            )
                                        }
                                    ) !== undefined ? (
                                        <input
                                            disabled
                                            type="checkbox"
                                            key={col.key}
                                            name={row.text}
                                            id={row.text + col.text}
                                            defaultChecked
                                        />
                                    ) : (
                                        <input
                                            disabled
                                            type="checkbox"
                                            key={col.key}
                                            name={row.text}
                                            id={row.text + col.text}
                                        />
                                    )}
                                    <span className="styled-checkbox"></span>
                                    <span className="checkbox-tick"></span>
                                </div>
                            )
                        })}
                    </div>
                )
            })}
        </div>,
        //Linear Scale
        <div className="lin-scale-question">
            <span className="lin-scale-item">{question.lowRatingLabel}</span>
            {arr.map((num: string) => (
                <div
                    className="radio-checkbox grid-question-row-item lin-scale-item"
                    key={num}
                >
                    {num === prevResponse?.selectedOption ? (
                        <input
                            type="radio"
                            disabled
                            defaultChecked
                            key={num}
                            id={question.qid + num}
                            name={question.qid}
                        ></input>
                    ) : (
                        <input
                            type="radio"
                            disabled
                            key={num}
                            id={question.qid + num}
                            name={question.qid}
                        ></input>
                    )}
                    <span className="styled-radio"></span>
                    <label htmlFor={question.qid + num}>{num}</label>
                </div>
            ))}
            <span className="lin-scale-item">
                {question["highRatingLabel"]}
            </span>
        </div>,
        <div>
            {!(
                question.questionText.length === 0 &&
                question.description?.length === 0
            ) && <p>{question.description}</p>}
        </div>,
    ]
    return (
        <>
            {(question?.questionType === "page-header" &&
                (question?.questionText?.length ||
                    question?.description?.length)) ||
            question?.questionType !== "page-header" ? (
                <div className="display-form-component">
                    {question.questionType === "page-header" ? (
                        <h2>{question.questionText}</h2>
                    ) : (
                        <b style={{ display: "inline" }}>
                            {question.questionText}
                        </b>
                    )}
                    {question["required"] ? (
                        <span style={{ color: "red", fontSize: "1.5em" }}>
                            *
                        </span>
                    ) : null}
                    {types[typeToIdx.indexOf(question["questionType"])]}
                </div>
            ) : null}
        </>
    )
}

export default QuestionResponseForMail
