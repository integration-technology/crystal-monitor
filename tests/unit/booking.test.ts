import {fetchBookings} from "../../lib/booking"

test("Test able to connect to base", async () => {
    const bookings = await fetchBookings()
    expect(bookings).toHaveLength(7)
    expect(bookings[0]).toHaveProperty('Departure Date')
    expect(bookings[0]).toHaveProperty('Reference')
})

test("Contain the correct booking Properties", async () => {
    const bookings = await fetchBookings()
    const booking = bookings[0]
    expect(booking).toHaveProperty('Departure Date')
    expect(booking).toHaveProperty('Reference')
    expect(booking).toHaveProperty('Surname')
})
