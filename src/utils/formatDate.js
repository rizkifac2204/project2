function addZero(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}

const namaBulan = (bulan, singkat = false) => {
  switch (bulan) {
    case 0:
      bulan = singkat ? "Jan" : "Januari";
      break;
    case 1:
      bulan = singkat ? "Feb" : "Februari";
      break;
    case 2:
      bulan = singkat ? "Mar" : "Maret";
      break;
    case 3:
      bulan = singkat ? "Apr" : "April";
      break;
    case 4:
      bulan = singkat ? "Mei" : "Mei";
      break;
    case 5:
      bulan = singkat ? "Jun" : "Juni";
      break;
    case 6:
      bulan = singkat ? "Jul" : "Juli";
      break;
    case 7:
      bulan = singkat ? "Agu" : "Agustus";
      break;
    case 8:
      bulan = singkat ? "Sep" : "September";
      break;
    case 9:
      bulan = singkat ? "Okt" : "Oktober";
      break;
    case 10:
      bulan = singkat ? "Nov" : "November";
      break;
    case 11:
      bulan = singkat ? "Des" : "Desember";
      break;
  }
  return bulan;
};

const namaHari = (hari) => {
  switch (hari) {
    case 0:
      hari = "Minggu";
      break;
    case 1:
      hari = "Senin";
      break;
    case 2:
      hari = "Selasa";
      break;
    case 3:
      hari = "Rabu";
      break;
    case 4:
      hari = "Kamis";
      break;
    case 5:
      hari = "Jumat";
      break;
    case 6:
      hari = "Sabtu";
      break;
  }
  return hari;
};

function dateIsValid(date) {
  return date instanceof Date && !isNaN(date);
}

const formatedDate = (date, hari = false) => {
  if (!date) return "-";
  if (!dateIsValid(new Date(date))) return "-";
  date = new Date(date);
  var tahun = date.getFullYear();
  var bulan = namaBulan(date.getMonth());
  var tanggal = date.getDate();
  const showhari = hari ? `${namaHari(date.getDay())}, ` : "";
  return showhari + tanggal + " " + bulan + " " + tahun;
};

const formatedDateFromEpoch = (epoch, hari = false) => {
  epoch = new Date(epoch * 1000);
  var tahun = epoch.getFullYear();
  var bulan = namaBulan(epoch.getMonth(), true);
  var tanggal = epoch.getDate();
  const pukul =
    ("0" + epoch.getHours()).slice(-2) +
    ":" +
    ("0" + epoch.getMinutes()).slice(-2);
  const showhari = hari ? `${namaHari(epoch.getDay())}, ` : "";
  return showhari + tanggal + " " + bulan + " " + tahun + " - " + pukul;
};

const formatedDateUntil = (start, end) => {
  if (!start || !end) return;
  const awal = new Date(start);
  const akhir = new Date(end);

  const mulai = {
    tahun: awal.getFullYear(),
    bulan: namaBulan(awal.getMonth()),
    tanggal: awal.getDate(),
  };
  const selesai = {
    tahun: akhir.getFullYear(),
    bulan: namaBulan(akhir.getMonth()),
    tanggal: akhir.getDate(),
  };

  const textMulai = `${mulai.tanggal} ${mulai.bulan} ${mulai.tahun}`;
  const textSelesai = `${selesai.tanggal} ${selesai.bulan} ${selesai.tahun}`;

  return `${textMulai} s/d ${textSelesai}`;
};

const getTime = (date) => {
  date = new Date(date);
  var hour = addZero(date.getHours());
  var minute = addZero(date.getMinutes());
  return hour + ":" + minute;
};

export {
  formatedDate,
  namaBulan,
  namaHari,
  formatedDateUntil,
  formatedDateFromEpoch,
  getTime,
};
