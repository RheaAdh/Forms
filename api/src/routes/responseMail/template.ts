import { displayForm } from "./displayFormCss"
import { index } from "./indexCss"
import { questionResponse } from "./questionResponse"
import juice from "juice"

export const mailHTMLResponse = (form: any, questions: any, response: any) => {
    let html = `
    <html>
        <head>
            <style>
            ${index}
            ${displayForm}
            </style>
        </head>
        <body>
        <div
        class="display-form-page"
    >
        <div class="display-form-container">
            <div class="display-form-component" >
                <h2>${form?.title}</h2>
                <p>${form?.description ? form.description : null}</p>
            </div>
            ${questions?.map((q: any, idx: number) => {
                return questionResponse(q, response[idx])
            })}
        </div>
    </div>
        </body>
    </html>
    `
    return juice(html)
}
