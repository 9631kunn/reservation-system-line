require("dotenv").config();
const express = require("express");
const app = express();
const line = require("@line/bot-sdk");
const { lineBot } = require("./line/bot.js");
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

// LINE
const config = {
  channelAccessToken: process.env.ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET,
};

const menus = [
  {
    id: 1,
    menu: "hoge",
  },
  {
    id: 2,
    menu: "bar",
  },
];

app
  .get("/api/menus", (req, res) => res.json(menus))
  .post("/hook", line.middleware(config), (req, res) => lineBot(req, res))
  .listen(PORT, () => console.log("STARTED"));
