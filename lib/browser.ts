import puppeteer from "puppeteer"

const Browser = {
    start: async (headless: boolean) => {
        let browser
        try {
            console.log("Opening the browser......")
            browser = await puppeteer.launch({
                headless: headless,
                args: ["--disable-setuid-sandbox", '--single-process', '--no-zygote'],
                "ignoreHTTPSErrors": true
            })
        } catch (err) {
            console.log("Could not create a browser instance => : ", err)
        }
        return browser
    },

    close: async (browser) => {
        console.log('Closing browser')
        await browser.close()
    }

}


export default Browser
