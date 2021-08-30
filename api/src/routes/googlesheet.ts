import mongoose, { Document, Mongoose, Schema, Types } from "mongoose"
import { Response, Request, NextFunction } from "express"
import * as mongo from "../config/mongo"
import { Form } from "../models/form"
import { Question } from "../models/question"
import FormResponse from "../models/response"
import { User } from "../models/user"
import { ConfigurationServicePlaceholders } from "aws-sdk/lib/config_service_placeholders"
declare module "express-session" {
    interface Session {
        isAuth: boolean
        userId: Schema.Types.ObjectId
        role: String
        email: String
        username: String
    }
}

const fs = require("fs")
const readline = require("readline")
const { google } = require("googleapis")

export async function updateSheet(formId: any) {
    // let formId: any = form._id
    console.log("we got formId" + formId)
    let form: any = await Form.findOne({
        _id: mongoose.Types.ObjectId(formId),
    }).populate("questions")
    let questions: any
    console.log(form)
    questions = form.questions
    console.log("Questions is " + questions)
    //Sorting Question based on initial index --- order of fields displayed in forms
    questions.sort(function compare(a: any, b: any) {
        if (a.quesIndex < b.quesIndex) return -1
        if (a.quesIndex > b.quesIndex) return 1
        return 0
    })
    //Google Sheet Key
    const client = new google.auth.JWT(
        "iecseforms@iecse-forms.iam.gserviceaccount.com",
        null,
        "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCSY/D8jq4OzWoz\nzdXXTFE+VekX4xiFzX+OyntKTRM8CdNvdH/DDFoc+43KLZKBJvMXWE1xD5WoTjRJ\n3gdCEprhiygaValanDvWqT8RMyu96rhm3wTlhq/2NNnOJqDpfmNYDRFp6vAzsSQ2\neB9h+L8J47HoufNseebubS5G0UAz3KQdlZfV61utGimstQ4lDIBKuLZAVfZBkEcV\nFYp4AHcfkp77QziN9G1OhyxeuAjCcmEsYI9sP6b30gPy1iGzobc88vnXJDfpE1fw\neBn/kyqDRSZIohFJ1dTnsryN8fGr2afQzpvNqBZEzifD4uTx8Ea7apsM9YXaYHfr\n++YE+Mc/AgMBAAECggEAFkaP8pZxhP4b9YMSUZ8i07X18LUVU7L4AI3uIdnFngKu\nwkx7bn4wLi3XHxc9Llrzba95pUUmVESGL2FSQGsdV0m6EfvL9+ZDMsBxQNhFBTK0\n2a6BC74pg3D6XaTCIpWhX1IpvrDJ2UvQw1sXB2z3APW9ajj1giGwksJZYtxPhTSI\nc3LEDe/m1x5nMlcTgWoxSk4LJkBqszweaxZWlzzmEW4ks1dNdA7FIJtgwWs+/f1g\nmiCyef5ZaCN3hWfjzEpBVytJPsqGzcoayyrCcGlJdWajBlcChcXIFRljxL7sr0im\n87alDdxnDp8lahtrPM8mOqPQRpahRo6XqGfkxm0H9QKBgQDGgrEWIQMUdw5obe2G\nkw9794fmmTppAxk961AeO1Z50qBR3Pze69QLR71LR/KueZKdigZ/X7Y09qJmPoZN\ng6IhgbmqR6E+j35U0jigROMpCKqZfjSjuBiYSNWKMgOhN8XrTN+jE2xeKxuRXrLJ\nSO1LvuEJ+hedQMZF2MeJKrTNVQKBgQC8ySHy/FzQx4CI/qWzHuOfl/dpscWldddS\nf68fkd1wNN/4FbatVftV4zI4jcrmWac1ox0/EpY4EQCYoz5AidgWWxWREelIH/d+\nysdVmzjvog6VPKkkLsIoDHPZFgz0M2d7C8RWtRZiJEtaLaqtIS24kbiPEuur6PDQ\nxUr/4NriQwKBgBCF6lWMM+RtMH7Sv5WXAg/wf5hbIriA8IXt40JQ8Ba9yGhn+4hW\nmtTBiOkOOQ36wpBoX7gUcGciLExUYftrvIALezfINIyvhvVqdhopAbt1pDWYgqsp\n9KogTd3t4c12hfva7zZ0tG12KxpDhqAoeM/4OGULMxH8xUQlEh7BtkDtAoGAcs5i\nPfGoxDK/ARDTVeXQCWsSRA2fI6tRQdNyfWFoZ+dP2P/jcvAaA7ZCAVCBdqpI3H6Q\nt52nCvuUAD8uCXOKnLXRnMJmurzt9wZ8SJw3+Mr10V3tgpqI6nAAN6GISS3FnXef\ndBd2QELQLEwfQmAt/NNpiGC6P3ZOlLeWj5t/oR8CgYBHCsL4EFM6DdGRZhEAT/Pz\n3dcKo0ndGcC6WxTkQCYd7FvqG9fbDq18a/xMC73ehnNnhbvz2E4s872pEbd5/6q1\nTgmgnczWBf180C93vg9lzSI3CjWT8we76y45TukBaxrJ9SeIbcI89iy6fSEOaKNL\nqFdZpoP2Sh5O4EjZbGxD4g==\n-----END PRIVATE KEY-----\n",
        [
            "https://www.googleapis.com/auth/spreadsheets",
            "https://www.googleapis.com/auth/drive",
        ]
    )
    client.authorize(function (err: any) {
        if (err) {
            console.log("We have an error ;(")
            console.log(err)
            return
        } else {
            console.log("Connected to sheets")
        }
    })

    let newsheetId: any
    let newSheet
    const sheets = google.sheets({ version: "v4", auth: client })

    if (form.sheetId) {
        newsheetId = form.sheetId
        newSheet = await sheets.spreadsheets.get({
            spreadsheetId: newsheetId,
            auth: client,
        })
    } else {
        //Creating new sheet
        newSheet = await sheets.spreadsheets.create({
            resource: {
                properties: {
                    title: form.title,
                },
            },
            auth: client,
        })
        console.log("New Sheet created")
        console.log(newSheet)
        newsheetId = newSheet.data.spreadsheetId

        //setting permission to all
        let drive = google.drive({ version: "v3", auth: client })
        let newDrive = await drive.permissions.create({
            resource: {
                // type: "user",
                role: "writer",
                type: "anyone",
                // emailAddress: "",  // set the email address.
            },
            fileId: newsheetId,
            fields: "id",
        })

        //Updating newSheetId in form db
        await Form.findByIdAndUpdate(
            { _id: formId },
            {
                sheetId: newsheetId,
            }
        )
    }

    //resp will store array of responses
    let resp = await FormResponse.find({
        formId: formId,
    }).populate("userid", { password: 0 })

    let quesidtotext: any = new Map()
    let data = []
    let temp

    //Filling up row-header

    let datarow = []
    datarow.push("TimeStamp")
    if (!form?.anonymous) {
        datarow.push("Name")
        datarow.push("Email")
    }

    //Filling Up Ques - header
    for (let i in questions) {
        let str = questions[i].questionText
        if (
            questions[i].questionType == "multiplechoicegrid-answer" ||
            questions[i].questionType == "checkboxgrid-answer"
        ) {
            for (let j = 0; j < questions[i].rowLabel.length; j++) {
                str = questions[i].questionText
                str = " [ " + questions[i].rowLabel[j] + " ] " + str
                datarow.push(str)
            }
        } else datarow.push(str)
    }
    data.push(datarow)

    //Filling up sheet with responses
    for (let i = 0; i < resp.length; i++) {
        temp = resp[i].responses
        datarow = []
        datarow.push(resp[i].submitTime)
        if (!form?.anonymous) {
            datarow.push(resp[i].username)
            datarow.push(resp[i].userid.email)
        }
        for (let j = 0; j < temp.length; j++) {
            let str = quesidtotext[temp[j].questionId]
            if (temp[j].shortText) {
                datarow.push(temp[j].shortText)
            }
            if (temp[j].paragraphText) {
                datarow.push(temp[j].paragraphText)
            }
            if (temp[j].selectedOption) {
                datarow.push(temp[j].selectedOption)
            }
            if (temp[j].emailAnswer) {
                datarow.push(temp[j].emailAnswer)
            }
            if (temp[j].selectedOptionsGrid) {
                let datarowColWise: any = []
                let rowToCol: Map<string, string[]> = new Map()

                for (let k = 0; k < temp[j].selectedOptionsGrid.length; k++) {
                    console.log("K is " + k)
                    if (rowToCol.has(temp[j].selectedOptionsGrid[k].row)) {
                        console.log("Inside")
                        let tempArray: any = rowToCol.get(
                            temp[j].selectedOptionsGrid[k].row
                        )
                        rowToCol.set(temp[j].selectedOptionsGrid[k].row, [
                            ...tempArray,
                            temp[j].selectedOptionsGrid[k].col,
                        ])
                    } else {
                        rowToCol.set(temp[j].selectedOptionsGrid[k].row, [
                            temp[j].selectedOptionsGrid[k].col,
                        ])
                    }
                    console.log(
                        rowToCol.get(temp[j].selectedOptionsGrid[k].row)
                    )
                }

                console.log("Here")
                rowToCol.forEach((value, key) => {
                    console.log("key is " + key)
                    console.log("value is " + value)
                    let tempArray: any = value
                    let str = ""
                    for (let k = 0; k < tempArray.length; k++) {
                        if (k == 0) {
                            str = tempArray[k]
                        } else {
                            str = str + ", " + tempArray[k]
                        }
                    }
                    console.log("Required String :" + str)
                    datarowColWise.push(str)
                })
                datarow.push(...datarowColWise)
            }
            if (temp[j].multipleSelected) {
                console.log(temp[j].multipleSelected)
                let s: any = ""
                for (let k = 0; k < temp[j].multipleSelected.length; k++) {
                    if (k == 0) {
                        s = temp[j].multipleSelected[k]
                    } else {
                        s = s + ", " + temp[j].multipleSelected[k]
                    }
                    console.log(s)
                }
                datarow.push(s)
            }
        }

        data.push(datarow)
    }
    console.log("Download ready data")
    console.log(data)

    //Updating in sheet
    await sheets.spreadsheets.values.update({
        auth: client,
        spreadsheetId: newsheetId,
        range: "Sheet1",
        valueInputOption: "USER_ENTERED",
        resource: {
            values: data,
        },
    })

    console.log("Something has been written,check sheet link")
    return newSheet
}

