import {fetchBookings} from "../../lib/booking"

test("Test able to connect to base", async () => {
    const result = await fetchBookings()
    expect(result).toHaveLength(7)
})
