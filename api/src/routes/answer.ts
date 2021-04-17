import { Response, Request } from 'express';
import * as mongo from '../config/mongo';
import { Form } from '../models/form';

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
} from '../models/answer';

export async function sendAnswer(req: Request, res: Response) {
    await mongo.connectMongo();

    let { formId, questionId, answer_type, answer_text } = req.body;

    //?FIND FORM

    let form: any;
    try {
        form = await Form.findById(formId);
        console.log(form);
        console.log('Form found');
    } catch (error) {
        console.log('cannot');
    }

    const common = {
        formId: formId,
        answer_text: answer_text,
        answer_type: answer_type,
        questionId: questionId,
    };
    

    let newAnswer;

    switch (answer_type) {
        case 'shortanswer': {
            console.log('Inside');
            newAnswer = new shortAnswer({ ...common });
            break;
        }

        case 'paragraphanswer': {
            newAnswer = new paragraphAnswer({ ...common });
            break;
        }

        case 'emailanswer': {
            newAnswer = new emailAnswer({ ...common });
            break;
        }

        case 'mcqanswer': {
            newAnswer = new mcqAnswer({
                ...common,
                selectedOption:req.body.option
            });
            break;
        }

        case 'checkboxanswer': {
            const options = req.body.options
            newAnswer = new checkboxAnswer({
                ...common,
                ...options
            });
            break;
        }

        case 'dropdownanswer': {
            newAnswer = new dropdownAnswer({
                ...common,
                selectedOption:req.body.option
            });
            break;
        }

        case 'linearscaleanswer': {
            newAnswer = new linearscaleAnswer({
                ...common,
                selectedOption:req.body.option
                //     lowRating: lowRating,
                //     highRating: highRating,
                //     lowRatingLabel: lowRatingLabel,
                //     highRatingLabel: highRatingLabel,
            });
            break;
        }

        case 'multiplechoicegridanswer': {
            const options = req.body.options
            newAnswer = new multiplechoicegridAnswer({
                ...common,
                ...options
                // rowLabel: rowLabel,
                //     colLabel: colLabel,
            });
            break;
        }

        case 'checkboxgridanswer': {
            const options = req.body.options
            newAnswer = new checkboxgridAnswer({
                ...common,
                ...options,
                // rowLabel: rowLabel,
                // colLabel: colLabel,
            });
            break;
        }

        case 'dateanswer': {
            newAnswer = new dateAnswer({ ...common });
            break;
        }

        case 'timeanswer': {
            newAnswer = new timeAnswer({
                 ...common,
                 timeHours:req.body.timeHours,
                 timeMinutes:req.body.timeMinutes
             });
            break;
        }

        default:
            newAnswer = new Answer({ ...common });
    }

    console.log(newAnswer);

    try {
        await newAnswer.save();
        console.log('Answer saved!!');
    } catch (error) {
        console.log('Couldnt save Answer :(');
    }

    form.answers.push(newAnswer);
    try {
        await form.save();
        console.log('Form saved!!');
    } catch (error) {
        console.log('Couldnt save form');
    }

    res.send({success:true,data:"Answered Stored"});
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
