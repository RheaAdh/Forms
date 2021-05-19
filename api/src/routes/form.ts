import { Document, Schema } from "mongoose"
import { Response, Request } from "express"
import * as mongo from "../config/mongo"
import { Form } from "../models/form"
import { Question } from "../models/question"
import FormResponse from "../models/response"
declare module "express-session" {
    interface Session {
        isAuth: boolean
        userId: Schema.Types.ObjectId
        role: String
        email: String
        username: String
    }
}
export async function getForms(req: Request, res: Response) {
    try {
        if (req.session.role === "admin") {
            //admin
            const myForms = await Form.find({ owner: req.session.userId })
            res.send({ success: true, forms: myForms })
        } else {
            //superadmin
            const forms = await Form.find().exec()
            res.json({ success: true, forms: forms })
        }
    } catch (error) {
        return res.send({ success: false, msg: error })
    }
}

export async function getForm(req: Request, res: Response) {
    try {
        const form = await Form.findById(req.params.formid)
        return res.json({ success: true, form: form })
    } catch (error) {
        return res.send({ success: false, msg: error })
    }
}

export async function getAdminForms(req: Request, res: Response) {
    try {
        let adminForms = await Form.find().populate("owner", "role").exec()
        adminForms = adminForms.filter((form) => {
            return form?.owner?.role === "admin"
        })
        res.send({ success: true, forms: adminForms })
    } catch (err) {
        return res.send({ success: false, msg: err })
    }
}

export async function getSuperAdminForms(req: Request, res: Response) {
    try {
        let superAdminForms = await Form.find().populate("owner", "role").exec()
        superAdminForms = superAdminForms.filter((form) => {
            return form?.owner?.role === "superadmin"
        })
        res.send({ success: true, forms: superAdminForms })
    } catch (err) {
        return res.send({ success: false, msg: err })
    }
}

export async function addForm(req: any, res: Response) {
    try {
        let newForm: any
        newForm = new Form({
            title: req.body.title,
            owner: req.session.userId,
            color_theme: req.body.color_theme,
            description: req.body.description,
            isActive: req.body.isActive,
            isEditable: req.body.isEditable,
            multipleResponses: req.multipleResponses,
        })
        const form = await newForm.save()
        console.log("Form added!")
        return res.json(form)
    } catch (error) {
        return res.send(error)
    }
}

export async function updateForm(req: Request, res: Response) {
    try {
        let updatedForm: any
        updatedForm = await Form.findOneAndUpdate(
            { _id: req.body._id },
            {
                ...req.body,
            },
            { new: true }
        )
        return res.send(updatedForm)
    } catch (error) {
        return res.send({ success: false, msg: error })
    }
}

//!DELETE ALL THE QUESTIONS OF THIS FORM AS WELL
export async function deleteForm(req: Request, res: Response) {
    try {
        console.log(req.body.id)
        let deletedResponses: any
        deletedResponses = await FormResponse.findOneAndDelete({
            formId: req.body.id,
        })
        let deletedQuestions: any
        deletedQuestions = await Question.deleteMany({
            formid: req.body.id,
        })
        console.log(deletedResponses)

        let deletedForm: any
        deletedForm = await Form.findOneAndDelete({
            _id: req.body.id,
        })
        return res.send(deletedForm)
    } catch (error) {
        return res.send({ success: false, msg: error })
    }
}

//Routes for closing-form  ---> to be implemented using toggle button in formlist correspomding to form
export async function closeForm(req: Request, res: Response) {
    try {
        let formId = req.params.formId
        let updatedForm = await Form.findOneAndUpdate(
            { _id: formId },
            {
                $set: { isActive: req.body.isActive },
            },
            { new: true }
        )
        if (updatedForm)
            return res.send({
                success: true,
                data: "Form Status changed to " + updatedForm.isActive,
            })
        else
            return res.send({
                success: false,
                data: "Form Status isn't updated please try again",
            })
    } catch (err) {
        return res.send({ success: false, data: err })
    }
}



export let fid:any
export async function extractFormid(req: Request,res:Response){
    fid = req.params.formid
    console.log(fid)
    res.send("Extracted FormID")
}