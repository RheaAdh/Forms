export const questionResponse = (question: any, prevResponse: any) => {
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

    const types = [
        //Short
        `<div class="text-type">
            <p>${prevResponse?.shortText}</p>
        </div>`,
        //Paragraph
        `<div class="text-type">
            <p>${prevResponse?.paragraphText}</p>
        </div>`,
        // Multiple choice question
        `<div>
            <form>
                ${question["options"]?.map((option: any, i: number) => {
                    return `<div class="radio-checkbox">
                            ${
                                prevResponse?.selectedOption === option.text
                                    ? `<input
                                        disabled
                                        type="radio"
                                        name="mcq-answer"
                                        defaultChecked
                                        id={option.text + question.qid}
                                    />`
                                    : `<input
                                        disabled
                                        type="radio"
                                        name="mcq-answer"
                                        id={option.text + question.qid}
                                    />`
                            }
                            <span class="styled-radio"></span>
                            <label htmlFor=${option.text + question.qid}>
                                ${option.text}
                            </label>
                        </div>`
                })}
            </form>
        </div>`,
        //Checkbox
        `<div>
            <form>
                ${question["options"]?.map((option: any, i: number) => {
                    return `<div key={option.text} class="radio-checkbox">
                            ${
                                prevResponse?.multipleSelected?.includes(
                                    option.text
                                )
                                    ? `<input
                                    id={option.text + question.qid}
                                    type="checkbox"
                                    disabled
                                    name="checkbox-answer"
                                    defaultChecked
                                />`
                                    : `<input
                                    id={option.text + question.qid}
                                    type="checkbox"
                                    disabled
                                    name="checkbox-answer"
                                />`
                            }
                            <span class="styled-checkbox"></span>
                            <label htmlFor=${option.text + question.qid}>
                                ${option.text}
                            </label>
                            <span class="checkbox-tick"></span>
                        </div>`
                })}
            </form>
        </div>`,
        //Dropdown
        `<div class="text-type">
            <p>${prevResponse?.selectedOption}</p>
        </div>`,
        //Email
        `<div class="text-type">
            <p>${prevResponse?.emailAnswer}</p>
        </div>`,
        //MCQ grid
        `<div class="grid-question">
            <div class="grid-question-row">
                <span key={"0"} class="grid-question-row-item"></span>
                ${question.cols?.map((data: any, i: number) => {
                    return `<span class="grid-question-row-item">
                            ${data.text}
                        </span>`
                })}
            </div>
            ${question.rows.map((row: any, i: number) => {
                return `<div class="grid-question-row" key={row.key}>
                        <span class="grid-question-row-item">${row.text} </span>
                        ${question?.cols?.map((col: any, j: number) => {
                            return `<div
                                    class="radio-checkbox grid-question-row-item"
                                >
                                    ${
                                        prevResponse?.selectedOptionsGrid?.find(
                                            (ob: any) => {
                                                return (
                                                    ob["row"] === row.text &&
                                                    ob["col"] === col.text
                                                )
                                            }
                                        ) !== undefined
                                            ? `<input
                                            type="radio"
                                            key=${col.key}
                                            name=${row.text}
                                            disabled
                                            defaultChecked
                                        />`
                                            : `<input
                                            disabled
                                            type="radio"
                                            key=${col.key}
                                            name=${row.text}
                                        />`
                                    }
                                    <span class="styled-radio"></span>
                                </div>
`
                        })}
                    </div>`
            })}
        </div>`,
        //CheckboxGrid
        `<div class="grid-question">
            <div class="grid-question-row">
                <span class="grid-question-row-item"></span>
                ${question?.cols?.map((data: any, i: number) => {
                    return `<span class="grid-question-row-item">
                            ${data.text}
                        </span>`
                })}
            </div>
            ${question?.rows?.map((row: any, i: number) => {
                return `<div key={row.key} class="grid-question-row">
                        <span class="grid-question-row-item">{row.text}</span>
                        ${question?.cols?.map((col: any, i: number) => {
                            return `<div
                                    class="radio-checkbox grid-question-row-item"
                                >
                                    ${
                                        prevResponse?.selectedOptionsGrid?.find(
                                            (obj: any) => {
                                                return (
                                                    obj["row"] === row.text &&
                                                    obj["col"] === col.text
                                                )
                                            }
                                        ) !== undefined
                                            ? `<input
                                            disabled
                                            type="checkbox"
                                            key=${col.key}
                                            name=${row.text}
                                            id=${row.text + col.text}
                                            defaultChecked
                                        />`
                                            : `<input
                                            disabled
                                            type="checkbox"
                                            key=${col.key}
                                            name=${row.text}
                                            id=${row.text + col.text}
                                        />`
                                    }
                                    <span class="styled-checkbox"></span>
                                    <span class="checkbox-tick"></span>
                                </div>`
                        })}
                    </div>`
            })}
        </div>`,
        //Linear Scale
        `<div class="lin-scale-question">
            <span class="lin-scale-item">${question.lowRatingLabel}</span>
            ${arr.map(
                (num: string) =>
                    `<div
                    class="radio-checkbox grid-question-row-item lin-scale-item"
                    key=${num}
                >
                    ${
                        num === prevResponse?.selectedOption
                            ? `<input
                            type="radio"
                            disabled
                            defaultChecked
                            key=${num}
                            id=${question.qid + num}
                            name=${question.qid}
                        ></input>`
                            : `<input
                            type="radio"
                            disabled
                            key=${num}
                            id=${question.qid + num}
                            name=${question.qid}
                        ></input>`
                    }
                    <span class="styled-radio"></span>
                    <label htmlFor=${question.qid + num}>${num}</label>
                </div>`
            )}
            <span class="lin-scale-item">${question["highRatingLabel"]}</span>
        </div>`,
        `<div>
            ${
                !(
                    question.questionText.length === 0 &&
                    question.description?.length === 0
                ) && `<p>{question.description}</p>`
            }
        </div>`,
    ]

    return `
    ${
        (question?.questionType === "page-header" &&
            (question?.questionText?.length ||
                question?.description?.length)) ||
        question?.questionType !== "page-header"
            ? `<div className="display-form-component">
                    ${
                        question.questionType === "page-header"
                            ? `<h2>${question.questionText}</h2>`
                            : `<b style="display: inline;">
                            ${question.questionText}
                        </b>`
                    }
                    ${
                        question["required"]
                            ? `<span style="color: red; fontSize: 1.5em;">
                            *
                        </span>`
                            : null
                    }
                    ${types[typeToIdx.indexOf(question["questionType"])]}
                </div>`
            : null
    }
    `
}
