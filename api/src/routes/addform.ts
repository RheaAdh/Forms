import { Response, Request } from "express";
import * as mongo from "../config/mongo";
import form from "../models/form";

export async function addForm(req: Request, res: Response) {
  await mongo.connectMongo();

  let formid=req.body.form_id;
  let bgimg=req.body.bg_img;
  let file=req.body.file;

  if(!formid) res.send("invalid formid") ;
  if(!bgimg) res.send ("invalid bgimg");
  if(!file) res.send ("invalid file");

  if(file&&formid&&bgimg){
    const newForm =new form({
      form_id:formid,
      bg_img:bgimg,
      file:file
  })
    await newForm.save();
    res.send("form added");
  }
}
