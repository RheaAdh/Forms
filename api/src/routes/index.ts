import express, { Response, Request } from "express"
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
    extractFormid,
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
    getResponsesByResIdByFormId,
    getResponsesByQuestionsByForm,
    getResponseIdByFormFilled,
    getResponseByBothFormidAndResponseid,
} from "./response"
import { checkAuthentication } from "./user"
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
router.get(
    "/formresponse/:formId/:responseId",
    getResponseByBothFormidAndResponseid
)

///////////////////////////SUPERADMIN////////////////////////////////

router.get("/getadminforms", isValidSuperAdmin, getAdminForms)
router.get("/getsuperadminforms", isValidSuperAdmin, getSuperAdminForms)
router.get("/formsbycreator/:creatorId", isValidSuperAdmin, getFormsByCreator)

router.get(
    "/resbyresponseid/:responseid",
    isValidAdmin,
    getResponsesByResIdByFormId
)
//since question id is unique to a form so no need to have formid as param
router.get(
    "/resbyquestions/:questionId",
    isValidAdmin,
    getResponsesByQuestionsByForm
)

///////////////////////////USER,ADMIN AND SUPERADMIN///////////////////////////////
router.get("/getform/:formid", extractFormid, checkAuthentication, getForm)
router.get("/getquestions", checkAuthentication, getQuestions)
router.get("/getquestion/:qid", checkAuthentication, getQuestion)
router.get(
    "/getquestionsbyformid/:formid",
    checkAuthentication,
    getQuestionsByFormid
)
router.post("/submitresponse", checkAuthentication, submitResponse)

//Covert to .csv and download route
router.get("/download/:formid", downloadResponse)

export default router
