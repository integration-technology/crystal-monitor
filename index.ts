
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
  const results = await CrystalScraper.scraper(browser, bookings[0])


})()


