import mongoose, { Document, Schema } from "mongoose"
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
        console.log("Form is not template")
        let deletedResponses: any
        deletedResponses = await FormResponse.deleteMany({
            formId: req.body.id,
        })

        let deletedQuestions: any
        deletedQuestions = await Question.deleteMany({
            formid: req.body.id,
        })

        let deletedForm: any
        deletedForm = await Form.deleteOne({
            _id: req.body.id,
        })
        return res.send({ success: true, msg: deletedForm })
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
            if (form.isTemplate) {
                return res.send({
                    success: false,
                    msg:
                        "Cannot create a template from already existing template",
                })
            }

            Form.findById(formId).exec(async function (err, doc) {
                if (doc) {
                    doc._id = mongoose.Types.ObjectId()
                    doc.isNew = true
                    doc.isTemplate = true
                    doc.title = doc.title + "_template"
                    doc.owner = req.session.userId
                    for (let i = 0; i < doc.questions.length; i++) {
                        let presentqueid = doc.questions[i]
                        let newquesid: any
                        Question.findById(presentqueid).exec(async function (
                            err,
                            document
                        ) {
                            if (document) {
                                document._id = mongoose.Types.ObjectId()
                                document.isNew = true
                                document.formid = doc._id
                                newquesid = document._id
                                doc.questions[i] = newquesid
                                await document.save()
                            }
                        })
                    }
                    await doc.save()
                    console.log(doc.questions)
                    console.log("new template")
                }
            })

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
export async function useTemplate(req: Request, res: Response) {
    try {
        let formId = req.params.formId
        let form: any = await Form.findById(formId)
        if (form) {
            if (!form.isTemplate) {
                return res.send({
                    success: false,
                    msg:
                        "Cannot use form as to create a copy, requires template",
                })
            }

            Form.findById(formId).exec(async function (err, doc) {
                if (doc) {
                    doc._id = mongoose.Types.ObjectId()
                    doc.isNew = true
                    doc.isTemplate = false
                    doc.title = doc.title + "_copy"
                    doc.owner = req.session.userId
                    for (let i = 0; i < doc.questions.length; i++) {
                        let presentqueid = doc.questions[i]
                        let newquesid: any
                        Question.findById(presentqueid).exec(async function (
                            err,
                            document
                        ) {
                            if (document) {
                                document._id = mongoose.Types.ObjectId()
                                document.isNew = true
                                document.formid = doc._id
                                newquesid = document._id
                                doc.questions[i] = newquesid
                                await document.save()
                            }
                        })
                    }
                    await doc.save()
                    console.log(doc.questions)
                    console.log("Form made from template")
                }
            })

            return res.send({
                success: true,
                msg: "Template ready to be used,Form made from template",
            })
        } else {
            console.log("FormID is invalid")
            return res.send({ success: false, msg: "Form doesn't exists" })
        }
    } catch (err) {
        console.log(err)
        return res.send({ success: false, msg: "Server Error" })
    }
}

export async function viewAllTempalates(req: Request, res: Response) {
    const forms = await Form.find({
        isTemplate: true,
    }).sort({ createdAt: -1 })
    console.log("egfewjgpjps")

    console.log(forms)
    return res.send({ success: true, forms: forms })
}
