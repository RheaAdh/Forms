import express, { Response, Request } from "express"
import { helloWorld, dbTesting } from "./helloworld"
import {
    deleteForm,
    addForm,
    getForms,
    getForm,
    updateForm,
    getMyForms,
} from "./form"
import {
    addQuestion,
    deleteQuestion,
    getQuestions,
    getQuestion,
    getQuestionsByFormid,
    updateQuestion,
    getMyQuestions,
} from "./question"
import { isValidAdmin, isValidSuperAdmin } from "./adminuser"
import {
    submitResponse,
    getResponsesByForm,
    getFormsByCreator,
} from "./response"
const router = express.Router()

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

//NEW ones are->  getMyQuestions,getMyForms
//OTHERS REUSED

router.get("/getmyforms", isValidAdmin, getMyForms)
router.get("/getmyform/:formid", isValidAdmin, getForm)
router.post("/addmyform", isValidAdmin, addForm)
router.get("/getmyquestions", isValidAdmin, getMyQuestions)
router.get("/getmyquestion/:qid", isValidAdmin, getQuestion)
router.get(
    "/getmyquestionsbyformid/:formid",
    isValidAdmin,
    getQuestionsByFormid
)
router.get("/resbymyformid/:formId", isValidAdmin, getResponsesByForm)
router.put("/updatemyform", isValidAdmin, updateForm)
router.delete("/deletemyform", isValidAdmin, deleteForm)
router.post("/addmyquestion", isValidAdmin, addQuestion)
router.put("/updatemyquestion", isValidAdmin, updateQuestion)
router.delete("/deletemyquestion", isValidAdmin, deleteQuestion)

export default router
