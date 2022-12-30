export type transaction = {
  description: string,
  amount: number
}

export function parseSpans(spans: string[]): transaction[] {
  return spans.filter(s => !s.match(/><\/span>$/)).map(t => {
    console.log("Transaction string:", t)
    const amountRegex = />(\S+)<\/span>/
    let amountString: string
    try {
      amountString = amountRegex.exec(t)[1]
      amountString.replace(/<\/span><span>/, "")
    } catch (e) {
      throw(`Value parse failure:${t}`)
    }
    const amount = parseFloat(amountString.replace(/£/g, ""))
    const descriptionRegex = /([A-Za-z\d\s\(\)\-\&\;\%]+)<\/span></gm
    let description: string
    try {
      t.replace('&amp;', '&')
      description = descriptionRegex.exec(t)[1].trim().replace(/&amp./g, "&")
    } catch (e) {
      throw(`Description parse failure: ${t}`)
    }
    return {
      description: description === "Sun 1 Jan 2023" ? `Balance due ${description}` : description,
      amount
    }
  })
}
