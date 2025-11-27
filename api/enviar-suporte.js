import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Método não permitido",
      data: null,
    });
  }

  const { nome, email, mensagem } = req.body;

  if (!nome || !email || !mensagem) {
    return res.status(400).json({
      success: false,
      message: "Preencha todos os campos",
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

    const htmlEmail = `
      <html>
      <body style="font-family: Arial">
        <h2>Nova Mensagem de Suporte</h2>
        <p><strong>Nome:</strong> ${nome}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Mensagem:</strong><br>${mensagem.replace(/\n/g, "<br>")}</p>
        <p><strong>Data:</strong> ${new Date().toLocaleString("pt-BR")}</p>
      </body>
      </html>
    `;

    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: process.env.GMAIL_USER,
      replyTo: email,
      subject: `Suporte Magitech - ${nome}`,
      html: htmlEmail,
    });

    return res.status(200).json({
      success: true,
      message: "Mensagem enviada com sucesso!",
      data: null,
    });
  } catch (error) {
    console.error("Erro ao enviar email de suporte:", error);

    return res.status(500).json({
      success: false,
      message: "Erro ao enviar email.",
      data: { error: error.message },
    });
  }
}