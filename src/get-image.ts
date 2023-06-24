import puppeteer from "puppeteer";

const VIEWPORT_WIDTH = 1920;
const VIEWPORT_HEIGHT = 1080;
const PROBLEM_CONTENT_SELECTOR =
  "#qd-content > div.h-full.flex-col.ssg__qd-splitter-primary-w > div > div > div > div.flex.h-full.w-full.overflow-y-auto.rounded-b > div > div";

const getImage = async (problem: string): Promise<Buffer> => {
  const browser = await puppeteer.launch({
    headless: "new",
    defaultViewport: {
      width: VIEWPORT_WIDTH,
      height: VIEWPORT_HEIGHT,
    },
  });

  const url = `https://leetcode.com/problems/${problem}`;

  const page = await browser.newPage();

  try {
    await page.goto(url, {
      waitUntil: "networkidle2",
    });
  } catch (e) {
    await browser.close();
    console.error(`error navigating to ${url}`);
    console.error(String(e));
    throw new Error(`could not navigate to the page ${url}`);
  }

  const content = await page.$(PROBLEM_CONTENT_SELECTOR);
  if (content === null) {
    await browser.close();
    throw new Error(`leetcode problem content element not found on ${url}`);
  }

  const height = await content.evaluate((el) => el.scrollHeight);
  await page.setViewport({ width: VIEWPORT_WIDTH, height });

  const buffer = (await content.screenshot()) as Buffer;
  await browser.close();

  return buffer;
};

export default getImage;
