import { Request, Response } from "express";
import { sendContactMail } from "../services/contact.service.js";
import { ContactData } from "../types/contact.type.js";
import { IdParams } from "../types/request.js";

export const sendContact = async (req: Request<IdParams, unknown, ContactData>, res: Response) => {
    await sendContactMail(req.body);

    return res.status(200).json({
        success: true,
        message: "Message envoyé avec succès."
    })
}