//Write to new Instance of sheet.
export async function writeToNewSheet(req: Request, res: Response) {
    let formId = req.params.formId
    console.log("Initial " + req.params.formId)
    let form: any
    let questions: any
    if (!formId.match(/^[0-9a-fA-F]{24}$/))
        return res.status(400).send({ success: false, msg: "Invalid FormId" })
    //Calling updateSheet to update sheet with latest response
    let newSheet: any = await updateSheet(formId)
    console.log("we got newSheet")
    return res
        .status(200)
        .send({ success: true, data: newSheet.data.spreadsheetUrl })
}

// export async function getCurrentSheet(req: Request, res: Response) {
//     let formId = req.params.formId
//     console.log(formId)
//     console.log("Form : ")
//     let form: any
//     form = await Form.findById({ _id: formId })
//     console.log(form)
//     // console.log(form.)

//     if (form) {
//         // console.log(form._id)
//         if (form.sheetId) {
//             let sheetId = form.sheetId
//             const client = new google.auth.JWT(
//                 "iecseforms@iecse-forms.iam.gserviceaccount.com",
//                 null,
//                 "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCSY/D8jq4OzWoz\nzdXXTFE+VekX4xiFzX+OyntKTRM8CdNvdH/DDFoc+43KLZKBJvMXWE1xD5WoTjRJ\n3gdCEprhiygaValanDvWqT8RMyu96rhm3wTlhq/2NNnOJqDpfmNYDRFp6vAzsSQ2\neB9h+L8J47HoufNseebubS5G0UAz3KQdlZfV61utGimstQ4lDIBKuLZAVfZBkEcV\nFYp4AHcfkp77QziN9G1OhyxeuAjCcmEsYI9sP6b30gPy1iGzobc88vnXJDfpE1fw\neBn/kyqDRSZIohFJ1dTnsryN8fGr2afQzpvNqBZEzifD4uTx8Ea7apsM9YXaYHfr\n++YE+Mc/AgMBAAECggEAFkaP8pZxhP4b9YMSUZ8i07X18LUVU7L4AI3uIdnFngKu\nwkx7bn4wLi3XHxc9Llrzba95pUUmVESGL2FSQGsdV0m6EfvL9+ZDMsBxQNhFBTK0\n2a6BC74pg3D6XaTCIpWhX1IpvrDJ2UvQw1sXB2z3APW9ajj1giGwksJZYtxPhTSI\nc3LEDe/m1x5nMlcTgWoxSk4LJkBqszweaxZWlzzmEW4ks1dNdA7FIJtgwWs+/f1g\nmiCyef5ZaCN3hWfjzEpBVytJPsqGzcoayyrCcGlJdWajBlcChcXIFRljxL7sr0im\n87alDdxnDp8lahtrPM8mOqPQRpahRo6XqGfkxm0H9QKBgQDGgrEWIQMUdw5obe2G\nkw9794fmmTppAxk961AeO1Z50qBR3Pze69QLR71LR/KueZKdigZ/X7Y09qJmPoZN\ng6IhgbmqR6E+j35U0jigROMpCKqZfjSjuBiYSNWKMgOhN8XrTN+jE2xeKxuRXrLJ\nSO1LvuEJ+hedQMZF2MeJKrTNVQKBgQC8ySHy/FzQx4CI/qWzHuOfl/dpscWldddS\nf68fkd1wNN/4FbatVftV4zI4jcrmWac1ox0/EpY4EQCYoz5AidgWWxWREelIH/d+\nysdVmzjvog6VPKkkLsIoDHPZFgz0M2d7C8RWtRZiJEtaLaqtIS24kbiPEuur6PDQ\nxUr/4NriQwKBgBCF6lWMM+RtMH7Sv5WXAg/wf5hbIriA8IXt40JQ8Ba9yGhn+4hW\nmtTBiOkOOQ36wpBoX7gUcGciLExUYftrvIALezfINIyvhvVqdhopAbt1pDWYgqsp\n9KogTd3t4c12hfva7zZ0tG12KxpDhqAoeM/4OGULMxH8xUQlEh7BtkDtAoGAcs5i\nPfGoxDK/ARDTVeXQCWsSRA2fI6tRQdNyfWFoZ+dP2P/jcvAaA7ZCAVCBdqpI3H6Q\nt52nCvuUAD8uCXOKnLXRnMJmurzt9wZ8SJw3+Mr10V3tgpqI6nAAN6GISS3FnXef\ndBd2QELQLEwfQmAt/NNpiGC6P3ZOlLeWj5t/oR8CgYBHCsL4EFM6DdGRZhEAT/Pz\n3dcKo0ndGcC6WxTkQCYd7FvqG9fbDq18a/xMC73ehnNnhbvz2E4s872pEbd5/6q1\nTgmgnczWBf180C93vg9lzSI3CjWT8we76y45TukBaxrJ9SeIbcI89iy6fSEOaKNL\nqFdZpoP2Sh5O4EjZbGxD4g==\n-----END PRIVATE KEY-----\n",
//                 [
//                     "https://www.googleapis.com/auth/spreadsheets",
//                     "https://www.googleapis.com/auth/drive",
//                 ]
//             )

//             client.authorize(function (err: any) {
//                 if (err) {
//                     console.log("We have an error ;(")
//                     console.log(err)
//                     return
//                 } else {
//                     console.log("Connected to sheets")
//                 }
//             })

//             const sheets = google.sheets({ version: "v4", auth: client })

//             let currSheet = sheets.spreadsheets.get({
//                 spreadsheetId: sheetId,
//                 auth: client,
//             })
//             res.send({ success: true, url: currSheet.data.spreadsheetUrl })
//         } else {
//             res.status(400).send({ success: false, msg: "No Current Sheet" })
//         }
//     } else {
//         res.status(400).send({ success: false, msg: "Form not found" })
//     }
// }
