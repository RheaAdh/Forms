import { Response, Request } from "express";
import * as mongo from "../config/mongo";
//import form from "../models/question";

export async function addQuestion(req: Request, res: Response) {
  await mongo.connectMongo();

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
