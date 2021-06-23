import express from "express";
const auth = require("./routes/auth");
require("dotenv").config();
const morgan = require("morgan");
const cors = require("cors");
import mongoose from "mongoose";

const app = express();

//DB Connect
mongoose
  .connect(process.env.DB, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log("DB Connected..."))
  .catch((err) => console.log(err));

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Route Middlewares

app.use("/api", auth);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
