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
      const { tps_id } = req.query;
      const result = await req.knex
        .select(`tps.*`)
        .from(`tps`)
        .where(`tps.id`, tps_id)
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
  })
  .put(async (req, res) => {
    try {
      const { tps_id } = req.query;
      const { title, alamat } = req.body;

      // proses update
      const proses = await req
        .knex("tps")
        .where("id", tps_id)
        .update({
          title: title || null,
          alamat: alamat || null,
        });

      if (!proses)
        return res.status(400).json({ message: "Gagal Proses", type: "error" });

      res.json({ message: "Berhasil Mengubah Data" });
    } catch (error) {
      getLogger.error(error);
      res.status(500).json({ message: "Terjadi Kesalahan...", type: "error" });
    }
  });
