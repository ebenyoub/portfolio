import { ContactData } from "../types/contact.type.js";

const escapeHtml = (value: string) => (
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;")
);

const contactEmailTemplate = (data: ContactData) => {
    const name = escapeHtml(data.name);
    const email = escapeHtml(data.email);
    const subject = escapeHtml(data.subject);
    const message = escapeHtml(data.message);

    return `
    <div style="
      font-family: Arial, sans-serif;
      max-width: 600px;
      margin: auto;
      padding: 24px;
      background-color: #f4f4f4;
      border-radius: 12px;
    ">
      <h1 style="
        color: #111827;
        margin-bottom: 24px;
      ">
        Nouveau message portfolio
      </h1>

      <div style="
        background: white;
        padding: 20px;
        border-radius: 8px;
      ">
        <p>
          <strong>Nom :</strong> ${name}
        </p>

        <p>
          <strong>Email :</strong>
          <a href="mailto:${email}">
            ${email}
          </a>
        </p>

        <p>
          <strong>Sujet :</strong> ${subject}
        </p>

        <p>
          <strong>Message :</strong>
        </p>

        <div style="
          margin-top: 12px;
          padding: 16px;
          background: #2f2f2f;
          border-left: 4px solid #4f8cff;
          white-space: pre-wrap;
          line-height: 1.5;
          color: white;
        ">
          ${message}
        </div>
      </div>
    </div>
  `;
};

export default contactEmailTemplate;
