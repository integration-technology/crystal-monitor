import {run} from 'node-jq'

async function ancillariesReport(data) {
  const ancillaries = await run(".[].passengers[] | [.fullName, .age, .ancillaries]", data, {input: "json"})
  const paxBookingCount = await run(".[].passengers | length", data, {input: "json"})
  // @ts-ignore
  const paxCount = paxBookingCount.split('\n').reduce((partialSum, a) => partialSum + parseInt(a), 0)
  console.log(ancillaries)
  console.log('Total pax', paxCount)
  console.log("\n\n")
}

async function bookingReport(data) {
  const bookingsString = await run("[.[].summaryBooking]", data, {input: "json"})
  // @ts-ignore
  const bookings = JSON.parse(bookingsString)
  console.log('--- Pax by Bookings --')
  let total: number = 0
  bookings.map((b) => {
    console.log(`${b.Reference}: ${b.pax}`)
    total += b.pax
  })
  console.log('Sum of Pax by bookings:', total)

}

async function transactionsReport(data) {
  console.log('--- Txns by Bookings --')
  let ancillaryCost: number = 0
  data.map((b) => {
    console.log(`${b.summaryBooking.Reference}:`)
    let bookingAncillaryCost: number = 0
    b.txns.map(t => {
      const ancillaryRegex = /hire|^\d+/gm
      console.log(`\t${t.description.trim()} ${t.description.match(ancillaryRegex) ? '✅' : ''}, ${t.amount}`)
      if (t.description.match(ancillaryRegex)) {
        ancillaryCost += t.amount
        bookingAncillaryCost += t.amount
      }
    })
    console.log(`\tBOOKING ANCILLARY: ${bookingAncillaryCost}\n`)
  })
  console.log("\n\nTOTAL ANCILLARY COST", ancillaryCost)

}

(async () => {
  const data = require("/Users/owain/Library/Application Support/JetBrains/WebStorm2022.1/scratches/Crystal Scrape/2022-11-27_10481669546091.json")
  await ancillariesReport(data)
  await bookingReport(data)
  await transactionsReport(data)
})()
