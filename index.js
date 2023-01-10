import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import ConnectDB from "./config/db/index.js";
import route from "./routes/index.js";

import socket from "./app/socket/socket.js";

import { Server } from "socket.io";

const app = express();
// CONFIG
dotenv.config();
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));
app.use(express.json());
app.use(cors());

// CONNECT DB
ConnectDB();
// CONFIG ROUTE
route(app);

const server = app.listen(process.env.PORT, () => {
  console.log("started");
});

// Socket IO
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    origin: "http://localhost:3005",
  },
});
socket(io);
