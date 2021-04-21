import { Response, Request } from "express";
import * as mongo from "../config/mongo";
import { Form } from "../models/form";

export async function getForms(req: Request, res: Response) {
    await mongo.connectMongo();

    const forms = await Form.find().exec();
    res.json({ success: true, forms: forms });
}

export async function getForm(req: Request, res: Response) {
    await mongo.connectMongo();
    const form = await Form.findById(req.params.formid);

    res.json(form);
}

export async function addForm(req: any, res: Response) {
    await mongo.connectMongo();

    console.log("POST REQUEST WAS MADE");
    console.log(req.body);
    const newForm = new Form(req.body);
    console.log(req.body);
    try {
        await newForm.save();
        console.log("Form added!");
        res.send(newForm);
    } catch (error) {
        res.send(error);
    }
}

export async function updateForm(req: Request, res: Response) {
    await mongo.connectMongo();

    let updatedForm;
    try {
        updatedForm = await Form.findOneAndUpdate(
            { _id: req.body._id },
            {
                ...req.body,
            },
            { new: true }
        );
        res.send(updatedForm);
    } catch (error) {
        res.send(error);
    }
}

//!DELETE ALL THE QUESTIONS OF THIS FORM AS WELL
export async function deleteForm(req: Request, res: Response) {
    let deletedForm;
    await mongo.connectMongo();
    try {
        deletedForm = await Form.findOneAndDelete({ _id: req.body.id });
        res.send(deletedForm);
    } catch (error) {
        res.send(error);
        console.error(error);
    }
}
