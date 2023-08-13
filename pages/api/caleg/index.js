import handler from "middlewares/handler";
import getLogger from "middlewares/getLogger";

export default handler()
  .get(async (req, res) => {
    try {
      const { jenis } = req.query;

      if (jenis) {
        const existJenis = process.env.JENIS_DCT.split(",").includes(jenis);
        if (!existJenis)
          return res.status(400).json({
            message: "Terjadi Kesalahan",
            type: "error",
          });
      }

      const result = await req.knex
        .select("caleg.*", "partai.partai")
        .from("caleg")
        .leftJoin("partai", "caleg.partai_id", "partai.id")
        .modify((builder) => {
          if (jenis) builder.where("caleg.jenis", jenis);
        })
        .orderBy([
          { column: "caleg.jenis", order: "asc" },
          { column: "caleg.partai_id", order: "asc" },
          { column: "caleg.dapil", order: "asc" },
          { column: "caleg.nomor_urut", order: "asc" },
        ]);

      res.json(result);
    } catch (error) {
      getLogger.error(error);
      res.status(500).json({ message: "Terjadi Kesalahan...", type: "error" });
    }
  })
  .post(async (req, res) => {
    try {
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

      // proses insert
      const proses = await req.knex("caleg").insert([
        {
          jenis,
          partai_id: partai_id ? partai_id : null,
          dapil: dapil ? dapil : null,
          nomor_urut,
          nama,
          jenis_kelamin: jenis_kelamin ? jenis_kelamin : null,
          alamat: alamat ? alamat : null,
        },
      ]);

      // failed
      if (!proses)
        return res.status(400).json({
          message: "Gagal Memasukan Data",
          type: "error",
        });

      // success
      res.json({ message: "Berhasil Menyimpan Data", type: "success" });
    } catch (error) {
      getLogger.error(error);
      res.status(500).json({ message: "Terjadi Kesalahan...", type: "error" });
    }
  });
