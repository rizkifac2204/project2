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
  })
  .put(async (req, res) => {
    try {
      const { kelurahan_id } = req.query;
      const { jumlah_pemilih, jumlah_tps } = req.body;

      // cek exist data
      const cek = await req.knex
        .select("*")
        .from("kelurahan")
        .where("id", kelurahan_id)
        .first();

      if (!cek)
        return res
          .status(404)
          .json({ status: 404, message: "Tidak Ditemukan" });

      // cek jumlah TPS untuk perbandingan
      const cekJumlahTps = await req
        .knex("kelurahan")
        .select("jumlah_tps")
        .where("id", kelurahan_id)
        .first();

      // jika jumlah berbeda maka data TPS dan User TPS akan direset
      if (cekJumlahTps.jumlah_tps) {
        if (cekJumlahTps.jumlah_tps !== jumlah_tps) {
          await req.knex("tps").where("kelurahan_id", kelurahan_id).del();
          // tidak perlu delete user karena cascade
          // await req
          //   .knex("user")
          //   .where("tps_id", "like", `${kelurahan_id}%`)
          //   .del();
        }
      }

      // proses update
      const proses = await req
        .knex("kelurahan")
        .where("id", kelurahan_id)
        .update({
          jumlah_pemilih: jumlah_pemilih ? jumlah_pemilih : null,
          jumlah_tps: jumlah_tps ? jumlah_tps : null,
        });

      if (!proses)
        return res.status(400).json({ message: "Gagal Proses", type: "error" });

      res.json({ message: "Berhasil Mengubah Data" });
    } catch (error) {
      getLogger.error(error);
      res.status(500).json({ message: "Terjadi Kesalahan...", type: "error" });
    }
  });
