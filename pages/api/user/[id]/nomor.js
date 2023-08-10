import handler from "middlewares/handler";
import getLogger from "middlewares/getLogger";
import middlewareUser from "middlewares/middlewareUser";

export default handler()
  .get(async (req, res) => {
    try {
      const { id } = req.query;
      const result = await req.knex
        .select("*")
        .from("user_nomor")
        .where("user_id", id)
        .first();

      if (!result) return res.json({});
      res.json(result);
    } catch (error) {
      getLogger.error(error);
      res.status(500).json({ message: "Terjadi Kesalahan...", type: "error" });
    }
  })
  .put(middlewareUser, async (req, res) => {
    try {
      const { id } = req.query;
      const {
        no_nip,
        no_ktp,
        no_karpeg,
        no_bpjs_ketenagakerjaan,
        no_bpjs_kesehatan,
        no_taspen,
        no_karis,
        no_npwp,
        no_kontrak,
      } = req.body;

      //cek jika ada nomor KTP yang sama
      if (no_ktp) {
        const cekKTPSama = await req
          .knex("user_nomor")
          .where("user_id", "!=", id)
          .andWhere("no_ktp", no_ktp)
          .first();
        if (cekKTPSama) {
          return res.status(401).json({
            type: "error",
            message: "No KTP terdaftar oleh User lain",
          });
        }
      }

      const forNomor = {
        no_nip: no_nip || null,
        no_ktp: no_ktp || null,
        no_karpeg: no_karpeg || null,
        no_bpjs_ketenagakerjaan: no_bpjs_ketenagakerjaan || null,
        no_bpjs_kesehatan: no_bpjs_kesehatan || null,
        no_taspen: no_taspen || null,
        no_karis: no_karis || null,
        no_npwp: no_npwp || null,
        no_kontrak: no_kontrak || null,
      };

      const cekExist = await req
        .knex(`user_nomor`)
        .where("user_id", id)
        .first();
      if (!cekExist) {
        // insert
        const prosesNomor = await req.knex("user_nomor").insert({
          ...forNomor,
          user_id: id,
        });
        if (!prosesNomor)
          return res.json({
            message: "Gagal Menyimpan Data Lainnya",
            type: "error",
          });
      } else {
        // update
        const prosesNomor = await req
          .knex("user_nomor")
          .where("user_id", id)
          .update(forNomor);
        if (!prosesNomor)
          return res.json({
            message: "Gagal Menyimpan Data Lainnya",
            type: "error",
          });
      }

      res.json({ message: "Berhasil Mengubah Data Profile" });
    } catch (error) {
      getLogger.error(error);
      res.status(500).json({ message: "Terjadi Kesalahan...", type: "error" });
    }
  });
