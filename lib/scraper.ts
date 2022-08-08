import CrystalScraper from "./crystalScraper";

const Scraper = {
     scrape: async (browserInstance, event) => {
        let browser
        try {
            browser = await browserInstance
            return await CrystalScraper.scraper(browser, event)
        } catch (err) {
            console.log("Browser fatal error performing the scrape => ", err)
        }
    }
}
export default Scraper
