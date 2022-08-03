import {monthDiff} from './lib/utils'
import {api, params, schedule} from "@serverless/cloud"
import {fetchBookings} from "./lib/booking";

// Create GET route and return number of months from departure
api.get("/bookings", async (req, res) => {
    res.send(fetchBookings)
})

api.get("/months", async (req, res) => {
    let result = monthDiff(new Date(), new Date('2023-03-26'))
    // Return the results
    res.send({
        monthsToDeparture: result,
    })
})


schedule.every("1 hour", () => {
    // This code block will run every hour!
    console.log("I run every hour!")
})




