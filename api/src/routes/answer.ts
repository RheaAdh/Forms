import { Response, Request } from "express";
import * as mongo from "../config/mongo";
import { Form } from "../models/form";

import {
    Answer,
    shortAnswer,
    paragraphAnswer,
    emailAnswer,
    mcqAnswer,
    checkboxAnswer,
    dropdownAnswer,
    linearscaleAnswer,
    multiplechoicegridAnswer,
    checkboxgridAnswer,
    dateAnswer,
    timeAnswer,
} from "../models/answer";

export async function sendAnswer(req: Request, res: Response) {
    await mongo.connectMongo();

    let { formId, questionId, answer_type, answer_text } = req.body;

    //?FIND FORM

    let form: any;
    try {
        form = await Form.findById(formId);
        console.log(form);
    } catch (error) {
        console.log("cannot");
    }

    const common = {
        formid: formId,
        answer_text: answer_text,
        answer_type: answer_type,
        questionId: questionId,
    };

    let newAnswer;

    switch (answer_type) {
        case "short-answer": {
            // newAnswer = new shortAnswer({ ...common });
            // break;
        }

        case "paragraph-answer": {
            // newAnswer = new paragraphAnswer({ ...common });
            // break;
        }

        case "email-answer": {
            // newAnswer = new emailAnswer({ ...common });
            // break;
        }

        case "mcq-answer": {
            // newAnswer = new mcqAnswer({ ...common, options: [...options] });
            // break;
        }

        case "checkbox-answer": {
            // newAnswer = new checkboxAnswer({
            //     ...common,
            //     options: [...options],
            // });
            // break;
        }

        case "dropdown-answer": {
            // newAnswer = new dropdownAnswer({
            //     ...common,
            //     options: [...options],
            // });
            // break;
        }

        case "linearscale-answer": {
            // newAnswer = new linearscaleAnswer({
            //     ...common,
            //     lowRating: lowRating,
            //     highRating: highRating,
            //     lowRatingLabel: lowRatingLabel,
            //     highRatingLabel: highRatingLabel,
            // });
            // break;
        }

        case "multiplechoicegrid-answer": {
            // newAnswer = new multiplechoicegridAnswer({
            //     ...common,
            //     rowLabel: rowLabel,
            //     colLabel: colLabel,
            // });
            // break;
        }

        case "checkboxgrid-answer": {
            // newAnswer = new checkboxgridAnswer({
            //     ...common,
            //     rowLabel: rowLabel,
            //     colLabel: colLabel,
            // });
            // break;
        }

        case "date-answer": {
            // newAnswer = new dateAnswer({ ...common });
            // break;
        }

        case "time-answer": {
            // newAnswer = new timeAnswer({ ...common });
            // break;
        }

        default:
        // newAnswer = new Answer({ ...common });
    }
    console.log(newAnswer);
    console.log(questionId);

    // try {
    //     await newAnswer.save();
    //     console.log("Answer saved!!");
    // } catch (error) {
    //     console.log("Couldnt save Answer :(");
    // }

    // form.Answers.push(newAnswer);

    // try {
    //     await form.save();
    //     console.log("Form saved!!");
    // } catch (error) {
    //     console.log("Couldnt save form");
    // }

    // res.json(newAnswer);
}
// export async function updateAnswer(req: Request, res: Response) {
//     await mongo.connectMongo();
//     console.log(req.body);
//     const moddedBody = { ...req.body };
//     moddedBody["answer-type"] = req.body["answer-type"];
//     console.log({ moddedBody });

//     let updatedAnswer;
//     try {
//         updatedAnswer = await Answer.findOneAndUpdate(
//             { _id: req.body._id },
//             {
//                 ...moddedBody,
//             },
//             { new: true }
//         );
//         res.send(updatedAnswer);
//     } catch (error) {
//         res.send(error);
//     }
// }
