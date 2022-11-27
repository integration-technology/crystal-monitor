export type ancillary = {
  name: string,
  key: string
}


export function parseAncillaries(ancillaries: ancillary[]): any {
  if (!ancillaries) return {}
  // console.log(JSON.stringify(ancillaries, null, 2))
  const regexArray: string[] = ['Helmet', 'boots', 'lift pass', 'skis']
  let results = {}
  ancillaries.map((ancillary) => {
    regexArray.forEach((regex) => {
      if (ancillary.name.match(regex)) {
        results[regex] = ancillary.name
      }
    })
  })
  return results
}
