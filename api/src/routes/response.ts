import { Response, Request } from "express";
import * as mongo from "../config/mongo";
import { Answer } from "../models/answer";

export async function addResponse(req: Request, res: Response) {
  await mongo.connectMongo();

  // let formid = req.body.form_id;
  // let qid = req.body.q_id;
  // let answerid = req.body.answer_id;
  // let uid = req.body.u_id;
  // let optionNumber = req.body.optionNumber;
  // let answerBody = req.body.answerBody;

  // if (!formid) {
  //   return { status: "false", message: "invalid formid" };
  // }
  // if (!qid) {
  //   return { status: "false", message: "invalid q_id" };
  // }
  // if (!answerid) {
  //   return { status: "false", message: "invalid answer_id" };
  // }
  // if (!uid) {
  //   return { status: "false", message: "invalid u_id" };
  // }
  // if (!answerBody) {
  //   return { status: "false", message: "invalid answerBody" };
  // }
  // if (!optionNumber) {
  //   return { status: "false", message: "invalid optionNumber" };
  // }

  // if (qid && formid && answerBody && uid && answerid) {
  //   const newResponse = new answer({
  //     form_id: formid,
  //     q_id: qid,
  //     answer_id: answerid,
  //     u_id: uid,
  //     answerBody: answerBody,
  //     optionNumber: optionNumber,
  //   });

  //   await newResponse.save((err) => {
  //     if (err) throw err;
  //     res.json({
  //       success: true,
  //     });
  //   });
  //   res.send("Response saved");
  // }
}
export async function deleteResponse(req: Request, res: Response) {
  // await mongo.connectMongo();
  // answer.deleteOne({ answer_id: req.body.answer_id }, (err) => {
  //   if (err) throw err;
  //   res.json({
  //     success: true,
  //   });
  // });
}
