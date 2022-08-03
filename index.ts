import utils from './lib/utils'
import {api, params} from "@serverless/cloud"

// Create GET route and return users
api.get("/months", async (req, res) => {
    let result = utils.monthDiff(new Date(), new Date('2023-03-26'))
    // Return the results
    res.send({
        monthsToDeparture: result,
    });
});

