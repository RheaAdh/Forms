import { Response, Request } from "express";
import * as mongo from "../config/mongo";
import form from "../models/form";

export async function deleteForm(req: Request, res: Response) {
  await mongo.connectMongo();
  form.deleteOne({form_id:req.body.form_id},(err)=>{
    if(err) throw err
    res.json({
      success:true
    })
  })
}

