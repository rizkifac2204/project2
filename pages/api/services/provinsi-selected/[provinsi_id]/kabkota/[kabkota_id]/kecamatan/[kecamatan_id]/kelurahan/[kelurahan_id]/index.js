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
      const { kelurahan_id } = req.query;
      const result = await req.knex
        .select(`kelurahan.*`, `jenis.jenis`)
        .from(`kelurahan`)
        .innerJoin(`jenis`, `jenis.id`, `kelurahan.jenis_id`)
        .where(`kelurahan.id`, kelurahan_id)
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
