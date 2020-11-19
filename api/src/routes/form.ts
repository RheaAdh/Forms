import { Response, Request } from "express";
import * as mongo from "../config/mongo";
import { Form } from "../models/form";

export async function getForms(req: Request, res: Response) {
  await mongo.connectMongo();

  const forms = await Form.find().exec();
  res.json(forms);
}

export async function addForm(req: Request, res: Response) {
  await mongo.connectMongo();

  console.log("POST REQUEST WAS MADE");

  console.log(req.body);

  // let title = req.body.title;
  // let description = req.body.description;
  // let bgimg = req.body.bg_img;
  // let file = req.body.file;
  // let colorTheme = req.body.color_theme;

  // if(!formid) {
  //   return {"status":"false", message: "invalid form_id"}
  // }
  // if (!bgimg) {
  //   return { status: "false", message: "invalid bg_img" }; // I DIDN'T EXACTLY UNDERSTAND WHY WE RETURN
  // }
  // if (!file) {
  //   return { status: "false", message: "invalid file" }; //WHAT DO WE NEED A FILE FOR?
  // }

  //   if (file && formid && bgimg) {
  //     const newForm = new Form({
  //       form_id: formid,
  //       bg_img: bgimg,
  //       file: file,
  //     });
  //     await newForm.save((err) => {
  //       if (err) throw err;
  //       res.json({
  //         success: true,
  //       });
  //     });
  //     res.send("Form added");
  //   }
  // }

  const newForm = new Form(req.body);

  try {
    await newForm.save();
    console.log("Form added!");
    res.send("Form added");
  } catch (error) {
    res.send("Form not added");
  }
}

export async function deleteForm(req: Request, res: Response) {
  await mongo.connectMongo();
  try {
    await Form.findByIdAndDelete(req.body.id);
    res.send("Deleted successfully");
  } catch (error) {
    res.end("You fucked up.... again");
    console.error(error);
  }
  //   , (err) => {
  //   if (err) throw err;
  //   res.json({
  //     success: true,
  //   });
  // });
}