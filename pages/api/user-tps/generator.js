import handler from "middlewares/handler";
import getLogger from "middlewares/getLogger";
import bcrypt from "bcryptjs";

async function generateArray(
  kelurahan,
  firstusername,
  passwordHash,
  dataArray
) {
  const array = [];
  for (let i = 0; i < dataArray.length; i++) {
    const username =
      firstusername.toString() + dataArray[i].no.toString().padStart(2, "0");
    const nama = `User ${kelurahan} TPS ${dataArray[i].no}`;
    const obj = {
      level_id: 5,
      verifikator: 0,
      tps_id: dataArray[i].id,
      nama: nama,
      username: username,
      password: passwordHash,
    };
    array.push(obj);
  }
  return array;
}

export default handler().post(async (req, res) => {
  try {
    const { password, kelurahan_id } = req.body;

    if (!kelurahan_id || !password)
      return res.status(401).json({
        message: `Kelurahan atau Password Tidak Terdeteksi`,
        type: "error",
      });

    // cek jumlah TPS
    const dataKelurahan = await req
      .knex("kelurahan")
      .select("jumlah_tps", "kelurahan")
      .where("id", kelurahan_id)
      .first();

    // jika kelurahan tidak ada
    if (!dataKelurahan)
      return res.status(401).json({
        message: `Kelurahan Tidak Ditemukan`,
        type: "error",
      });

    // jika kelurahan belum mempunyai jumlah tps
    if (!dataKelurahan.jumlah_tps)
      return res.status(401).json({
        message: `Jumlah TPS Pada Kelurahan Belum Ditentukan`,
        type: "error",
      });

    // cek data TPS
    const dataTps = await req.knex
      .select(`tps.*`)
      .from(`tps`)
      .where(`tps.kelurahan_id`, kelurahan_id);

    // jika tps belum dibuat
    if (dataTps.length === 0)
      return res.status(401).json({
        message: `Generate TPS Terlebih Dahulu`,
        type: "error",
      });

    const kelurahan = dataKelurahan.kelurahan;
    const firstusername = dataKelurahan.kelurahan
      .replace(/\s/g, "")
      .substring(0, 6)
      .toLowerCase();
    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(password, salt);

    // PEMBUATAN OBJECT ARRAY
    const arrayUntukInsert = await generateArray(
      kelurahan,
      firstusername,
      passwordHash,
      dataTps
    );

    // RESET SEBELUM PEMBUATAN ULANG
    await req.knex("user").where("tps_id", "like", `${kelurahan_id}%`).del();

    // PROSES INPUT
    const proses = await req.knex("user").insert(arrayUntukInsert);
    if (!proses)
      return res
        .status(404)
        .json({ status: 404, message: "Terjadi Kegagalan" });

    // success
    res.json({
      message: "Pembuatan User TPS Berhasil Dilakukan",
      type: "success",
    });
  } catch (error) {
    getLogger.error(error);
    res.status(500).json({ message: "Terjadi Kesalahan...", type: "error" });
  }
});
