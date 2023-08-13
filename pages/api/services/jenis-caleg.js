import handler from "middlewares/handler";

export default handler().get(async (req, res) => {
  if (!process.env.JENIS_DCT) return res.json([]);
  res.json(process.env.JENIS_DCT.split(","));
});
