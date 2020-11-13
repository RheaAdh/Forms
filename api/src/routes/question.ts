import { Response, Request } from "express";
import * as mongo from "../config/mongo";
import question from "../models/question";

export async function addQuestion(req: Request, res: Response) {
  await mongo.connectMongo();

  let formid=req.body.form_id;
  let qid=req.body.q_id;
  let qtype=req.body.q_type;
  let answeroptions=req.body.answerOptions;
  let answercolumns=req.body.answerColumns;

  if(!formid) {
    return res .send({"status":"false", message: "invalid formid"})    
  }
  if(!qid) {
    return res.send({"status":"false", message: "invalid q_id"})   
  }
  if(!qtype) {
    return res.send({"status":"false", message: "invalid q_type"})    
  }
  if(!answeroptions) {
    return res.send({"status":"false", message: "invalid answerOptions"} )   
  }
  if(!answercolumns) {
    return res.send({"status":"false", message: "invalid answerColumns"} )   
  }

  if(qid&&formid&&qtype&&answercolumns&&answeroptions){
    const newQuestion =new question({
      form_id:formid,
      q_id:qid,
      q_type:qtype,
      answerOptions:answeroptions,
      answerColumns:answercolumns
  })
  
    await newQuestion.save((err)=>{
      if(err) throw err;
      res.send({
        success:true,
        msg:"added question"
      })
    });
  }
}
export async function deleteQuestion(req: Request, res: Response) {
  await mongo.connectMongo();
  question.deleteOne({q_id:req.body.q_id},(err)=>{
    if(err) throw err
    res.json({
      success:true,
      msg:"deleted question"
    })
  })
}
export async function viewQuestion(req: Request, res: Response) {
  await mongo.connectMongo();
  question.findOne({q_id:req.body.q_id},(err)=>{
    if(err) return res.send({success:false, msg: err})
    res.json({
      success:true,
      msg:"view question"
    })
  })
}

