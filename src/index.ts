import express, { Request, Response } from "express";
import morgan from "morgan";

import getImage from "./get-image";

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

  try {
    const image = await getImage(match[1]);
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
