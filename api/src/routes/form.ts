import { Document, Schema } from "mongoose"
import { Response, Request, NextFunction } from "express"
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
            const myForms = await Form.find({
                owner: req.session.userId,
            }).sort({ createdAt: -1 })
            res.send({ success: true, forms: myForms })
        } else {
            //superadmin
            const forms = await Form.find().sort({ createdAt: -1 })
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
        let adminForms = await Form.find()
            .populate("owner", "role")
            .sort({ createdAt: -1 })
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
        let superAdminForms = await Form.find()
            .populate("owner", "role")
            .sort({ createdAt: -1 })
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

//!DELETE ALL THE QUESTIONS/RESPONSES OF THIS FORM AS WELL
export async function deleteForm(req: Request, res: Response) {
    console.log("Inside Delete")
    try {
        console.log(req.body.id)
        let form = await Form.findById(req.body.id)
        if (!form?.isTemplate) {
            console.log("Form is not template")
            let deletedResponses: any
            deletedResponses = await FormResponse.deleteMany({
                formId: req.body.id,
            })
            // console.log(deletedResponses)

            let deletedQuestions: any
            deletedQuestions = await Question.deleteMany({
                formid: req.body.id,
            })
            // console.log(deletedQuestions)

            let deletedForm: any
            deletedForm = await Form.deleteOne({
                _id: req.body.id,
            })
            // console.log(deletedForm)
            return res.send({ success: true, msg: deletedForm })
        } else {
            let deletedResponses: any
            deletedResponses = await FormResponse.deleteMany({
                formId: req.body.id,
            })
            console.log(deletedResponses)
            form.isDeleted = true
            await form.save()
            console.log("Form was template")
            return res.send({
                success: true,
                msg: "Form exits as Template but all responses are deleted",
            })
        }
    } catch (error) {
        return res.send({ success: false, msg: error })
    }
}

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

export let fid: any
export async function extractFormid(
    req: Request,
    res: Response,
    next: NextFunction
) {
    let form = await Form.findById(req.params.formid)

    if (form) {
        console.log("Voila!! we found formid")
        fid = req.params.formid
        next()
    } else {
        console.log("FormID is invalid")
        return res.send({ success: false, msg: "Form doesn't exists" })
    }
}

export async function makeTemplate(req: Request, res: Response) {
    try {
        let formId = req.params.formId
        let form = await Form.findById(formId)
        if (form) {
            form.isTemplate = true
            await form.save()
            return res.send({ success: true, msg: "Form saved as template" })
        } else {
            console.log("FormID is invalid")
            return res.send({ success: false, msg: "Form doesn't exists" })
        }
    } catch (err) {
        console.log(err)
        return res.send({ success: false, msg: "Server Error" })
    }
}
export async function deleteTemplate(req: Request, res: Response) {
    try {
        let formId = req.params.formId
        let form = await Form.findById(formId)
        if (form) {
            let formId = req.params.formId
            let form = await Form.findById(formId)
            if (form?.isTemplate) {
                if (form.isDeleted) {
                    //delete form ques
                    let deletedQuestions: any
                    deletedQuestions = await Question.deleteMany({
                        formid: formId,
                    })
                    console.log(deletedQuestions)
                    //delete form
                    let deletedForm: any
                    deletedForm = await Form.deleteOne({
                        _id: formId,
                    })
                    res.send({ success: true, msg: "Form Template deleted" })
                } else {
                    form.isTemplate = false
                    await form.save()
                    return res.send({
                        success: true,
                        msg: "Form removed from template",
                    })
                }
            } else {
                return res.send({
                    success: false,
                    msg: "Form is not a template",
                })
            }
        } else {
            console.log("FormID is invalid")
            return res.send({ success: false, msg: "Form doesn't exists" })
        }
    } catch (err) {
        console.log(err)
        return res.send({ success: false, msg: "Server Error" })
    }
}
export async function useTemplate(req: Request, res: Response) {
    try {
        let formId = req.params.formId
        let form: any = await Form.findById(formId)
        if (form) {
            form.isDeleted = false
            await form.save()
            return res.send({ success: true, msg: "Template ready to be used" })
        } else {
            console.log("FormID is invalid")
            return res.send({ success: false, msg: "Form doesn't exists" })
        }
    } catch (err) {
        console.log(err)
        return res.send({ success: false, msg: "Server Error" })
    }
}
