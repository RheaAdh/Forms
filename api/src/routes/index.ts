import express, { Response, Request } from "express"
import { helloWorld, dbTesting } from "./helloworld"
import { isValidAdmin, isValidSuperAdmin } from "./adminuser"
import {
    deleteForm,
    addForm,
    getForms,
    getForm,
    updateForm,
    getMyForms,
    getAdminForms,
    getSuperAdminForms,
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
//import { isValidAdmin, isValidSuperAdmin } from "./adminuser"
import {
    submitResponse,
    getResponsesByForm,
    getFormsByCreator,
    downloadResponse,
} from "./response"
const router = express.Router()

router.get("/helloworld", isValidSuperAdmin, helloWorld)
router.get("/db", isValidSuperAdmin, dbTesting)

router.get("/getforms", isValidAdmin, getForms)
router.get("/getform/:formid", isValidAdmin, getForm)
router.get("/getadminforms", isValidSuperAdmin, getAdminForms)
router.get("/getsuperadminforms", isValidSuperAdmin, getSuperAdminForms)
router.post("/addform", isValidAdmin, addForm)
router.get("/getquestions", isValidAdmin, getQuestions)
router.get("/getquestion/:qid", isValidAdmin, getQuestion)
router.get("/getquestionsbyformid/:formid", isValidAdmin, getQuestionsByFormid)

router.get("/formsbycreator/:creatorId", isValidSuperAdmin, getFormsByCreator)
router.get("/resbyformid/:formId", isValidAdmin, getResponsesByForm)

//middleware not needed(general route)
router.post("/submitresponse", submitResponse)

router.put("/updateform", isValidAdmin, updateForm)
router.delete("/deleteform", isValidAdmin, deleteForm)

router.post("/addquestion", isValidAdmin, addQuestion)
router.put("/updatequestion", isValidAdmin, updateQuestion)
router.delete("/deletequestion", isValidAdmin, deleteQuestion)

//------------------ ADMIN TESTING WITH AUTH------------------

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

//Covert to .csv and download route
router.get("/download/:formid", downloadResponse)

export default router
