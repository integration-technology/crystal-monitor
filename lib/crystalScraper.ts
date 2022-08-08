import { monthDiff } from "./utils";


const CrystalScraper = {
    url: "https://www.crystalski.co.uk/ski-holidays/your-account/managemybooking/login/",
    acceptCookiesSelector: "#cmCloseBanner",
    bookingReferenceFieldsSelector: "#bookingReferenceno",
    leadPassengerSurnameFieldSelector: "#name",
    loginButtonSelector: "#submit-button",
    logoutButtonSelector: "#Logout__component > div > div > div > a",
    paymentHistorySelector: "#DirectDebit__component > div > div > div.UI__makePaymentContent > div > div.UI__directDebitAmountWrapper > div.UI__directDebitViewDetails > div > a",
    departureDateSelector: "#when",
    paymentDescriptionSelector: "body > div:nth-child(38) > div > section > section > div > div > div.scrollers__scroll.scrollers__hasVerticalScrollbar.scrollContent > div:nth-child(1) > div > div:nth-child(1) > div:nth-child(6)",
    modalCloseSelector: "body > div:nth-child(38) > div > section > section > header > span",
    transactionSelector: "div.UI__priceDescription > div.UI__priceDetails",

    async parsePassengers(page) {
        const passengersViewComponent = await page.evaluate((varName) => window[varName], "passengerComponentJsonData")
        return passengersViewComponent.passengerViewData.map(p => {
            return {
                lastName: p.lastName,
                fullName: p.passengerLabel,
                firstName: p.firstName,
                dateofbirth: p.dateofbirth,
                age: p.age,
                handLuggage: p.passengerExtraFacilityViewData.handLuggageDescription,
                holdLuggage: p.passengerExtraFacilityViewData.luggageDescription
            }
        })
    },

    async parseRooms(page) {
        const rooms = await page.$$("div.UI__roomCard")
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

    async parseTransactions(page) {
        const transactions = await page.$$(this.transactionSelector)
        const spans = await Promise.all(transactions.map(async txn => {
            const innerHtmlElement = await txn.getProperty("innerHTML")
            return innerHtmlElement.toString()
        }))
        return spans.filter(s => !s.match(/^JSHandle:<span></)).map(t => {
            // console.log("Transaction string", t)
            const amountRegex = />(\S+)<\/span>$/
            const amountString = amountRegex.exec(t)[1]
            const amount = parseFloat(amountString.replace(/£/g, ""))
            const descriptionRegex = /<span>(.+)<\/span><span\s/gm
            const description = descriptionRegex.exec(t)[1]
            return {
                description: description === "Sun 30 Jan 2022" ? `Balance due ${description}` : description,
                amount
            }
        })
    },

    async scraper(browser, booking) {
        let data = []
        let page = await browser.newPage()
        console.log(`Navigating to ${this.url}...`)
        await page.goto(this.url)
        await page.click(this.acceptCookiesSelector)
        const departureDate = new Date(booking['Departure Date'])
        const monthsInFuture = monthDiff(new Date(), departureDate)
        console.log('Months in the future:', monthsInFuture)
        await page.waitForSelector(this.bookingReferenceFieldsSelector, {timeout: 8000})
        await page.type(this.bookingReferenceFieldsSelector, booking.Reference)
        await page.type(this.leadPassengerSurnameFieldSelector, booking.Surname)
        await page.click("#tui_widget_searchpanel_views_AmendDepartureDate_0 > div.cal-trigger")
        for (let i = 1; i <= monthsInFuture; i++) {
            await page.click("#contentDiv > div > div.month-navigator > a.next")
        }
        await page.click("#contentDiv > div > div.month > table > tbody > tr:nth-child(4) > td:nth-child(7)")
        await page.click(this.loginButtonSelector)
        console.log("Logged in, loading booking information", booking.reference)
        await page.waitForNavigation()
        const passengers = await this.parsePassengers(page)
        const rooms = await this.parseRooms(page)
        console.log("Logged in, loading payment information")
        await page.click(this.paymentHistorySelector)
        await page.waitForSelector(this.transactionSelector)
        const txns = await this.parseTransactions(page)
        console.log("Closing transaction modal")
        await page.click(".components__close")
        console.log("Logging out of the booking", booking.reference)
        await page.click(this.logoutButtonSelector)
        data.push({booking, passengers, txns, rooms})
        console.log("saved booking information")
        return data
    }
}

export default CrystalScraper
