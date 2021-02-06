require("dotenv").config();
const express = require("express");
const app = express();
const line = require("@line/bot-sdk");
const lineBot = require("./line/bot.js");
const { Client } = require("pg");
const PORT = process.env.PORT || 3000;

// DB
const connection = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});
connection.connect();

app.post("/hook", line.middleware(config), (req, res) => lineBot(req, res)).listen(PORT, () => console.log("STARTED"));
