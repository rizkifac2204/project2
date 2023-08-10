import handler from "middlewares/handler";
import getLogger from "middlewares/getLogger";
import {
  middlewareProvinsiSelected,
  middlewareKabkotaSelected,
  middlewareKecamatanSelected,
} from "middlewares/middlewareSelected";

async function generateArray(
  provinsi_id,
  kabkota_id,
  kecamatan_id,
  kelurahan_id,
  length
) {
  const array = [];
  for (let i = 1; i <= length; i++) {
    const id = kelurahan_id.toString() + i.toString().padStart(2, "0");
    const obj = {
      id: id,
      provinsi_id: provinsi_id,
      kabkota_id: kabkota_id,
      kecamatan_id: kecamatan_id,
      kelurahan_id: kelurahan_id,
      no: i,
    };
    array.push(obj);
  }
  return array;
}

export default handler()
  .use(middlewareProvinsiSelected)
  .use(middlewareKabkotaSelected)
  .use(middlewareKecamatanSelected)
  .post(async (req, res) => {
    try {
      const { provinsi_id, kabkota_id, kecamatan_id, kelurahan_id } = req.query;

      // delete all
      await req.knex("tps").where("kelurahan_id", kelurahan_id).del();

      // cek jumlah TPS
      const cekJumlahTps = await req
        .knex("kelurahan")
        .select("jumlah_tps")
        .where("id", kelurahan_id)
        .first();

      if (!cekJumlahTps.jumlah_tps)
        return res.status(401).json({
          message: `Jumlah TPS Belum Ditentukan`,
          type: "error",
        });

      // PEMBUATAN OBJECT ARRAY
      const arrayUntukInsert = await generateArray(
        provinsi_id,
        kabkota_id,
        kecamatan_id,
        kelurahan_id,
        Number(cekJumlahTps.jumlah_tps)
      );

      // PROSES INPUT
      const proses = await req.knex("tps").insert(arrayUntukInsert);
      if (!proses)
        return res
          .status(404)
          .json({ status: 404, message: "Terjadi Kegagalan" });

      // success
      res.json({
        message: "Pembuatan TPS Berhasil Dilakukan",
        type: "success",
      });
    } catch (error) {
      getLogger.error(error);
      res.status(500).json({ message: "Terjadi Kesalahan...", type: "error" });
    }
  });
