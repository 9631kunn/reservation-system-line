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
const { Client } = require("pg");

// PORT
const PORT = process.env.PORT || 3000;

// LINE
const config = {
  channelAccessToken: process.env.ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET,
};

const main = async () => {
  await prisma.user.create({
    data: {
      uid: `seed1234567890`,
      name: "テスト太郎",
      profile: {
        create: {
          bio: "テスト太郎です",
        },
      },
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
  .get("/api/users", async (req, res) => {
    const users = await prisma.user.findMany({});
    res.json(users);
  })
  .post("/hook", line.middleware(config), (req, res) => lineBot(req, res))
  .listen(PORT, () => console.log("STARTED"));
