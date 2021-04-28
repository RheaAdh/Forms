import express, { Response, Request } from "express"
import { helloWorld, dbTesting } from "./helloworld"
import { deleteForm, addForm, getForms, getForm, updateForm } from "./form"
import {
    addQuestion,
    deleteQuestion,
    getQuestions,
    getQuestion,
    getQuestionsByFormid,
    updateQuestion,
} from "./question"
import { isValidAdmin, isValidSuperAdmin } from "./adminuser"
import {
    submitResponse,
    getResponsesByForm,
    getFormsByCreator,
} from "./response"
const router = express.Router()

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

//------------------ SUPERADMIN TESTING WITH AUTH------------------

//tested
router.get("/helloworld", isValidSuperAdmin, helloWorld)
router.get("/db", isValidSuperAdmin, dbTesting)

router.get("/getforms", isValidSuperAdmin, getForms)
router.get("/getform/:formid", isValidSuperAdmin, getForm)
router.post("/addform", isValidSuperAdmin, addForm)
router.get("/getquestions", isValidSuperAdmin, getQuestions)
router.get("/getquestion/:qid", isValidSuperAdmin, getQuestion)
router.get(
    "/getquestionsbyformid/:formid",
    isValidSuperAdmin,
    getQuestionsByFormid
)

router.get("/formsbycreator/:creatorId", isValidSuperAdmin, getFormsByCreator)
router.get("/resbyformid/:formId", isValidSuperAdmin, getResponsesByForm)

//middleware not needed(general route)
router.post("/submitresponse", submitResponse)

//havent tested from backend for middleware functionality
router.put("/updateform", updateForm)
router.delete("/deleteform", deleteForm)

router.post("/addquestion", addQuestion)
router.put("/updatequestion", updateQuestion)
router.delete("/deletequestion", deleteQuestion)

//------------------ ADMIN TESTING WITH AUTH------------------
//TO DO ROUTES

// router.get("/getmyforms", isValidAdmin, getMyForms)
// router.get("/getmyform/:formid", isValidAdmin, getMyForm)
// router.post("/addmyform", isValidAdmin, addMyForm)
// router.get("/getmyquestions", isValidAdmin, getMyQuestions)
// router.get("/getmyquestion/:qid", isValidAdmin, getMyQuestion)
// router.get(
//     "/getmyquestionsbyformid/:formid",
//     isValidAdmin,
//     getMyQuestionsByFormid
// )

// router.get("/resbymyformid/:formId", isValidAdmin, getResponsesByMyForm)

// //havent tested from backend for middleware functionality
// router.put("/updatemyform", updateMyForm)
// router.delete("/deletemyform", deleteMyForm)

// router.post("/addmyquestion", addMyQuestion)
// router.put("/updatemyquestion", updateMyQuestion)
// router.delete("/deletemyquestion", deleteMyQuestion)

export default router






//------------------TESTING WITHOUT AUTH------------------
// router.get("/helloworld", helloWorld)
// router.get("/db", dbTesting)

// router.get("/getforms", getForms)
// router.get("/getform/:formid", getForm)
// router.post("/addform", addForm)
// router.put("/updateform", updateForm)
// router.delete("/deleteform", deleteForm)

// router.get("/getquestions", getQuestions)
// router.get("/getquestion/:qid", getQuestion)
// router.get("/getquestionsbyformid/:formid", getQuestionsByFormid)
// router.post("/addquestion", addQuestion)
// router.put("/updatequestion", updateQuestion)
// router.delete("/deletequestion", deleteQuestion)

// router.post("/submitresponse", submitResponse)
// router.get("/formsbycreator/:creatorId", getFormsByCreator)
// router.get("/resbyformid/:formId", getResponsesByForm)
