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
  await browser.close();
});

test('The header has the correct text', async () => {
  const text = await page.$eval('a.brand-logo', el => el.innerHTML);
  expect(text).toEqual('Blogster');
});

test('clicking login starts oauth flow', async () => {
  await page.click('.right a'); // using the class of the UL to find tag.
  const url = page.url();

  expect(url).toMatch(/accounts\.google\.com/);
});

test.('When signed in shows logout button', async () => {
  // get user is from database users data
  const id = '5b33a2146f2bc587bc3467ff';

  const Buffer = require('safe-buffer').Buffer;
  const sessionObject = {
      passport: {
        user: id
      }
  };
  // Fake login using our sessionObject to creating session and session.sig
  const sessionString = Buffer.from(JSON.stringify(sessionObject))
                        .toString('base64');

  const Keygrip = require('keygrip');
  const keys = require('../config/keys');
  const keygrip = new Keygrip([keys.cookieKey]);

  const sig = keygrip.sign('session=' + sessionString);

  await page.setCookie({ name: 'session', value: sessionString });
  await page.setCookie({ name: 'session.sig', value: sig });

  await page.goto('localhost:3000');
  /*
  console.log('session: ',sessionString);
  console.log('signature: ', sig);
*/


});



