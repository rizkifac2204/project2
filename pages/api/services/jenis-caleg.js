import handler from "middlewares/handler";
import { JENIS_DCT } from "assets/appConfig";

export default handler().get(async (req, res) => {
  if (!JENIS_DCT) return res.json([]);
  res.json(JENIS_DCT.split(","));
});
