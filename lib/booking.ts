import Airtable from "airtable"
import {getEnv} from './utils'
export async function fetchBookings() {

    Airtable.configure({
        apiKey: getEnv('AIRTABLE_API_KEY')
    });

// Initialize a base
    const base = Airtable.base(getEnv('AIRTABLE_BASE_ID'))
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
