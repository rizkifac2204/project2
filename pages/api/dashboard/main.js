import Handler from "middlewares/handler";
import getLogger from "middlewares/getLogger";
import middlewareLevelEmpatUp from "middlewares/middlewareLevelEmpatUp";

export default Handler()
  .use(middlewareLevelEmpatUp)
  .get(async (req, res) => {
    try {
      // ambil jumlah user
      const jumlahUser = await req
        .knex("user")
        .count("id as CNT")
        .whereNotIn("level_id", [1, 5])
        .first()
        .then(function (total) {
          return total;
        });

      const jumlahTps = await req
        .knex("kelurahan")
        .sum("jumlah_tps as SUM")
        .first();

      const jumlahUserTps = await req
        .knex("user")
        .count("id as CNT")
        .where("level_id", 5)
        .first();

      const jumlahPemilih = await req
        .knex("kelurahan")
        .sum("jumlah_pemilih as SUM")
        .first();

      const jumlahPartai = await req
        .knex("partai")
        .count("id as CNT")
        .first()
        .then(function (total) {
          return total;
        });

      const jumlahCaleg = await req
        .knex("caleg")
        .select("jenis")
        .count("id as CNT")
        .groupBy("jenis")
        .then(function (total) {
          return total;
        });

      // return hasil
      res.json({
        jumlahUser: jumlahUser.CNT,
        jumlahTps: jumlahTps.SUM,
        jumlahUserTps: jumlahUserTps.CNT,
        jumlahPemilih: jumlahPemilih.SUM,
        jumlahPartai: jumlahPartai.CNT,
        jumlahCaleg: jumlahCaleg,
      });
    } catch (error) {
      getLogger.error(error);
      res.status(500).json({ message: "Terjadi Kesalahan..." });
    }
  });
