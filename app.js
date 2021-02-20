require("dotenv").config();

// EXPRESS
const express = require("express");
const app = express();

// CROS
const cors = require("cors");
const corsOptions = {
  origin: "https://liff-beryl.vercel.app",
  optionsSuccessStatus: 200,
};

// LINE
const line = require("@line/bot-sdk");
const { lineBot } = require("./line/bot.js");

// DB / ORM
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// PORT
const PORT = process.env.PORT || 3000;

// LINE
const config = {
  channelAccessToken: process.env.ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET,
};

// JSON
// app.use(bodyParser.json());

app
  // api
  .get(`/api`, async (req, res) => {
    res.json({ up: true });
  })
  .get("/api/user", cors(corsOptions), async (req, res) => {
    const users = await prisma.user.findMany({});
    res.json(users);
  })
  .get("/api/user/:lineUserId", cors(corsOptions), async (req, res) => {
    const user = await prisma.user.findUnique({
      where: {
        lineUid: req.params.lineUserId,
      },
    });
    res.json(user);
  })
  .post("/hook", line.middleware(config), (req, res) => lineBot(req, res))
  .listen(PORT, () => console.log("STARTED"));
