import {parseSpans, transaction} from "../../lib/parseSpans"

const spans = require('./span_data.json')

describe("Parse some sample transactions from scrape", () => {

  test("Load spans from input file correctly", () => {
    expect(spans).toHaveLength(20)
  })

  test("Parse a single transaction", () => {
    const data: [string] = [spans[0]]
    const results: transaction[] = parseSpans(data)
    expect(results).toHaveLength(data.length)
    const txn: transaction = results[0]
    expect(txn.amount).toEqual(2000)
    expect(txn.description).toEqual('Wed 29 Jun 2022')
  })

  test("Parse two transactions", () => {
    const data: [string] = spans.slice(1,2)
    const results = parseSpans(data)
    expect(results).toHaveLength(data.length)
  })

  test("Parse empty third transaction", () => {
    const data: [string] = [spans[2]]
    const results = parseSpans(data)
    expect(results).toHaveLength(0)
  })

  test("Parse Total Price", () => {
    const data: [string] = [spans[16]]
    const results = parseSpans(data)
    expect(results).toHaveLength(1)
  })

  test("Parse empty row 19", () => {
    const data: [string] = [spans[18]]
    const results = parseSpans(data)
    expect(results).toHaveLength(0)
  })

  test("Parse ampersand in row 20", () => {
    const data: [string] = [spans[19]]
    const results = parseSpans(data)
    expect(results).toHaveLength(1)
    expect(results[0].description).toEqual("1 x 20% off lift passes & equipment for groups")
  })

  test("Parse all transactions", () => {
    const results = parseSpans(spans)
    expect(results).toHaveLength(18)
  })

})




