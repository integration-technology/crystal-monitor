import {params} from "@serverless/cloud"

export function monthDiff(dateFrom: Date, dateTo: Date): number {
    return dateTo.getMonth() - dateFrom.getMonth() +
        (12 * (dateTo.getFullYear() - dateFrom.getFullYear()))
}

export function getEnv(name: string): string {
  let val = process.env[name]
  if ((val === undefined) || (val === null)) {
    throw ("missing env or params var for " + name)
  }
  return val
}
