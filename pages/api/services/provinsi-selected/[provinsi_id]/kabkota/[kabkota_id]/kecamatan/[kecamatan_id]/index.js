import handler from "middlewares/handler";
import getLogger from "middlewares/getLogger";
import {
  middlewareProvinsiSelected,
  middlewareKabkotaSelected,
  middlewareKecamatanSelected,
} from "middlewares/middlewareSelected";

export default handler()
  .use(middlewareProvinsiSelected)
  .use(middlewareKabkotaSelected)
  .use(middlewareKecamatanSelected)
  .get(async (req, res) => {
    try {
      const { kecamatan_id } = req.query;
      const result = await req.knex
        .select(`kecamatan.*`)
        .from(`kecamatan`)
        .where(`kecamatan.id`, kecamatan_id)
        .whereIn(`kecamatan.id`, req.arrayKecamatan)
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
