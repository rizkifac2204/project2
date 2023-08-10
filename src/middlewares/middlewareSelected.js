import getLogger from "middlewares/getLogger";

export async function middlewareProvinsiSelected(req, res, next) {
  try {
    const { provinsi_id } = req.query;
    let blokir = false;
    if (provinsi_id && process.env.PROVINSI) {
      if (process.env.PROVINSI.length == 2) {
        blokir = provinsi_id !== process.env.PROVINSI;
      } else {
        blokir = !process.env.PROVINSI.split(",").includes(provinsi_id);
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
        if (process.env.PROVINSI) {
          if (process.env.PROVINSI.length == 2) {
            builder.where("id", process.env.PROVINSI);
          } else {
            builder.whereIn("id", process.env.PROVINSI.split(","));
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
    if (kabkota_id && process.env.KABKOTA) {
      if (process.env.KABKOTA.length == 4) {
        blokir = kabkota_id !== process.env.KABKOTA;
      } else {
        blokir = !process.env.KABKOTA.split(",").includes(kabkota_id);
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
        if (process.env.KABKOTA) {
          if (process.env.KABKOTA.length == 4) {
            builder.where("id", process.env.KABKOTA);
          } else {
            builder.whereIn("id", process.env.KABKOTA.split(","));
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
    if (kecamatan_id && process.env.KECAMATAN) {
      if (process.env.KECAMATAN.length == 6) {
        blokir = kecamatan_id !== process.env.KECAMATAN;
      } else {
        blokir = !process.env.KECAMATAN.split(",").includes(kecamatan_id);
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
        if (process.env.KECAMATAN) {
          if (process.env.KECAMATAN.length == 6) {
            builder.where("id", process.env.KECAMATAN);
          } else {
            builder.whereIn("id", process.env.KECAMATAN.split(","));
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
