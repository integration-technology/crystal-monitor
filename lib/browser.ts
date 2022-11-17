import puppeteer from "puppeteer-extra"
import StealthPlugin from 'puppeteer-extra-plugin-stealth'
import {getEnv} from './utils'

puppeteer.use(StealthPlugin())

const Browser = {
  start: async (headless: boolean) => {
    let browser
    try {
      console.log("Opening the browser......")
      browser = await puppeteer.launch({
        headless: headless,
        executablePath: getEnv('PUPPETEER_EXECUTABLE_PATH'),
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
