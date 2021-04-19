import { Response, Request } from "express";
import * as mongo from "../config/mongo";
import test from "../models/Test";

export function helloWorld(req: Request, res: Response) {
  res.send({ data: "Hello World!" });
}

export async function dbTesting(req: Request, res: Response) {
  await mongo.connectMongo();

  const newTest = new test({
    name: "haha",
    value: "world",
  });
  await newTest.save();
  console.log("Added a value");
  const getTest: any = await test.find({});
  console.log(getTest);
  res.send(getTest);
}
