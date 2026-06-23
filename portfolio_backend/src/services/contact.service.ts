import AppError from "../errors/AppError.js";
import contactEmailTemplate from "../templates/contactEmail.js";
import { ContactData } from "../types/contact.type.js";
import transporter from "../utils/mailer.js";

export const sendContactMail = async (data: ContactData) => {
    try {
        const info = await transporter.sendMail({
            from: `"Portfolio Contact" <${process.env.MAIL_USER}>`,
            to: process.env.MAIL_TO,
            replyTo: data.email,
            subject: `[Portfolio] ${data.subject}`,
            text: `
                Nom: ${data.name}
                Email: ${data.email}
                Sujet: ${data.subject}
                Message: ${data.message}
            `,
            html: contactEmailTemplate(data),
        });

        return info;
    } catch (err) {
        console.error("Error while sending mail:", err);
        throw new AppError("Erreur lors de l'envoi du message.", 500);
    }
};
