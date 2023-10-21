import express from "express";
import { fileURLToPath } from 'url'; // Import modul 'url'
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import cookieParser from "cookie-parser";
import multer from "multer";
import path from "path";

const __filename = fileURLToPath(import.meta.url); // Dapatkan __filename dari import.meta.url
const __dirname = path.dirname(__filename); // Dapatkan __dirname dari __filename

const app = express();

app.use(express.json());
app.use(cookieParser());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../client/public/upload"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

app.use("/uploads", express.static(path.join(__dirname, "../client/public/upload")));

const upload = multer({ storage });

app.post("/api/upload", upload.single("file"), function (req, res) {
  const file = req.file;
  res.status(200).json(file.filename);
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);

app.listen(8800, () => {
  console.log("Connected!");
});
