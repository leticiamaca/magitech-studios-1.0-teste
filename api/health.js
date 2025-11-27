export default function handler(req, res) {
  const gmailConfigured = !!(process.env.GMAIL_USER && process.env.GMAIL_PASS);

  res.status(200).json({
    success: true,
    message: "Backend funcionando com Gmail",
    data: {
      status: "OK",
      gmailConfigured,
    },
  });
}