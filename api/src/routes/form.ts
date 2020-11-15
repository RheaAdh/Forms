import { Response, Request } from "express";
import * as mongo from "../config/mongo";
import { Form } from "../models/form";

export async function addForm(req: Request, res: Response) {
  await mongo.connectMongo();

  let formid = req.body.form_id; //FOR THIS WE SHOULD USE UUID?
  let bgimg = req.body.bg_img;
  let file = req.body.file;

  // if(!formid) {
  //   return {"status":"false", message: "invalid form_id"}
  // }
  if (!bgimg) {
    return { status: "false", message: "invalid bg_img" }; // I DIDN'T EXACTLY UNDERSTAND WHY WE RETURN
  }
  if (!file) {
    return { status: "false", message: "invalid file" }; //WHAT DO WE NEED A FILE FOR?
  }

  if (file && formid && bgimg) {
    const newForm = new Form({
      form_id: formid,
      bg_img: bgimg,
      file: file,
    });
    await newForm.save((err) => {
      if (err) throw err;
      res.json({
        success: true,
      });
    });
    res.send("Form added");
  }
}
export async function deleteForm(req: Request, res: Response) {
  await mongo.connectMongo();
  Form.deleteOne({ form_id: req.body.form_id }, (err) => {
    if (err) throw err;
    res.json({
      success: true,
    });
  });
}
