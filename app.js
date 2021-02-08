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

app
  .get("/api/seed", async (req, res) => {
    const seedUser = await prisma.user.create({
      uid: `seed123456`,
      name: "テスト太郎",
      profile: {
        create: {
          bio: "テスト太郎です",
        },
      },
    });
    res.send("seeded");
  })
  .get("/api/users", (req, res) => res.json(users))
  .post("/hook", line.middleware(config), (req, res) => lineBot(req, res))
  .listen(PORT, () => console.log("STARTED"));
