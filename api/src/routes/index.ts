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
import { sendAnswer } from "./answer";
// import { isValidAdmin } from "./adminuser";
const router = express.Router();

router.get("/helloworld", helloWorld);
// router.get("/db", isValidAdmin, dbTesting);

// //ADMIN LEVEL PROTECTED ROUTES
// router.get("/getforms", isValidAdmin, getForms);
// router.get("/getform/:formid", isValidAdmin, getForm);
// router.post("/addform", isValidAdmin, addForm);
// router.put("/updateform", isValidAdmin, updateForm);
// router.delete("/deleteform", isValidAdmin, deleteForm);

// router.get("/getquestions", isValidAdmin, getQuestions);
// router.get("/getquestion/:qid", isValidAdmin, getQuestion);
// router.get("/getquestionsbyformid/:formid", isValidAdmin, getQuestionsByFormid);
// router.post("/addquestion", isValidAdmin, addQuestion);
// router.put("/updatequestion", isValidAdmin, updateQuestion);
// router.delete("/deletequestion", isValidAdmin, deleteQuestion);

//------------------TESTING WITHOUT AUTH------------------
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

router.post("/sendAnswer", sendAnswer);

export default router;
