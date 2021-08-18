import express = require("express");
import cors = require("cors");
import path = require("path");
import diagnoseRouter from "./routes/diagnoses";
import patientRouter from "./routes/patients";
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3001;

app.get("/api/ping", (_req, res) => {
  console.log("someone pinged here");
  res.send("pong");
});

app.use(express.static(path.join(__dirname, "../client/build")));
app.use("/api/diagnoses", diagnoseRouter);
app.use("/api/patients", patientRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
