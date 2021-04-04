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
import { isValidUser } from "./user";
const router = express.Router();
router.get("/helloworld",isValidUser, helloWorld);
router.get("/db",isValidUser, dbTesting);

router.get("/getforms",isValidUser, getForms);
router.get("/getform/:formid",isValidUser, getForm);
router.post("/addform",isValidUser, addForm);
router.put("/updateform",isValidUser, updateForm);
router.delete("/deleteform",isValidUser, deleteForm);

router.get("/getquestions",isValidUser, getQuestions);
router.get("/getquestion/:qid",isValidUser, getQuestion);
router.get("/getquestionsbyformid/:formid",isValidUser, getQuestionsByFormid);
router.post("/addquestion",isValidUser, addQuestion);
router.put("/updatequestion",isValidUser, updateQuestion);
router.delete("/deletequestion",isValidUser, deleteQuestion);

router.post("/addresponse",isValidUser, addResponse);
router.delete("/deleteresponse/:answer_id",isValidUser, deleteResponse);


export default router;
