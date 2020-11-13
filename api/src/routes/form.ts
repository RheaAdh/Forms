import { Response, Request } from "express";
import * as mongo from "../config/mongo";
import form from "../models/form";

export async function addForm(req: Request, res: Response) {
  await mongo.connectMongo();

  let formid=req.body.form_id;
  let bgimg=req.body.bg_img;
  let file=req.body.file;

  if(!formid) {
    return res.send({"status":"false", message: "invalid form_id"}    )
  }
  if(!bgimg) {
    return res.send({"status":"false", message: "invalid bg_img"}    )
  }
  if(!file) {
    return res.send({"status":"false", message: "invalid file"}   ) 
  }

  if(file&&formid&&bgimg){
    const newForm =new form({
      form_id:formid,
      bg_img:bgimg,
      file:file
  })
    await newForm.save((err)=>{
      if(err) return res.send({success:false, msg: err})
      res.json({
        success:true,
        msg:"Form added"
      })
    });
  }
}
export async function deleteForm(req: Request, res: Response) {
  await mongo.connectMongo();
  form.deleteOne({form_id:req.body.form_id},(err)=>{
    if(err) return res.send({success:false, msg: err})
    res.json({
      success:true,
      msg:"deleted form"
    })
  })
}
export async function viewForm(req: Request, res: Response) {
  await mongo.connectMongo();
  form.findOne({form_id:req.body.form_id},(err)=>{
    if(err) return res.send({success:false, msg: err})
    res.json({
      success:true,
      msg:"view form"
    })
  })
}