import { monthDiff } from '../../lib/utils'

test("How many months until departure date from January 2023", () => {
    const departureDate = new Date('2023-03-26')
    expect(monthDiff(new Date('2023-01-03'), departureDate)).toEqual(2)
})

test("Departing the same month", () => {
    const departureDate = new Date('2023-03-26')
    expect(monthDiff(new Date('2023-03-03'), departureDate)).toEqual(0)
})
