import Browser from '../../lib/browser'
import Scraper from "../../lib/scraper";
const event = require('./event_data.json')    // see event_data_template.json
beforeEach(async () => {
    jest.setTimeout(50000)
})

test("Take in an event and scrape", async () => {

    const headless = process.env.BROWSER_HEADLESS === 'true' || false
    const b = await Browser.start(headless)
    const data = await Scraper.scrape(b, event)
    await Browser.close(b)
})


