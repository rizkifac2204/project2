const knexConfig = {
  client: "mysql",
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  },
  pool: {
    min: 0, // Jumlah minimum koneksi yang akan dipertahankan dalam pool
    max: 7, // Jumlah maksimum koneksi yang dapat ada dalam pool
  },
};

export default knexConfig;
