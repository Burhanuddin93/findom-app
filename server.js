const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const swagger = require("./config/swagger");
const morgan = require("morgan");
const connectDB = require("./config/db");

// Import rute
const pelangganRoutes = require("./routes/pelangganRoutes");
const laporanBulananRoutes = require("./routes/laporanBulananRoutes");
const laporanTahunanRoutes = require("./routes/laporanTahunanRoutes");
const errorHandler = require("./middleware/errorHandler");
const authRoutes = require("./routes/authRoutes");


dotenv.config();
connectDB();
const app = express();
const PORT = process.env.PORT || 5000;

// Daftar origin yang diizinkan
const allowedOrigins = [
  'http://localhost:57262', // Origin pertama
  'http://localhost:59433', // Origin kedua
];

// Konfigurasi CORS
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // Izinkan request tanpa origin
    if (allowedOrigins.includes(origin)) {
      callback(null, true); // Izinkan origin yang valid
    } else {
      callback(new Error('Not allowed by CORS')); // Tolak origin yang tidak valid
    }
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
}));

// Middleware
app.use(express.json());
app.use(morgan("dev")); // Logging HTTP requests

// Middleware logging manual (opsional)
app.use((req, res, next) => {
  console.log(`Request URL: ${req.url}`);
  console.log(`Request Method: ${req.method}`);
  next();
});

// Koneksi MongoDB
// mongoose.connect(process.env.MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// }).then(() => {
//   console.log("✅ MongoDB terkoneksi server.js");
// }).catch((err) => {
//   console.error("❌ MongoDB gagal terkoneksi server.js:", err);
// });

// Rute
app.use("/api/auth", authRoutes);
app.use("/api/pelanggans", pelangganRoutes);
app.use("/api/laporan-bulanan", laporanBulananRoutes);
// app.use("/api/laporan-tahunan", laporanTahunanRoutes);

// Swagger
swagger(app);

// Error handling
app.use(errorHandler);

// Jalankan server
app.listen(PORT, () => {
  console.log(`✅ OK Server.js findom_app berjalan di port ${PORT}`);
});