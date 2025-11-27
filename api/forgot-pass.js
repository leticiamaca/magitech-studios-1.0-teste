import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Método não permitido",
      data: null,
    });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Email é obrigatório",
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

    const recoveryCode = Math.floor(100000 + Math.random() * 900000);

    const emailBody = `
Olá!
Você solicitou a recuperação de senha da Magitech Studios.

Seu código de recuperação é: ${recoveryCode}

Válido por 30 minutos.
Se não foi você, ignore este e-mail.
`;

    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: email,
      subject: "Recuperação de Senha - Magitech Studios",
      text: emailBody,
    });

    return res.status(200).json({
      success: true,
      message: "Email enviado!",
      data: { code: recoveryCode },
      // compatibilidade com o frontend atual:
      code: recoveryCode,
    });
  } catch (error) {
    console.error("Erro ao enviar email de recuperação:", error);

    return res.status(500).json({
      success: false,
      message: "Erro ao enviar email.",
      data: { error: error.message },
    });
  }
}