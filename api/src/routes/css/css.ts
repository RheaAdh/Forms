import { Response, Request, NextFunction } from "express"
import path from "path"
export async function getCssMain(req: Request, res: Response) {
    try {    
        return res.sendFile("index.css",{root:__dirname}) 
    } catch (err) {
        return res.send({ sucess: false, msg:"Server Error" })
    }
}
export async function getCssDisplayForm(req: Request, res: Response) {
    try {    
        return res.sendFile("DisplayForm.css",{root:__dirname}) 
    } catch (err) {
        return res.send({ sucess: false, msg:"Server Error" })
    }
}