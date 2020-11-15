import { Response, Request } from "express";
import * as mongo from "../config/mongo";
import test from "../models/Test";

import { Form, Question, Mcq, LinearScale } from "../models/form";

export function helloWorld(req: Request, res: Response) {
  res.send({ data: "Hello World!" });
}

//WHAT DO I HAVE TO DO?
//SOOOO I HAVE TO CHANGE THE QUESTION SCHEMA TO HAVE AN ANSWER ID
//AFTER AN ANSWER IS CREATED OF THE RESPECTED

export async function dbTesting(req: Request, res: Response) {
  await mongo.connectMongo();

  //!-------TESTING TEST COLLECTION IN DATABASE ------------
  //   const newTest = new test({
  //     name: "haha",
  //     value: "world",
  //   });
  //   await newTest.save();
  //   console.log("Added a value");
  //   const getTest: any = await test.find({});
  //   console.log(getTest);
  //   res.send(getTest);

  //!---------END OF TEST COLLECTION-----------

  //!---------TESTING FORM PLACE-------------
  // const newForm = new Form({
  //   name: "form-one",
  //   bg_img: "picture-one",
  //   file: "html-one",
  // });

  // try {
  //   await newForm.save();
  // } catch (e) {
  //   console.log("could not save form");
  //   console.log(e);
  // }

  // const newForm2 = new Form({
  //   name: "form-two",
  //   bg_img: "picture-two",
  //   file: "html-two",
  // });

  // try {
  //   await newForm2.save();
  // } catch (e) {
  //   console.log("could not save form");
  //   console.log(e);
  // }

  // const newForm3 = new Form({
  //   name: "form-three",
  //   bg_img: "picture-three",
  //   file: "html-three",
  // });

  // try {
  //   await newForm3.save();
  // } catch (e) {
  //   console.log("could not save form");
  //   console.log(e);
  // }

  //!-------END OF TESTING FORM PLACE-------

  //!--------TESTING QUESTION PLACE---------

  // const newQuestion = new Mcq({
  //   text: "What is 3+0?",
  //   decription: "Choose wisely",
  //   options: [
  //     { option_number: "a", text: "6" },
  //     { option_number: "b", text: "3" },
  //     { option_number: "c", text: "9" },
  //   ],
  // });

  // //res.send(newQuestion);
  // try {
  //   await newQuestion.save();
  // } catch (e) {
  //   console.log("could not save quesion");
  // }

  // const newQuestion2 = new LinearScale({
  //   text: "How long is your first name",
  //   decription: "mine isn't that long",
  //   min: 2,
  //   max: 15,
  //   min_label: "Damn short",
  //   max_label: "Oh my god, defining stereotypes",
  // });
  // try {
  //   await newQuestion2.save();
  // } catch (e) {
  //   console.log("could not save quesion 2");
  // }
  // res.send(newQuestion);
  // //res.send(newQuestion);;
  // let form1: any;
  // try {
  //   form1 = await Form.findOne({ name: "form-one" });
  // } catch (error) {
  //   console.log("Couldnt get form");
  // }

  // form1.questions.push(newQuestion);
  // try {
  //   await form1.save();
  // } catch (error) {
  //   console.error(error);
  // }

  // let form2: any;
  // try {
  //   form2 = await Form.findOne({ name: "form-one" });
  // } catch (error) {
  //   console.log("Couldnt get form");
  // }

  // form2.questions.push(newQuestion2);
  // try {
  //   await form2.save();
  // } catch (error) {
  //   console.error(error);
  // }

  // res.send(form2);

  // console.log(form1);
  // //   let q1;
  // //   try {
  // //     q1 = await Question.findOne({});
  // //   } catch (error) {
  // //     console.log("Coutnt get question");
  // //   }
  // //   console.log(q1);
  // //   res.send(q1);
  // form1.questions.push(newQuestion);
  // let form2: any;
  // try {
  //   form2 = await Form.findOne({ name: "form-two" });
  // } catch (error) {
  //   console.log("Couldnt get form");
  // }
  // console.log(form1);
  // form2.questions.push(newQuestion2);

  // await form1.save();
  // await form2.save();

  // try {
  //   const bruh = await Form.find().populate("questions");
  //   console.log(bruh);
  // } catch (error) {
  //   console.log("coudnt find forms");
  //   console.log(error);
  // }

  const everything = await Form.find({ name: "form-one" }).populate(
    "questions"
  );
  res.send(everything);
}
