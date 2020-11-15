import path from "path";
require("dotenv").config({ path: path.join(".env") });

const cors = require("cors");
import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import router from "./routes";

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const port: Number = 7000;

app.use("/api", router);

app.listen(port, () => console.log(`Listening on port ${port}`));
