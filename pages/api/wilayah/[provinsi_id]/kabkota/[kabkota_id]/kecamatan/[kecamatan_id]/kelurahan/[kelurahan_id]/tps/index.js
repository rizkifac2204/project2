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
      const data = await req.knex
        .select(`tps.*`)
        .from(`tps`)
        .where(`tps.kelurahan_id`, kelurahan_id)
        .orderBy(`tps.no`, `asc`);
      res.json(data);
    } catch (error) {
      getLogger.error(error);
      res.status(500).json({ message: "Terjadi Kesalahan...", type: "error" });
    }
  });
