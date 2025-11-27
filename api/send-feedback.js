import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Método não permitido",
      data: null,
    });
  }

  const { courseId, recipientEmail, responses, timestamp } = req.body;

  if (!recipientEmail) {
    return res.status(400).json({
      success: false,
      message: "Email de destino é obrigatório",
      data: null,
    });
  }

  if (!process.env.GMAIL_USER || !process.env.GMAIL_PASS) {
    return res.status(500).json({
      success: false,
      message: "Configuração de email ausente. Verifique GMAIL_USER e GMAIL_PASS.",
      data: null,
    });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    let emailBody = `FEEDBACK - CURSO: ${courseId?.toUpperCase()}\n\n`;
    if (Array.isArray(responses)) {
      responses.forEach((item, index) => {
        emailBody += `${index + 1}. ${item.question}\n`;
        if (item.subtitle) emailBody += `   ${item.subtitle}\n`;
        emailBody += `   Resposta: ${item.answer}\n\n`;
      });
    }
    emailBody += `Data: ${timestamp}\n`;

    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: recipientEmail,
      subject: `Feedback - ${courseId}`,
      text: emailBody,
    });

    return res.status(200).json({
      success: true,
      message: "E-mail enviado!",
      data: null,
    });
  } catch (error) {
    console.error("Erro ao enviar e-mail:", error);

    return res.status(500).json({
      success: false,
      message: "Erro ao enviar e-mail.",
      data: { error: error.message },
    });
  }
}