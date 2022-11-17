import {monthDiff} from './lib/utils'
import {api, events, schedule} from "@serverless/cloud"
import {fetchBookings} from "./lib/booking"
import Browser from './lib/browser'
import Scraper from "./lib/scraper"
import hash from 'object-hash'


(async () => {
  const bookings = await fetchBookings()
  console.info(`Found ${bookings.length} bookings in Airtable`)
})()


