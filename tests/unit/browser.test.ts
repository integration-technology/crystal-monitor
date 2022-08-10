import Browser from '../../lib/browser'

beforeEach(async () => {
    jest.setTimeout(50000)
})

test("Can we start a Chromium browser as headless",  async () => {
  const headless = process.env.BROWSER_HEADLESS === 'true' || false
  console.log("Headless mode", headless)
  const b = await Browser.start(headless)
  expect(b).toBeDefined()
  await Browser.close(b)
})


