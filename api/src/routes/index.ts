import express, { Response, Request } from "express"
import {
    isValidAdmin,
    isValidSuperAdmin,
    getAllAdmins,
    verifyEmail,
    resendEmailVerificationLink,
} from "./adminuser"
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
    makeTemplate,
    useTemplate,
    viewAllTempalates,
    getFormForResponse,
    updateeditor,
    updateLinkId,
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
    getResponsebyRespid,
} from "./response"
import {
    getAllThemes,
    getTheme,
    addTheme,
    deleteTheme,
    useTheme,
    updateTheme,
} from "./theme"
import { checkAuthentication, isAnonymous } from "./user"
import { writeToNewSheet } from "./googlesheet"
import { getCssDisplayForm, getCssMain } from "./css/css"

const router = express.Router()

///////////////////////ADMIN AND SUPERADMIN/////////////////////////////////
router.post("/addtheme", addTheme)
router.get("/allthemes", getAllThemes)
router.get("/theme/:themeId", getTheme)
router.delete("/deletetheme", deleteTheme)
router.put("/usetheme/:formId", useTheme)
router.put("/updatetheme/:themeId", updateTheme)

// router.post("/addtheme", isValidAdmin, addTheme)
// router.get("/allthemes", isValidAdmin, getAllThemes)
// router.get("/theme/:themeId", isValidAdmin, getTheme)
// router.delete("/deletetheme", isValidAdmin, deleteTheme)
// router.put("/usetheme/:formId", isValidAdmin, useTheme)
// router.put("/updatetheme/:themeId", isValidAdmin, updateTheme)

router.get("/getforms", isValidAdmin, getForms)
router.put("/updateform/:formId", isValidAdmin, updateForm)
router.post("/addform", isValidAdmin, addForm)
router.delete("/deleteform", isValidAdmin, deleteForm)
router.put("/formclose/:formId", isValidAdmin, closeForm)
router.get("/getmyquestions", isValidAdmin, getMyQuestions)
router.post("/addquestion", isValidAdmin, addQuestion)
router.put("/updatequestion", isValidAdmin, updateQuestion)
router.delete("/deletequestion", isValidAdmin, deleteQuestion)
router.get(
    "/getmyquestionsbyformid/:formId",
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
    isValidAdmin,
    getResponseByBothFormidAndResponseid
)

router.get("/getadminforms", isValidAdmin, getAdminForms)
router.get("/formsbycreator/:creatorId", isValidAdmin, getFormsByCreator)
router.get(
    "/resbyresponseid/:responseid",
    isValidAdmin,
    getResponsesByResIdByFormId
)
router.get(
    "/resbyquestions/:questionId",
    isValidAdmin,
    getResponsesByQuestionsByForm
)
router.get("/download/:formId", isValidAdmin, downloadResponse)
router.post("/updateeditor", isValidAdmin, updateeditor)
router.put("/updateLinkId", isValidAdmin, updateLinkId)
router.get("/getadmins", isValidAdmin, getAllAdmins)
router.get("/makeTemplate/:formId", isValidAdmin, makeTemplate)
router.get("/useTemplate/:formId", isValidAdmin, useTemplate)
router.get("/viewAllTemplates", isValidAdmin, viewAllTempalates)
router.get("/createnewsheet/:formId",isValidAdmin, writeToNewSheet)


///////////////////////////SUPERADMIN ONLY////////////////////////////////
router.get("/getsuperadminforms", isValidSuperAdmin, getSuperAdminForms)

///////////////////////////USER,ADMIN AND SUPERADMIN///////////////////////
router.get("/getform/:formId", checkAuthentication, getForm)
router.get("/getanonymity/:formId", isAnonymous)
router.get("/getformforresp/:formId", checkAuthentication, getFormForResponse)
router.get("/getquestions", checkAuthentication, getQuestions)
router.get("/getquestion/:qid", checkAuthentication, getQuestion)
router.post(
    "/getquestionsbyformid/:formId",
    checkAuthentication,
    getQuestionsByFormid
)
router.post("/submitresponse/:formId", checkAuthentication, submitResponse)

////////////////////NO-AUTH///////////////////////////////////////////////////

// http://localhost:7000/api/emailverification/token
router.get("/emailverification/:token", verifyEmail)
//To view emailed responses
router.get("/response/:respid", getResponsebyRespid)
// http://localhost:7000/api/emailreverify
router.get("/emailreverify", resendEmailVerificationLink)

//Sending CSS File for Email
router.get("/css/main", getCssMain)
router.get("/css/displayform", getCssDisplayForm)

export default router
