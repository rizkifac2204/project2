import handler from "middlewares/handler";
import { middlewareProvinsiSelected } from "middlewares/middlewareSelected";

export default handler()
  .use(middlewareProvinsiSelected)
  .get(async (req, res) => {
    const data = await req
      .knex("provinsi")
      .whereIn("id", req.arrayProvinsi)
      .orderBy("provinsi", "asc");
    res.json(data);
  });
