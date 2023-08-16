import handler from "middlewares/handler";
import getLogger from "middlewares/getLogger";
import { DeleteUpload } from "services/uploadService";
import { isEditable, isMyself } from "middlewares/userAttrs";
import middlewareUserTps from "middlewares/middlewareUserTps";
import { PATH_FOTO } from "assets/appConfig";

async function middlewareEdit(req, res, next) {
  try {
    const { user_tps_id } = req.query;
    const { id: user_id, level, verifikator } = req.session.user;
    const { email } = req.body;

    // cek exist data
    const cek = await req.knex
      .select("*")
      .from("user")
      .where("id", user_tps_id)
      .first();
    if (!cek) {
      return res
        .status(404)
        .json({ message: "Tidak Ditemukan", type: "error" });
    }

    //cek jika ada email yang sama
    if (email) {
      const cekEmailSama = await req
        .knex("user")
        .where("id", "!=", user_tps_id)
        .andWhere("email", email)
        .first();
      if (cekEmailSama) {
        return res.status(401).json({
          type: "error",
          message:
            "Email yang anda masukan sudah di pakai user lain, silakan masukan email pengganti",
        });
      }
    }

    //validasi jika berhak hapus
    const izin = isEditable(level, verifikator, cek);
    if (!izin) {
      return res.status(400).json({ message: "Tidak Ada Izin", type: "error" });
    }

    // validasi tambahan, jika seandainya menghapus diri sendiri
    const myself = isMyself(user_id, cek.id);
    if (myself) {
      return res
        .status(400)
        .json({ message: "Akses Tidak Benar", type: "error" });
    }

    next();
  } catch (err) {
    getLogger.error(err);
    return res.status(403).json({ message: "Not Allowed" });
  }
}

export default handler()
  .get(async (req, res) => {
    try {
      const { user_tps_id } = req.query;
      const { id: user_id, level, verifikator } = req.session.user;

      const data = await req.knex
        .select(
          "user.*",
          "tps.no as tps_no",
          "tps.title as tps_title",
          "tps.alamat as tps_alamat",
          "provinsi.provinsi",
          "kabkota.kabkota",
          "kecamatan.kecamatan",
          "kelurahan.kelurahan"
        )
        .from("user")
        .innerJoin("tps", "user.tps_id", "tps.id")
        .innerJoin("provinsi", "tps.provinsi_id", "provinsi.id")
        .innerJoin("kabkota", "tps.kabkota_id", "kabkota.id")
        .innerJoin("kecamatan", "tps.kecamatan_id", "kecamatan.id")
        .innerJoin("kelurahan", "tps.kelurahan_id", "kelurahan.id")
        .where("user.level_id", 5) // khusus tps
        .andWhere("user.id", user_tps_id)
        .first();

      if (!data)
        return res
          .status(404)
          .json({ message: "Tidak Ditemukan", type: "error" });

      const result = {
        ...data,
        editable: isEditable(level, verifikator, data),
        myself: isMyself(user_id, data.id),
      };

      res.json(result);
    } catch (error) {
      getLogger.error(error);
      res.status(500).json({ message: "Terjadi Kesalahan...", type: "error" });
    }
  })
  .put(middlewareEdit, async (req, res) => {
    try {
      const { user_tps_id } = req.query;
      const { nama, telp, email, username } = req.body;

      const forUser = {
        nama,
        telp: telp || null,
        email: email || null,
        username,
      };

      const proses = await req
        .knex("user")
        .where("id", user_tps_id)
        .update({
          ...forUser,
          updated_at: req.knex.fn.now(),
        });

      if (!proses) {
        return res.status(400).json({ message: "Gagal Proses", type: "error" });
      }

      res.json({ message: "Berhasil Mengubah Data" });
    } catch (error) {
      getLogger.error(error);
      res.status(500).json({ message: "Terjadi Kesalahan...", type: "error" });
    }
  })
  .delete(middlewareUserTps, async (req, res) => {
    try {
      const { user_tps_id } = req.query;

      const proses = await req.knex("user").where("id", user_tps_id).del();
      if (!proses)
        return res.status(400).json({ message: "Gagal Hapus", type: "error" });

      DeleteUpload(PATH_FOTO, req.currentData.foto);

      res.json({ message: "Berhasil Hapus", type: "success" });
    } catch (error) {
      getLogger.error(error);
      res.status(500).json({ message: "Terjadi Kesalahan...", type: "error" });
    }
  });
