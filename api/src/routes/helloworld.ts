import { Response, Request } from "express";
import * as mongo from "../config/mongo";
import test from "../models/Test";

import {
  Form,
  Question,
  Mcq,
  LinearScale,
  Answer,
  oneOptionCorrect,
  lsAnswer,
} from "../models/form";

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
  //   form: newForm,
  //   options: [
  //     { option_number: "a", text: "6" },
  //     { option_number: "b", text: "3" },
  //     { option_number: "c", text: "9" },
  //   ],
  // });

  // // // //res.send(newQuestion);
  // try {
  //   await newQuestion.save();
  // } catch (e) {
  //   console.log("could not save quesion");
  // }

  // const newQuestion2 = new LinearScale({
  //   text: "How long is your first name",
  //   decription: "mine isn't that long",
  //   form: newForm2,
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

  const questionOne: any = await Question.findById("5fb38ac6b1ebf6533c2e812f");

  const newAnswer = new lsAnswer({
    chosen_number: "7",
    question: questionOne,
  });

  questionOne.answer = newAnswer;

  // await questionOne.save();
  await newAnswer.save();

  res.send(newAnswer);
}
