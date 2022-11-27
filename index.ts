
import {fetchBookings} from "./lib/booking"
import Browser from './lib/browser'
import Scraper from "./lib/scraper"
import hash from 'object-hash'
import CrystalScraper from "./lib/crystalScraper"


(async () => {
  let bookings
  try {
    bookings = await fetchBookings()
    console.info(`Found ${bookings.length} bookings in Airtable`)
  } catch (e) {
    console.error('Failed to access the Aitable bookings', e)
  }
  const browser = await Browser.start(false)
  let results = []
  bookings[0]['first'] = true
  for (const booking of bookings) {
    console.log(JSON.stringify(booking, null, 2))
    results.push(await CrystalScraper.scraper(browser, booking))
  }
  await Browser.close(browser)
  console.log(results)
})()


