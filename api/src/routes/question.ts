import { Response, Request } from "express";
import * as mongo from "../config/mongo";
import { Form } from "../models/form";
import {
  Question,
  shortQuestion,
  paragraphQuestion,
  emailQuestion,
  mcqQuestion,
  checkboxQuestion,
  dropdownQuestion,
  linearscaleQuestion,
  multiplechoicegridQuestion,
  checkboxgridQuestion,
  dateQuestion,
  timeQuestion,
} from "../models/question";

export async function addQuestion(req: Request, res: Response) {
  await mongo.connectMongo();
  console.log(req.body);

  let {
    formId,
    question_type,
    question_text,
    required,
    options,
    lowRating,
    highRating,
    lowRatingLabel,
    highRatingLabel,
    rowLabel,
    colLabel,
  } = req.body;

  //?FIND FORM

  let form: any;
  try {
    form = await Form.findById(formId);
    console.log(form);
    console.log("Form found");
  } catch (error) {
    console.error(error);
  }

  const common = {
    formid: formId,
    question_text: question_text,
    question_type: question_type,
    required: false,
  };

  let newQuestion;

  switch (question_type) {
    case "short-answer": {
      newQuestion = new shortQuestion({ ...common });
      break;
    }

    case "paragraph-answer": {
      newQuestion = new paragraphQuestion({ ...common });
      break;
    }

    case "email-answer": {
      newQuestion = new emailQuestion({ ...common });
      break;
    }

    case "mcq-answer": {
      newQuestion = new mcqQuestion({ ...common, options: [...options] });
      break;
    }

    case "checkbox-answer": {
      newQuestion = new checkboxQuestion({
        ...common,
        options: [...options],
      });
      break;
    }

    case "dropdown-answer": {
      newQuestion = new dropdownQuestion({
        ...common,
        options: [...options],
      });
      break;
    }

    case "linearscale-answer": {
      newQuestion = new linearscaleQuestion({
        ...common,
        lowRating: lowRating,
        highRating: highRating,
        lowRatingLabel: lowRatingLabel,
        highRatingLabel: highRatingLabel,
      });
      break;
    }

    case "multiplechoicegrid-answer": {
      newQuestion = new multiplechoicegridQuestion({
        ...common,
        rowLabel: rowLabel,
        colLabel: colLabel,
      });
      break;
    }

    case "checkboxgrid-answer": {
      newQuestion = new checkboxgridQuestion({
        ...common,
        rowLabel: rowLabel,
        colLabel: colLabel,
      });
      break;
    }

    case "date-answer": {
      newQuestion = new dateQuestion({ ...common });
      break;
    }

    case "time-answer": {
      newQuestion = new timeQuestion({ ...common });
      break;
    }

    default:
      newQuestion = new Question({ ...common });
  }

  try {
    await newQuestion.save();
    console.log("Question saved!!");
  } catch (error) {
    console.log(error);
    console.log("Couldnt save question :(");
  }

  form.questions.push(newQuestion);

  try {
    await form.save();
    console.log("Form saved!!");
  } catch (error) {
    console.log("Couldnt save form");
  }

  res.json(newQuestion);
}

export async function getQuestions(req: Request, res: Response) {
  await mongo.connectMongo();

  const questions = await Question.find().exec();
  res.json(questions);
}

export async function getQuestion(req: Request, res: Response) {
  await mongo.connectMongo();

  const question = await Question.findById(req.params.qid);

  res.json(question);
}

export async function getQuestionsByFormid(req: Request, res: Response) {
  await mongo.connectMongo();

  const questions = await Question.find({ formid: req.params.formid });
  res.json(questions);
}

export async function updateQuestion(req: Request, res: Response) {
  await mongo.connectMongo();
  console.log(req.body);
  const moddedBody = { ...req.body };
  moddedBody["question-type"] = req.body["question-type"];
  console.log({ moddedBody });

  let updatedQuestion;
  try {
    updatedQuestion = await Question.findOneAndUpdate(
      { _id: req.body._id },
      {
        ...moddedBody,
      },
      { new: true }
    );
    res.send(updatedQuestion);
  } catch (error) {
    res.send(error);
  }
}

export async function deleteQuestion(req: Request, res: Response) {
  await mongo.connectMongo();
  try {
    await Question.findByIdAndDelete(req.body.id);

    console.log("Deleted successfully");
  } catch (error) {
    console.log("Coudnt delete :(");
  }
}

//CHANGE TO:
// export async function deleteQuestion(req: Request, res: Response) {
//     await mongo.connectMongo();
//     try {
//       await Question.findByIdAndDelete(req.body.id);
//       await Form.findByIdAndUpdate(req.body.formid, {$pull : {questions : req.body.id}})
//       res.send("Deleted successfully");
//     } catch (error) {
//       res.end("You messed up.... again");
//       console.error(error);
//     }
//   }
