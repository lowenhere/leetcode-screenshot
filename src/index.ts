import { promises as fs } from "fs";
import path from "path";
import express, { Request, Response } from "express";
import morgan from "morgan";

import getImage from "./get-image";

const CACHE_DIR = path.join(__dirname, "../image_cache");

const app = express();
const PORT = 3000;

app.use(morgan("tiny"));

app.get("/leetcode-screenshot", async (req: Request, res: Response) => {
  const { url } = req.query;
  if (!url) {
    const message = "missing leetcode problem url";
    return res.status(500).send(message);
  }

  const regex = /leetcode.com\/problems\/([^/]+)/;
  const match = regex.exec(url as string);
  if (!match) {
    const message = "invalid leetcode problem url";
    return res.status(500).send(message);
  }

  // get problem id
  const problem = match[1];

  // check for cache hit
  let image_cached = false;
  const image_path = path.join(CACHE_DIR, `/${problem}.jpeg`);

  try {
    // fs.access will throw an error if file does not exist
    await fs.access(image_path);
    image_cached = true;
  } catch {}

  if (image_cached) {
    const image = await fs.readFile(image_path);
    res.set("Content-Type", "image/jpeg");
    return res.send(image);
  }

  // if cache miss
  try {
    const image = await getImage(problem);
    await fs.writeFile(image_path, image);

    res.set("Content-Type", "image/jpeg");
    return res.send(image);
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return res.status(500).send(message);
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
