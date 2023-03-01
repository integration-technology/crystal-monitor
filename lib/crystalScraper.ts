import {monthDiff} from "./utils"
import {parseSpans, transaction} from './parseSpans'
import {parseAncillaries} from "./parseAncillary"


// @ts-ignore
const CrystalScraper = {
  url: "https://www.crystalski.co.uk/ski-holidays/your-account/managemybooking/login/",
  acceptCookiesSelector: "#cmCloseBanner",
  bookingReferenceFieldsSelector: "#bookingReferenceno",
  leadPassengerSurnameFieldSelector: "#name",
  loginButtonSelector: "#submit-button",
  logoutButtonSelector: "#Logout__component > div > div > div > a",
  paymentHistorySelector: "#DirectDebit__component > div > div > div.UI__makePaymentContent > div > div.UI__directDebitAmountWrapper > div.UI__directDebitWrapper > div > div > a > span",
  departureDateSelector: "#when",
  paymentDescriptionSelector: "body > div:nth-child(38) > div > section > section > div > div > div.scrollers__scroll.scrollers__hasVerticalScrollbar.scrollContent > div:nth-child(1) > div > div:nth-child(1) > div:nth-child(6)",
  modalCloseSelector: "body > div:nth-child(38) > div > section > section > header > span",
  // transactionSelector: "div.UI__priceDescription > div.UI__priceDetails",
  transactionSelector: "div.UI__priceDetails",
  calendarSelector: "#when",
  uiRoomCard :"div.UI__roomCard",

  async parsePassengers(page) {
    const passengersViewComponent = await page.evaluate((varName) => window[varName], "passengerComponentJsonData")
    return passengersViewComponent.passengerViewData.map(p => {
      const ancillaries = parseAncillaries(p.passengerExtraFacilityViewData.skiAncillaryDescriptionList)
      return {
        ...{
          lastName: p.lastName,
          fullName: p.passengerLabel,
          firstName: p.firstName,
          dateofbirth: p.dateofbirth,
          age: p.age,
          handLuggage: p.passengerExtraFacilityViewData.handLuggageDescription,
          holdLuggage: p.passengerExtraFacilityViewData.luggageDescription,
          skiCarriage: p.passengerExtraFacilityViewData?.carriagesList?.[0]
        }, ...{ ancillaries }
      }
    })
  },

  async parseRooms(page) {
    await page.waitForSelector(this.uiRoomCard, {timeout: 3000})
    const rooms = await page.$$(this.uiRoomCard)
    console.log("Room count:", rooms.length)
    const spans = await Promise.all(rooms.map(async room => {
      const nameElement = await room.$("h4 > span")
      return await room.evaluate(el => el.innerText, nameElement)
    }))
    return spans.map(roomString => {
      const roomParts = roomString.split("\n\n")
      const regEx = /:\s(.*)$/gm
      return {
        name: roomParts[0].split(" (")[0],
        occupancy: /\((.*)\)/gm.exec(roomParts)[1],
        type: roomParts[1],
        capacity: regEx.exec(roomParts[3])[1]
      }
    })
  },

  parseTransactions: async function (page): Promise<transaction[]> {
    const transactions = await page.$$(this.transactionSelector, {timeout: 14000})
    const spans: string[] = await Promise.all(transactions.map(async txn => {
      const innerHtmlElement = await txn.getProperty("innerHTML")
      return innerHtmlElement.toString()
    }))
    return parseSpans(spans)
  },

  login: async function (page, booking) {
    if (booking['first'] == true) {
      await page.click(this.acceptCookiesSelector)
    }
    const departureDate = new Date(booking['Departure Date'])
    const monthsInFuture = monthDiff(new Date(), departureDate)
    console.log('Months in the future:', monthsInFuture)
    await page.waitForSelector(this.bookingReferenceFieldsSelector, {timeout: 8000})
    await page.type(this.bookingReferenceFieldsSelector, booking.Reference)
    await page.type(this.leadPassengerSurnameFieldSelector, booking.Surname)
    await page.waitForSelector(this.calendarSelector, {timeout: 3000})
    await page.click(this.calendarSelector)
    for (let i = 1; i <= monthsInFuture; i++) {
      await page.click("#contentDiv > div > div.month-navigator > a.next")
    }
    await page.click("#contentDiv > div > div.month > table > tbody > tr:nth-child(4) > td:nth-child(7)")
    await page.click(this.loginButtonSelector)
    console.log("Logged in, loading booking information", booking.Reference)
    await page.waitForNavigation()
  },

  async scraper(browser, booking) {
    let page = await browser.newPage()
    await page.setUserAgent(
      " Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.75 Safari/537.36 "
    )
    console.log(`Navigating to ${this.url}...`)
    await page.goto(this.url)
    await this.login(page, booking)
    let passengers
    try {
      passengers = await this.parsePassengers(page)
    } catch (e) {
      throw (e)
    }
    const rooms = await this.parseRooms(page)
    console.log("Loading payment information")
    await page.click(this.paymentHistorySelector)
    console.log('Parsing transactions')
    await page.waitForSelector(this.transactionSelector)
    const txns = await this.parseTransactions(page)
    console.log(`Loaded ${txns.length} transactions`)
    console.log("Closing transaction modal")
    await page.click(".components__close")
    console.log("Logging out of the booking", booking.Reference)
    await page.click(this.logoutButtonSelector)
    const summary = {
      pax: passengers.length, rooms: rooms.length
    }
    const summaryBooking = {...booking, ...summary}
    return {summaryBooking, passengers, txns, rooms}
  }
}

export default CrystalScraper
