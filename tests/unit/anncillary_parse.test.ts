import {parseAncillaries} from "../../lib/parseAncillary"

const ancillaries = require('./skiAncillaryDescriptionList.json')

describe("Parse some sample ancillary passenger charges", () => {

  test("Load ancillaries from input file correctly", () => {
    expect(ancillaries).toHaveLength(4)
  })

  test("Parse all ancillaries", () => {
    const result = parseAncillaries(ancillaries)
    expect(result).toHaveProperty('Helmet')
    expect(result).toHaveProperty('Area lift pass')
    expect(result).toHaveProperty('Ski boots')
    expect(result).toHaveProperty('Standard skis')
  })

})




