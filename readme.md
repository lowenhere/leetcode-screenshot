# LeetCode Screenshot Tool 📷

The LeetCode Screenshot Tool is a convenient tool for capturing screenshots of LeetCode question pages. It utilizes Puppeteer, a headless browser automation library, to navigate to the specified LeetCode question page and capture a screenshot, which is served over an Express server.

## Prerequisites 📋

- Node.js (18.16.0 or higher)

## Installation ⚙️

1. Clone the repository:

```
git clone https://github.com/lowenhere/leetcode-screenshot.git
```

2. Navigate to the project directory:

```
cd leetcode-screenshot-server
```

3. Install the dependencies:

```
npm i
```

## Usage 🚀

You can run the server locally on your machine:

```
npm start
```

Or in a docker container using docker-compose:

```
docker-compose up
```

Both will start the server on `localhost:3000`

Then, navigate to the following url on your browser:

```
http://localhost:3000/leetcode-screenshot?url=https://leetcode.com/problems/two-sum/
```

And replace the `url` query parameter with the url of the problem you want to get an image of.
