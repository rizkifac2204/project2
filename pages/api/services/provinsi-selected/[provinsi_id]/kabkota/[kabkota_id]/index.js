import handler from "middlewares/handler";
import getLogger from "middlewares/getLogger";
import {
  middlewareProvinsiSelected,
  middlewareKabkotaSelected,
} from "middlewares/middlewareSelected";

export default handler()
  .use(middlewareProvinsiSelected)
  .use(middlewareKabkotaSelected)
  .get(async (req, res) => {
    try {
      const { kabkota_id } = req.query;
      const result = await req.knex
        .select(`kabkota.*`, `jenis.jenis`)
        .from(`kabkota`)
        .innerJoin(`jenis`, `jenis.id`, `kabkota.jenis_id`)
        .where(`kabkota.id`, kabkota_id)
        .whereIn("kabkota.id", req.arrayKabkota)
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
