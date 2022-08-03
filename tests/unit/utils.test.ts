import utils from '../../lib/utils'

test("How many months until departure date from August 2022",  () => {
    const departureDate = new Date('2023-03-26')
    expect(utils.monthDiff(new Date('2022-08-03'), departureDate)).toEqual(7)
})

test("How many months until departure date from January 2023", () => {
    const departureDate = new Date('2023-03-26')
    expect(utils.monthDiff(new Date('2023-01-03'), departureDate)).toEqual(2)
})

test("Departing the same month", () => {
    const departureDate = new Date('2023-03-26')
    expect(utils.monthDiff(new Date('2023-03-03'), departureDate)).toEqual(0)
})
