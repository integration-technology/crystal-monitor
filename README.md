run index.ts in Debug.  Breakpoint on the results.

Use JQ to summarise

## transactions

`.[] | .summaryBooking.Reference, .summaryBooking.Surname, .txns[]`

## balances for bookings

` .[] | {reference: .summaryBooking.Reference, name: .summaryBooking.Surname, txns: .txns[]} | select(.txns.description | contains("outstanding") or contains("Overpaid")) `

## passengers

`.[] | { ref:.summaryBooking.Reference, name: .summaryBooking.Surname, pax: .summaryBooking.pax, rooms: .summaryBooking.rooms}, .passengers[].fullName  `

## rooms

`.[] | .summaryBooking, {rooms: .rooms[] | {type: .type, capacity: .capacity, occupancy: .occupancy}} `
