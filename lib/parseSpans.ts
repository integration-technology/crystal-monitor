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
    const descriptionRegex = /([A-Za-z\d\s\(\)\-]+)<\/span></gm
    let description: string
    try {
      description = descriptionRegex.exec(t)[1]
    } catch (e) {
      throw(`Description parse failure: ${t}`)
    }
    return {
      description: description === "Sun 30 Jan 2022" ? `Balance due ${description}` : description,
      amount
    }
  })
}
