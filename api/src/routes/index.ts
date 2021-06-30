import express, { Response, Request } from "express"
import { isValidAdmin, isValidSuperAdmin, getAllAdmins } from "./adminuser"
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
import { checkAuthentication, isAnonymous } from "./user"

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

router.get("/getadmins", getAllAdmins)
router.get("/makeTemplate/:formId", makeTemplate)
router.get("/useTemplate/:formId", useTemplate)
router.get("/viewAllTemplates", viewAllTempalates)

///////////////////////////SUPERADMIN ONLY////////////////////////////////
router.get("/getsuperadminforms", isValidSuperAdmin, getSuperAdminForms)

///////////////////////////USER,ADMIN AND SUPERADMIN///////////////////////////////
router.get("/getform/:formId", extractFormid, checkAuthentication, getForm)
router.get("/getanonymity/:formId", isAnonymous)
router.get(
    "/getformforresp/:formId",
    extractFormid,
    checkAuthentication,
    getFormForResponse
)

//No need --> anonymous works with above, just rather than redirecting to google login, directly redirect to form from frontend for anonymous response
// router.get(
//     "/getformforresp/anonymous/:formid",
//     checkAuthentication,
//     getFormForResponse
// )

router.get("/getquestions", checkAuthentication, getQuestions)
router.get("/getquestion/:qid", checkAuthentication, getQuestion)
router.post(
    "/getquestionsbyformid/:formId",
    checkAuthentication,
    getQuestionsByFormid
)
router.post("/submitresponse", checkAuthentication, submitResponse)
router.get("/response/:respid", getResponsebyRespid)

//Covert to .csv and download route
router.get("/download/:formId", downloadResponse)

router.post("/updateeditor", updateeditor)

export default router
