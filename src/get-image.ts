import puppeteer from "puppeteer";

const VIEWPORT_WIDTH = 1920;
const VIEWPORT_HEIGHT = 1080;

const PROBLEM_CONTENT_SELECTOR = ".flexlayout__tab";
const ADS_SELECTOR = ".group\\/ads";

const getImage = async (problem: string): Promise<Buffer> => {
  const browser = await puppeteer.launch({
    headless: "new",
    defaultViewport: {
      width: VIEWPORT_WIDTH,
      height: VIEWPORT_HEIGHT,
    },
  });

  const baseurl = "https://leetcode.com";
  const url = `${baseurl}/problems/${problem}`;

  const page = await browser.newPage();
  try {
    // navigate to leetcode.com and set localstorage
    // to skip the tutorial dialog
    await page.goto(baseurl);
    await page.evaluate(() => {
      localStorage.setItem("dynamicIdeLayoutGuide", "true");
    });

    // go to the question page
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

  // delete ads
  await page.evaluate((selector) => {
    const el = document.querySelector(selector);
    if (el === null) {
      return;
    }
    el.remove();
  }, `${PROBLEM_CONTENT_SELECTOR} ${ADS_SELECTOR}`);

  // get a full-height image
  const height = await content.evaluate((el) => el.scrollHeight);
  await page.setViewport({ width: VIEWPORT_WIDTH, height });

  const buffer = (await content.screenshot({
    type: "jpeg",
  })) as Buffer;
  await browser.close();

  return buffer;
};

export default getImage;
