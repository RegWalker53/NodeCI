const Page = require('./helpers/page');

let page; // initializes the variables outside function scope

beforeEach(async () => { // performs pre-test setup

  // open a new page with app at .goto target
  page =  await Page.build(); // builds the Proxy, browser and page objects
//  console.log('created a page');
  await page.goto('http://localhost:3000');
});

afterEach(async () => { // performs post test clean up
  await page.close();
});

test('The header has the correct text', async () => {
  const text = await page.getContentsOf('a.brand-logo');

  expect(text).toEqual('Blogster');
});

test('clicking login starts oauth flow', async () => {
  await page.click('.right a'); // using the class of the UL to find tag.
  const url = page.url();

  expect(url).toMatch(/accounts\.google\.com/);
});

test('When signed in shows logout button', async () => {
  await page.login();

  // Test assertion that screen shows logout link whe logged in.
  const text = await page.getContentsOf('a[href="/auth/logout"]');

  expect(text).toEqual('Logout');

});




