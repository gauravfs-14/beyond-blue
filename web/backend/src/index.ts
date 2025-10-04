import express from "express";
import { hi } from "@/db/hi";

const app = express();

app.get("/ping", (_, res) => {
  res.send(hi);
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
