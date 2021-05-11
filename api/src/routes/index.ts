import express, { Response, Request } from "express"
import { helloWorld, dbTesting } from "./helloworld"
import { isValidAdmin, isValidSuperAdmin } from "./adminuser"
import {
    deleteForm,
    addForm,
    getForms,
    getForm,
    updateForm,
    getAdminForms,
    getSuperAdminForms,
    closeForm,
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
import {
    submitResponse,
    getResponsesByForm,
    getFormsByCreator,
    downloadResponse,
    getResponsesByIndividualByFormId,
    getResponsesByQuestionsByForm,
    getResponseIdByFormFilled,
} from "./response"
import {checkAuthentication} from "./user"
const router = express.Router()

///////////////////////ADMIN AND SUPERADMIN/////////////////////////////////
router.get("/getforms", isValidAdmin, getForms)
router.put("/updateform", isValidAdmin, updateForm)
router.post("/addform", isValidAdmin, addForm)
router.delete("/deleteform", isValidAdmin, deleteForm)
router.put("/formclose/:formId", isValidAdmin, closeForm)
router.get("/getmyquestions", isValidAdmin, getMyQuestions)
router.post("/addquestion", isValidAdmin, addQuestion)
router.put("/updatequestion", isValidAdmin, updateQuestion)
router.delete("/deletequestion", isValidAdmin, deleteQuestion)
router.get(
    "/getmyquestionsbyformid/:formid",
    isValidAdmin,
    getQuestionsByFormid
)

router.get("/resbyformid/:formId", isValidAdmin, getResponsesByForm)
router.get(
    "/responsesidbyformfilled/:formId",
    isValidAdmin,
    getResponseIdByFormFilled
)

///////////////////////////SUPERADMIN////////////////////////////////

router.get("/getadminforms", isValidSuperAdmin, getAdminForms)
router.get("/getsuperadminforms", isValidSuperAdmin, getSuperAdminForms)
router.get("/formsbycreator/:creatorId", isValidSuperAdmin, getFormsByCreator)

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

///////////////////////////ALL///////////////////////////////
router.get("/getquestions", getQuestions)
router.get("/getquestion/:qid", getQuestion)
router.get("/getquestionsbyformid/:formid", getQuestionsByFormid)
router.post("/submitresponse", submitResponse)

///////////////////////////USER,ADMIN AND SUPERADMIN///////////////////////////////
router.get("/getform/:formid", checkAuthentication, getForm)

//Covert to .csv and download route
router.get("/download/:formid", downloadResponse)

export default router
