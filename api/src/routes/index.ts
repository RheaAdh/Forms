import express, { Response, Request } from "express";
import { helloWorld, dbTesting } from "./helloworld";
import { deleteForm, addForm, getForms, getForm, updateForm } from "./form";
import {
  addQuestion,
  deleteQuestion,
  getQuestions,      
  getQuestion,
  getQuestionsByFormid,
  updateQuestion,
} from "./question";
import { addResponse, deleteResponse } from "./response";

const router = express.Router();
router.get("/helloworld", helloWorld);
router.get("/db", dbTesting);

router.get("/getforms", getForms);
router.get("/getform/:formid", getForm);
router.post("/addform", addForm);  
router.put("/updateform", updateForm);
router.delete("/deleteform", deleteForm);

router.get("/getquestions", getQuestions);
router.get("/getquestion/:qid", getQuestion);
router.get("/getquestionsbyformid/:formid", getQuestionsByFormid);
router.post("/addquestion", addQuestion);
router.put("/updatequestion", updateQuestion);
router.delete("/deletequestion", deleteQuestion);

router.post("/addresponse", addResponse);
router.delete("/deleteresponse/:answer_id", deleteResponse);

export default router;
