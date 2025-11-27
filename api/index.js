export default function handler(req, res) {
  res.status(200).json({
    success: true,
    message: "Backend Magitech rodando com sucesso!",
    data: {
      status: "OK",
    },
  });
}