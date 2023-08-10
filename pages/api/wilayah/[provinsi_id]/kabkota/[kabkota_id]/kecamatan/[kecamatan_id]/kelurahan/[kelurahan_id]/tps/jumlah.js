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
      const data = await req
        .knex("tps")
        .count("id as CNT")
        .where(`kelurahan_id`, kelurahan_id)
        .first()
        .then(function (total) {
          return total;
        });
      res.json({ jumlah: data.CNT });
    } catch (error) {
      getLogger.error(error);
      res.status(500).json({ message: "Terjadi Kesalahan...", type: "error" });
    }
  });
