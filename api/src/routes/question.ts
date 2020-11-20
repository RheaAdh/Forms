import { Response, Request } from "express";
import * as mongo from "../config/mongo";
import {
  Question,
  shortQuestion,
  paragraphQuestion,
  mcqQuestion,
  checkboxQuestion,
  dropdownQuestion,
} from "../models/question";
import { Form } from "../models/form";

export async function addQuestion(req: Request, res: Response) {
  await mongo.connectMongo();

  let {
    formid,
    question_type,
    question_text,
    description,
    required,
    options,
  } = req.body;

  //?FIND FORM

  let form: any;
  try {
    form = await Form.findById(formid);
  } catch (error) {
    console.error(error);
  }

  const common = {
    question_text: question_text,
    description: description,
    required: required,
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

    case "mcq-answer": {
      newQuestion = new mcqQuestion({ ...common, options: [...options] });
      break;
    }

    case "checkbox-answer": {
      newQuestion = new checkboxQuestion({ ...common, options: [...options] });
      break;
    }

    case "dropdown-answer": {
      newQuestion = new dropdownQuestion({ ...common, options: [...options] });
      break;
    }

    default:
      newQuestion = new Question({ ...common });
  }

  try {
    await newQuestion.save();
    console.log("Questoin saved!!");
  } catch (error) {
    console.log("Couldnt save question");
  }

  form.questions.push(newQuestion);

  try {
    await form.save();
    console.log("Form saved!!");
  } catch (error) {
    console.log("Couldnt save form");
  }

  res.json(newQuestion);

  // let formid=req.body.form_id;
  // let qid=req.body.q_id;
  // let qtype=req.body.q_type;
  // let answeroptions=req.body.answerOptions;
  // let answercolumns=req.body.answerColumns;

  // if(!formid) {
  //   return {"status":"false", message: "invalid formid"}
  // }
  // if(!qid) {
  //   return {"status":"false", message: "invalid q_id"}
  // }
  // if(!qtype) {
  //   return {"status":"false", message: "invalid q_type"}
  // }
  // if(!answeroptions) {
  //   return {"status":"false", message: "invalid answerOptions"}
  // }
  // if(!answercolumns) {
  //   return {"status":"false", message: "invalid answerColumns"}
  // }

  // if(qid&&formid&&qtype&&answercolumns&&answeroptions){
  //   const newQuestion =new form({
  //     form_id:formid,
  //     q_id:qid,
  //     q_type:qtype,
  //     answerOptions:answeroptions,
  //     answerColumns:answercolumns
  // })

  //   await newQuestion.save((err)=>{
  //     if(err) throw err;
  //     res.json({
  //       success:true
  //     })
  //   });
  //   res.send("Question added");
  // }
}
export async function deleteQuestion(req: Request, res: Response) {
  await mongo.connectMongo();
  // form.deleteOne({q_id:req.body.q_id},(err)=>{
  //   if(err) throw err
  //   res.json({
  //     success:true
  //   })
  // })
}
