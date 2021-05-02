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
    getResponsesByIndividualByFormId,
    getResponsesByQuestionsByForm,
} from "./response"
const router = express.Router()

router.get("/helloworld", isValidSuperAdmin, helloWorld)
router.get("/db", isValidSuperAdmin, dbTesting)

router.get("/getforms", isValidAdmin, getForms)
router.get("/getform/:formid", isValidAdmin, getForm)
router.get("/getadminforms", isValidSuperAdmin, getAdminForms)
router.get("/getsuperadminforms", isValidSuperAdmin, getSuperAdminForms)
router.post("/addform", isValidAdmin, addForm)
router.get("/getquestions", getQuestions)
router.get("/getquestion/:qid", getQuestion)
router.get("/getquestionsbyformid/:formid", getQuestionsByFormid)

router.get("/formsbycreator/:creatorId", isValidSuperAdmin, getFormsByCreator)
router.get("/resbyformid/:formId", isValidAdmin, getResponsesByForm)

router.put("/updateform", isValidAdmin, updateForm)
router.delete("/deleteform", isValidAdmin, deleteForm)

router.post("/addquestion", isValidAdmin, addQuestion)
router.put("/updatequestion", isValidAdmin, updateQuestion)
router.delete("/deletequestion", isValidAdmin, deleteQuestion)
router.get(
    "/resbyindividual/:formId/:userId",
    isValidSuperAdmin,
    getResponsesByIndividualByFormId
)
//since question id is unique to a form so no need to have formid as param
router.get(
    "/resbyquestions/:questionId",
    isValidSuperAdmin,
    getResponsesByQuestionsByForm
)
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
router.get(
    "/resmyformbyindividual/:formId/:userId",
    isValidAdmin,
    getResponsesByIndividualByFormId
)
//since question id is unique to a form so no need to have formid as param
router.get(
    "/resbymyquestions/:questionId",
    isValidAdmin,
    getResponsesByQuestionsByForm
)


//--------------------------------------------------
//middleware not needed(general route)
router.post("/submitresponse", submitResponse)
//Covert to .csv and download route
router.get("/download/:formid", downloadResponse)

export default router
