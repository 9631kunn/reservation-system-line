require("dotenv").config();

// EXPRESS
const express = require("express");
const app = express();

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
app.use(bodyParser.json());

const main = async () => {
  await prisma.user.create({
    data: {
      uid: "seed1234567890",
      name: "テスト太郎",
    },
  });
};

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

app
  .get("/api/users", (req, res) => {
    const users = prisma.user.findMany({});
    res.json(users);
  })
  .post("/hook", line.middleware(config), (req, res) => lineBot(req, res))
  .listen(PORT, () => console.log("STARTED"));
