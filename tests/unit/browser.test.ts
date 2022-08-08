import Browser from '../../lib/browser'

test("Can we start a Chromium browser as headless",  async () => {
    const headless = process.env.BROWSER_HEADLESS === 'true' || false
    const b = await Browser.start(headless)
    expect(b).toBeDefined()
    await Browser.close(b)
})


