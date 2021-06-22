import mongoose, { Document, Schema } from "mongoose"
import { Response, Request, NextFunction } from "express"
import * as mongo from "../config/mongo"
import { Form } from "../models/form"
import { Question } from "../models/question"
import FormResponse from "../models/response"
import { User } from "../models/user"
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
            console.log("getForms")
            const myForms = await Form.find({
                isTemplate: false,
                editors: req.session.userId,
            }).sort({ createdAt: -1 })
            console.log("My form is ")
            console.log(myForms)
            res.send({ success: true, forms: myForms })
        } else if (req.session.role === "superadmin") {
            //superadmin
            const forms = await Form.find({ isTemplate: false }).sort({
                createdAt: -1,
            })
            res.json({ success: true, forms: forms })
        }
    } catch (error) {
        return res.send({ success: false, msg: error })
    }
}

export async function getForm(req: Request, res: Response) {
    try {
        console.log("inside getForm")
        const form = await Form.findById(req.params.formid)
        console.log(req.session.userId)
        console.log(form?.owner)
        if (form) {
            if (
                req.session.role == "superadmin" ||
                form.editors.indexOf(req.session.userId) != -1 ||
                String(form.owner) == String(req.session.userId)
            ) {
                return res.json({ success: true, form: form })
            } else {
                return res.send({
                    success: false,
                    msg: "You dont have edit access to the form",
                })
            }
        } else {
            return res.send({ success: false, msg: "Form doesnt exists" })
        }
    } catch (error) {
        return res.send({ success: false, msg: error })
    }
}

export async function getFormForResponse(req: Request, res: Response) {
    try {
        console.log("Inside getformresp")
        const form = await Form.findById(req.params.formid)

        if (form) {
            var presentDateTime: Date = new Date()
            console.log("Present time " + presentDateTime)
            console.log("closing time " + form.closes)
            //Checking for closing date time
            if (form.closes <= presentDateTime) {
                console.log("Form closed")
                form.isActive = false
                await form.save()
            }
            if (!form.isActive) {
                console.log("Form is closed")
                return res.json({ success: false, form: "Form is closed" })
            } else {
                return res.json({ success: true, form: form })
            }
        } else {
            return res.send({ success: false, msg: "Form doesnt exists" })
        }
    } catch (error) {
        return res.send({ success: false, msg: error })
    }
}

export async function getAdminForms(req: Request, res: Response) {
    try {
        if (req.session.role == "superadmin") {
            let adminForms = await Form.find({
                isTemplate: false,
            })
                .populate("owner", "role")
                .sort({ createdAt: -1 })
            adminForms = adminForms.filter((form) => {
                return form?.owner?.role === "admin"
            })
            res.send({ success: true, forms: adminForms })
        } else {
            let adminForms = await Form.find({
                isTemplate: false,
                editors: req.session.userId,
            })
                .populate("owner", "role")
                .sort({ createdAt: -1 })
            adminForms = adminForms.filter((form) => {
                return form?.owner?.role === "admin"
            })
            res.send({ success: true, forms: adminForms })
        }
    } catch (err) {
        return res.send({ success: false, msg: err })
    }
}

export async function getSuperAdminForms(req: Request, res: Response) {
    try {
        let superAdminForms = await Form.find({ isTemplate: false })
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
            role: req.session.role,
        })
        newForm.editors.push(req.session.userId)
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
        let form = await Form.findById(req.body.id).populate("owner")
        console.log(form)
        if (!form?.isTemplate) {
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
        } else if (form?.owner["role"] == "superadmin") {
            if (req.session.role == "superadmin") {
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
            } else {
                res.send({
                    success: true,
                    msg: "Form cant be deleted as it is created by superadmin",
                })
            }
        } else {
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

export async function updateeditor(req: Request, res: Response) {
    let formid = req.body.formid
    let neweditors = req.body.editors
    console.log(neweditors)
    try {
        console.log("updating editor")
        let form: any = await Form.findById(formid).populate("editors")

        if (form) {
            console.log(form)
            form.editors.splice(0, form.editors.length)
            form.editors.push(form.owner)
            for (let i = 0; i < neweditors.length; i++) {
                console.log("value is " + form.editors.indexOf(neweditors[i]))
                if (form.editors.indexOf(neweditors[i]) == -1) {
                    if (String(form.editors[i]) != String(form.owner)) {
                        console.log(form.owner)
                        console.log(form.editors[i])
                        console.log("Pushing")
                        form.editors.push(neweditors[i])
                    }
                }
            }
            await form.save()
            return res.send({ success: true, msg: "Editor list updated" })
        } else {
            console.log("Form does not exists")
            return res.send({ success: false, msg: "Server Error" })
        }
    } catch (err) {
        console.log(err)
        return res.send({ success: false, msg: "Server Error" })
    }
}
