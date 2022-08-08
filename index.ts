import {monthDiff} from './lib/utils'
import {api, events, schedule} from "@serverless/cloud"
import {fetchBookings} from "./lib/booking";

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


schedule.every("1 hour", async () => {
    // This code block will run every hour!
    console.log("I run every hour! Fetching the bookings from Airtable and publishing individually as events with a timestamp")
    const bookings = await fetchBookings()
    await Promise.all(bookings.map((booking) => {
        return events.publish('booking.scrape.request', {...booking, timestamp: new Date().toISOString()})
    }))
})

events.on("booking.scrape.request", async ({ body }) => {
    console.info('booking.scrape.request', body)
})

events.on('booking.scrape.request', async ( {booking} ) => {
    
})


