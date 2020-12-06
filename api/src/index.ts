import path from "path";

//import { createServer, Server } from "http";
require("dotenv").config({ path: path.join(".env") });

const cors = require("cors");
import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import router from "./routes";
// import * as socketIo from "socket.io";

import Socket from "../sockets";

const app: express.Application = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const port: Number = 7000;

app.use("/api", router);

const server = app.listen(port, () => console.log(`Listening on port ${port}`));
//const server: Server = createServer(app);
let io = Socket.init(server);
io.on("connect", () => {
  console.log("WEB SOCKET STUFF");
});
