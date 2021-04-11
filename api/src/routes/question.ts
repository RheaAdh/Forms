import { Response, Request } from "express";
import * as mongo from "../config/mongo";
import {
  Question,
  shortQuestion,
  paragraphQuestion,
  mcqQuestion,
  checkboxQuestion,
  dropdownQuestion,
  linearscaleQuestion,
  multiplechoicegridQuestion,
  checkboxgridQuestion,
  dateQuestion,
  timeQuestion,
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
    form = await Form.findById(formid);
  } catch (error) {
    console.error(error);
  }

  const common = {
    formid: formid,
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
  let moddedBody = {...req.body}
  moddedBody["question-type"] = req.body["question-type"]
  let updatedQuestion;
  try {
    // Update by finding Question, so that question type can be changed
    updatedQuestion = await Question.findOneAndUpdate(
      {_id : req.body._id},
      {
        "question-type" : req.body["question-type"]
      },
      {new : true}
    )
    // Update by finding exact question type, else options won't get updated
    switch(moddedBody["question-type"]){
      case "short-answer":
        updatedQuestion = await shortQuestion.findOneAndUpdate(
          {_id : req.body._id},
          {
            ...moddedBody
          } ,
          {new : true}
        )
        break;
        case "paragraph-answer":
          updatedQuestion = await paragraphQuestion.findOneAndUpdate(
            {_id : req.body._id},
            {
              ...moddedBody
            } ,
            {new : true}
          )
          break;
      case "mcq-answer":
        updatedQuestion = await mcqQuestion.findOneAndUpdate(
          {_id : req.body._id},
          {
            ...moddedBody
          } ,
          {new : true}
        )
        break;
      case "checkbox-answer":
        updatedQuestion = await checkboxQuestion.findOneAndUpdate(
          {_id : req.body._id},
          {
            ...moddedBody
          } ,
          {new : true}
        )
        break;
      case "dropdown-answer":
        updatedQuestion = await dropdownQuestion.findOneAndUpdate(
          {_id : req.body._id},
          {
            ...moddedBody
          } ,
          {new : true}
        )
        break;
      case "linearscale-answer":
        updatedQuestion = await linearscaleQuestion.findOneAndUpdate(
          {_id : req.body._id},
          {
            ...moddedBody
          } ,
          {new : true}
        )
        break;
      case "multiplechoicegrid-answer":
        updatedQuestion = await multiplechoicegridQuestion.findOneAndUpdate(
          {_id : req.body._id},
          {
            ...moddedBody
          } ,
          {new : true}
        )
        break;   
      case "checkboxgrid-answer":  
        updatedQuestion = await checkboxgridQuestion.findOneAndUpdate(
          {_id : req.body._id},
          {
            ...moddedBody
          } ,
          {new : true}
        )
        break;
      case "date-answer":
        updatedQuestion = await dateQuestion.findOneAndUpdate(
          {_id : req.body._id},
          {
            ...moddedBody
          } ,
          {new : true}
        )
        break;
      case "time-answer":
        updatedQuestion = await timeQuestion.findOneAndUpdate(
          {_id : req.body._id},
          {
            ...moddedBody
          } ,
          {new : true}
        )
        break;
      default:
        updatedQuestion = {data:{msg : "Something went wrong"}}
    }
    console.log(updatedQuestion)
    res.send(updatedQuestion);
    }
   catch (error) {
    res.send(error);
  }
}

export async function deleteQuestion(req: Request, res: Response) {
  await mongo.connectMongo();
  try {
    await Question.findByIdAndDelete(req.body.id);
    await Form.findByIdAndUpdate(req.body.formid, {$pull : {questions : req.body.id}})
    res.send("Deleted successfully");
  } catch (error) {
    res.end("You messed up.... again");
    console.error(error);
  }
  //   , (err) => {
  //   if (err) throw err;
  //   res.json({
  //     success: true,
  //   });
  // });
}
