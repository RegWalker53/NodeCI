const puppeteer = require('puppeteer');

test('Desrciption of the test', () => {
  // test activity
  const sum = 1 + 2;

  expect(sum).toEqual(3);
});

test('Can we launch a browser', async () => {
  // launch chromium
  const browser = await puppeteer.launch({
    headless: false
  });
  const page = await browser.newPage();
  await page.goto('localhost:3000');
});
