import { Response, Request } from "express";
import * as mongo from "../config/mongo";
import main from "../models/main";

export async function addForm(req: Request, res: Response) {
  await mongo.connectMongo();
  main.create(req.body).then(function (main) {
    res.send(main);
  });
}
