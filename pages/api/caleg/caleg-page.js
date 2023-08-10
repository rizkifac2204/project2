import handler from "middlewares/handler";
import getLogger from "middlewares/getLogger";

export default handler().get(async (req, res) => {
  try {
    const { jenis, limit, page, filter } = req.query;

    const jumlah = await req
      .knex("caleg")
      .count("caleg.id as CNT")
      .leftJoin("partai", "caleg.partai_id", "partai.id")
      .modify((builder) => {
        if (jenis) builder.where("caleg.jenis", jenis);
        if (filter)
          builder.andWhere((nestedBuilder) => {
            nestedBuilder
              .where("caleg.nama", "like", `%${filter}%`)
              .orWhere("caleg.alamat", "like", `%${filter}%`)
              .orWhere("partai.partai", "like", `%${filter}%`);
          });
      })
      .first()
      .then(function (total) {
        return total;
      });

    const data = await req.knex
      .select("caleg.*", "partai.partai")
      .from("caleg")
      .leftJoin("partai", "caleg.partai_id", "partai.id")
      .modify((builder) => {
        if (jenis) builder.where("caleg.jenis", jenis);
        if (filter)
          builder.andWhere((nestedBuilder) => {
            nestedBuilder
              .where("caleg.nama", "like", `%${filter}%`)
              .orWhere("caleg.alamat", "like", `%${filter}%`)
              .orWhere("partai.partai", "like", `%${filter}%`);
          });
      })
      .limit(limit)
      .offset(page * limit)
      .orderBy([
        { column: "caleg.jenis", order: "asc" },
        { column: "caleg.partai_id", order: "asc" },
        { column: "caleg.dapil", order: "asc" },
        { column: "caleg.nomor_urut", order: "asc" },
      ]);

    res.json({
      data: data,
      total: jumlah.CNT,
    });
  } catch (error) {
    getLogger.error(error);
    res.status(500).json({ message: "Terjadi Kesalahan...", type: "error" });
  }
});
