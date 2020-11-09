import { Response, Request } from "express";
import * as mongo from "../config/mongo";
import form from "../models/question";

export async function addQuestion(req: Request, res: Response) {
  await mongo.connectMongo();

  let formid=req.body.form_id;
  let qid=req.body.q_id;
  let qtype=req.body.q_type;
  let answeroptions=req.body.answerOptions;
  let answercolumns=req.body.answerColumns;

  if(!formid) res.send("invalid formid") ;
  if(!qid) res.send("invalid qid") ;
  if(!qtype) res.send("invalid qtype") ;
  if(!answeroptions) res.send("invalid answeroptions") ;
  if(!answercolumns) res.send("invalid answercolumns") ;

  if(qid&&formid&&qtype&&answercolumns&&answeroptions){
    const newQuestion =new form({
      form_id:formid,
      q_id:qid,
      q_type:qtype,
      answerOptions:answeroptions,
      answerColumns:answercolumns
  })
    await newQuestion.save();
    res.send("question added");
  }
}
