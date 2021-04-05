import { Response, Request } from "express";
import * as mongo from "../config/mongo";
import { Responses } from "../models/response";
import {User} from "../models/User"

export async function getResponses(req: Request, res: Response) {
    await mongo.connectMongo();
  
    const responses = await Responses.find().exec();
    res.json(responses);
}
  
export async function addResponses(req: Request, res: Response) {
  //push user to array of users in Responses Schema
  // req.session.userId
}  

