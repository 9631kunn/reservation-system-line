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

// DB
async function main() {
  const allUsers = await prisma.user.findMany();
  console.log(allUsers);
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

// LINE
const config = {
  channelAccessToken: process.env.ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET,
};

app
  .get("/api/seed", async (req, res) => {
    const seedUser = {
      uid: `seed${Math.random() * 10000}`,
      name: "テスト太郎",
      profile: {
        create: {
          bio: "テスト太郎です",
        },
      },
    };
    const result = await prisma.user.create({
      data: seedUser,
    });
    res.json(result);
  })
  .get("/api/menus", (req, res) => res.json(menus))
  .get("/api/users", (req, res) => res.json(users))
  .post("/hook", line.middleware(config), (req, res) => lineBot(req, res))
  .listen(PORT, () => console.log("STARTED"));
