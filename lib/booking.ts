import { params } from "@serverless/cloud"

import Airtable from "airtable"

export async function fetchBookings() {

    Airtable.configure({
        apiKey: params.AIRTABLE_API_KEY || process.env.AIRTABLE_API_KEY,
    });

// Initialize a base
    const base = Airtable.base(params.AIRTABLE_BASE_ID || process.env.AIRTABLE_BASE_ID)
// Reference a table and get all records
     const bookings =  await base('Booking').select({
        // Selecting the first 3 records in Grid view:
        fields: ["Reference", "Surname", "Departure Date"],
        sort: [{field: "Reference", direction: "asc"}]
    }).all()
    return bookings.map((record) => {
        return record.fields
    })
}
