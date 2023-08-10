import handler from "middlewares/handler";
import getLogger from "middlewares/getLogger";
import { middlewareProvinsiSelected } from "middlewares/middlewareSelected";

export default handler()
  .use(middlewareProvinsiSelected)
  .get(async (req, res) => {
    try {
      const { provinsi_id } = req.query;
      const result = await req
        .knex(`provinsi`)
        .where(`id`, provinsi_id)
        .whereIn("id", req.arrayProvinsi)
        .first();

      if (!result)
        return res
          .status(404)
          .json({ status: 404, message: "Tidak Ditemukan" });

      res.json(result);
    } catch (error) {
      getLogger.error(error);
      res.status(500).json({ message: "Terjadi Kesalahan...", type: "error" });
    }
  });
