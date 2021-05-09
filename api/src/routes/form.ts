import { Document, Schema } from "mongoose"
import { Response, Request } from "express"
import * as mongo from "../config/mongo"
import { Form } from "../models/form"

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
    await mongo.connectMongo()
    if (req.session.role === "admin") {
        try {
            const myForms = await Form.find({ owner: req.session.userId })
            console.log(myForms)
            res.send({ success: true, forms: myForms })
        } catch (error) {
            res.send(error)
        }
    } else {
        const forms = await Form.find().exec()
        res.json({ success: true, forms: forms })
    }
}

export async function getForm(req: Request, res: Response) {
    await mongo.connectMongo()
    const form = await Form.findById(req.params.formid)
    res.json({ success: true, form: form })
}

export async function getAdminForms(req: Request, res: Response) {
    await mongo.connectMongo()
    try {
        let adminForms = await Form.find().populate("owner", "role").exec()
        adminForms = adminForms.filter((form) => {
            return form?.owner?.role === "admin"
        })
        res.send({ success: true, forms: adminForms })
    } catch (err) {
        console.log(err)
        res.send({ success: false, data: "something went wrong" })
    }
}

export async function getSuperAdminForms(req: Request, res: Response) {
    await mongo.connectMongo()
    try {
        let superAdminForms = await Form.find().populate("owner", "role").exec()
        superAdminForms = superAdminForms.filter((form) => {
            return form?.owner?.role === "superadmin"
        })
        res.send({ success: true, forms: superAdminForms })
    } catch (err) {
        console.log(err)
        res.send({ success: false, data: "something went wrong" })
    }
}

export async function addForm(req: any, res: Response) {
    await mongo.connectMongo()
    let newForm: any
    newForm = new Form({
        title: req.body.title,
        owner: req.session.userId,
        color_theme: req.body.color_theme,
        description: req.body.description,
        isActive:req.body.isActive,
        isEditable:req.body.isEditable,
        multipleResponses:req.multipleResponses
    })
    console.log("POST REQUEST WAS MADE")
    //newForm = new Form(req.body);
    try {
        const form = await newForm.save()
        console.log("Form added!")
        res.json(form)
    } catch (error) {
        res.send(error)
    }
}

export async function updateForm(req: Request, res: Response) {
    await mongo.connectMongo()

    let updatedForm
    try {
        updatedForm = await Form.findOneAndUpdate(
            { _id: req.body._id },
            {
                ...req.body,
            },
            { new: true }
        )
        res.send(updatedForm)
    } catch (error) {
        res.send(error)
    }
}

//!DELETE ALL THE QUESTIONS OF THIS FORM AS WELL
export async function deleteForm(req: Request, res: Response) {
    let deletedForm
    await mongo.connectMongo()
    try {
        deletedForm = await Form.findOneAndDelete({ _id: req.body.id })
        res.send(deletedForm)
    } catch (error) {
        res.send(error)
        console.error(error)
    }
}

export async function getMyForms(req: Request, res: Response) {
    await mongo.connectMongo()
    // console.log(req.session.userId);
}

// export async function getMyForm(req: Request, res: Response) {
//     await mongo.connectMongo()
//     // console.log(req.session.userId);

//     let myForm: any
//     try {
//         myForm = await Form.find({
//             owner: req.session.userId,
//             _id: req.params.formid,
//         })
//         console.log(myForm)

//         res.send(myForm)
//     } catch (error) {
//         res.send(error)
//     }
// }



//Routes for closing-form  ---> to be implemented using toggle button in formlist correspomding to form
export async function closeForm (req:Request,res:Response) {
    await mongo.connectMongo()
    let formId=req.body.formId
    try
    {
        let updatedForm=await Form.findOneAndUpdate(
            {_id:formId},
            {
                $set:{isActive: req.body.isActive}
            },{new:true}
        )
            // console.log(formIsActive)
            console.log(updatedForm)
            if(updatedForm)
                res.send({success:true,data:"Form Status changed to "+updatedForm.isActive})
            else
                res.send({success:false,data:"Form Status isn't updated please try again"})
    }
    catch(err)
    {
        res.send({ success: false, data: err})
    }
}
