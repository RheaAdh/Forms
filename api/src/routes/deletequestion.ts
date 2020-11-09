import { Response, Request } from "express";
import * as mongo from "../config/mongo";
import form from "../models/form";

export async function deleteQuestion(req: Request, res: Response) {
  await mongo.connectMongo();
  form.deleteOne({q_id:req.body.q_id},(err)=>{
    if(err) throw err
    res.json({
      success:true
    })
  })
}

