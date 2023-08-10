import handler from "middlewares/handler";
import getLogger from "middlewares/getLogger";

export default handler()
  .get(async (req, res) => {
    try {
      const { caleg_id } = req.query;

      const result = await req.knex
        .select("caleg.*", "partai.partai")
        .from("caleg")
        .leftJoin("partai", "caleg.partai_id", "partai.id")
        .where("caleg.id", caleg_id)
        .first();

      if (!result)
        return res
          .status(404)
          .json({ message: "Tidak Ditemukan", type: "error" });

      res.json(result);
    } catch (error) {
      getLogger.error(error);
      res.status(500).json({ message: "Terjadi Kesalahan...", type: "error" });
    }
  })
  .put(async (req, res) => {
    try {
      const { caleg_id } = req.query;

      // get post
      const {
        jenis,
        partai_id,
        dapil,
        nomor_urut,
        nama,
        jenis_kelamin,
        alamat,
      } = req.body;

      const cek = await req
        .knex("caleg")
        .where("id", "!=", caleg_id)
        .where({
          jenis: jenis,
          nomor_urut: nomor_urut,
          partai_id: partai_id ? partai_id : null,
          dapil: dapil ? dapil : null,
        })
        .first();

      let msg = "";
      if (cek) {
        if (jenis === "DPD") {
          msg = `Data Caleg DPD Nomor Urut ${nomor_urut} Sudah Terdaftar`;
        } else {
          msg = `Data Caleg Dapil ${dapil} Nomor Urut ${nomor_urut} Pada Partai Tersebut Sudah Terdaftar`;
        }
        return res.status(401).json({
          message: msg,
          type: "error",
        });
      }

      // proses update
      const proses = await req
        .knex("caleg")
        .where("id", caleg_id)
        .update({
          jenis,
          partai_id: partai_id ? partai_id : null,
          dapil: dapil ? dapil : null,
          nomor_urut,
          nama,
          jenis_kelamin: jenis_kelamin ? jenis_kelamin : null,
          alamat: alamat ? alamat : null,
          updated_at: req.knex.fn.now(),
        });

      // failed
      if (!proses)
        return res.status(400).json({
          message: "Gagal Proses",
          type: "error",
        });

      // success
      res.json({ message: "Berhasil Update", type: "success" });
    } catch (error) {
      getLogger.error(error);
      res.status(500).json({ message: "Terjadi Kesalahan...", type: "error" });
    }
  })
  .delete(async (req, res) => {
    try {
      const { caleg_id } = req.query;

      const proses = await req.knex("caleg").where("id", caleg_id).del();
      if (!proses)
        return res.status(400).json({ message: "Gagal Hapus", type: "error" });

      res.json({ message: "Berhasil Hapus", type: "success" });
    } catch (error) {
      getLogger.error(error);
      res.status(500).json({ message: "Terjadi Kesalahan...", type: "error" });
    }
  });
