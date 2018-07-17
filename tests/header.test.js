const puppeteer = require('puppeteer');

let browser, page; // initializes the variables outside function scope

beforeEach(async () => {
  // performs pre-test setup

  // launch chromium
  browser = await puppeteer.launch({
    headless: false
  });

  // open a new page with app at .goto target
  page = await browser.newPage();
  await page.goto('localhost:3000');
});

afterEach(async () => {
  // performs post test clean up
  await browser.close;
});

test('The header ahs the correct text', async () => {
  const text = await page.$eval('a.brand-logo', el => el.innerHTML);
  expect(text).toEqual('Blogster');
});

test('clicking login starts oauth flow', async () => {
  await page.click('.right a'); // using the class of the UL to find tag.
  const url = page.url();

  expect(url).toMatch(/accounts\.google\.com/);
});
