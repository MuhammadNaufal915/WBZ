import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  page.on('requestfailed', request => console.log('REQUEST FAILED:', request.url(), request.failure()?.errorText));
  page.on('response', response => {
    if (!response.ok()) {
      console.log('RESPONSE ERROR:', response.status(), response.url());
    }
  });

  await page.goto('http://localhost/WBZ/public/', { waitUntil: 'networkidle0' });
  
  const content = await page.content();
  console.log('HTML SNIPPET:', content.substring(0, 200) + '...' + content.substring(content.length - 200));

  await browser.close();
})();
