import {monthDiff} from './lib/utils'
import {api, events, schedule} from "@serverless/cloud"
import {fetchBookings} from "./lib/booking"
import Browser from './lib/browser'
import Scraper from "./lib/scraper"
import hash from 'object-hash'


// Create GET route and return number of months from departure
api.get("/bookings", async (req, res) => {
    const bookings = await fetchBookings()
    console.info(`Found ${bookings.length} bookings in Airtable`)
    res.json(bookings)
})

api.get("/months", async (req, res) => {
    let result = monthDiff(new Date(), new Date('2023-03-26'))
    // Return the results
    res.send({
        monthsToDeparture: result,
    })
})

api.post("/publish", async (req,res) => {
    console.log('Publishing event:', JSON.stringify(req, null, 2))
    const {message, topic} = req
    const response = await events.publish(topic, message)
    res.json(response)
})


schedule.every("4 hours", async () => {
    // This code block will run every hour!
    console.log("I run every four hours! Fetching the bookings from Airtable and publishing individually as events with a timestamp")
    const bookings = await fetchBookings()
    await Promise.all(bookings.map((booking) => {
        return events.publish('booking.scrape.request', {...booking, timestamp: new Date().toISOString()})
    }))
})

events.on("booking.scrape.request", async ({ body }) => {
    console.info('booking.scrape.request', body)
})

events.on('booking.scrape.request', async ( { booking } ) => {
    console.info('Starting booking scrape request for booking', booking)
    const b = await Browser.start(true)
    const data = await Scraper.scrape(b, booking)
    await Browser.close(b)
    await events.publish('booking.scrape.complete', {...data, ...{txnshash: hash.MD5(booking.txns)}})
})


