import getLogger from "middlewares/getLogger";
import { PROVINSI, KABKOTA, KECAMATAN } from "assets/appConfig";

export async function middlewareProvinsiSelected(req, res, next) {
  try {
    const { provinsi_id } = req.query;
    let blokir = false;
    if (provinsi_id && PROVINSI) {
      if (PROVINSI.length == 2) {
        blokir = provinsi_id !== PROVINSI;
      } else {
        blokir = !PROVINSI.split(",").includes(provinsi_id);
      }
    }
    if (blokir)
      return res
        .status(400)
        .json({ message: "Tidak Ada Akses", type: "error" });

    const data = await req
      .knex("provinsi")
      .select("id")
      .modify((builder) => {
        if (PROVINSI) {
          if (PROVINSI.length == 2) {
            builder.where("id", PROVINSI);
          } else {
            builder.whereIn("id", PROVINSI.split(","));
          }
        }
      });

    req.arrayProvinsi = data.map((item) => item.id);
    next();
  } catch (err) {
    getLogger.error(err);
    return res.status(403).json({ message: "Not Allowed" });
  }
}

export async function middlewareKabkotaSelected(req, res, next) {
  try {
    const { kabkota_id } = req.query;
    let blokir = false;
    if (kabkota_id && KABKOTA) {
      if (KABKOTA.length == 4) {
        blokir = kabkota_id !== KABKOTA;
      } else {
        blokir = !KABKOTA.split(",").includes(kabkota_id);
      }
    }
    if (blokir)
      return res
        .status(400)
        .json({ message: "Tidak Ada Akses", type: "error" });

    const data = await req
      .knex("kabkota")
      .select("id")
      .modify((builder) => {
        if (KABKOTA) {
          if (KABKOTA.length == 4) {
            builder.where("id", KABKOTA);
          } else {
            builder.whereIn("id", KABKOTA.split(","));
          }
        }
      })
      .whereIn("provinsi_id", req.arrayProvinsi);

    req.arrayKabkota = data.map((item) => item.id);
    next();
  } catch (err) {
    getLogger.error(err);
    return res.status(403).json({ message: "Not Allowed" });
  }
}

export async function middlewareKecamatanSelected(req, res, next) {
  try {
    const { kecamatan_id } = req.query;
    let blokir = false;
    if (kecamatan_id && KECAMATAN) {
      if (KECAMATAN.length == 6) {
        blokir = kecamatan_id !== KECAMATAN;
      } else {
        blokir = !KECAMATAN.split(",").includes(kecamatan_id);
      }
    }
    if (blokir)
      return res
        .status(400)
        .json({ message: "Tidak Ada Akses", type: "error" });

    const data = await req
      .knex("kecamatan")
      .select("id")
      .modify((builder) => {
        if (KECAMATAN) {
          if (KECAMATAN.length == 6) {
            builder.where("id", KECAMATAN);
          } else {
            builder.whereIn("id", KECAMATAN.split(","));
          }
        }
      })
      .whereIn("kabkota_id", req.arrayKabkota);

    req.arrayKecamatan = data.map((item) => item.id);
    next();
  } catch (err) {
    getLogger.error(err);
    return res.status(403).json({ message: "Not Allowed" });
  }
}
