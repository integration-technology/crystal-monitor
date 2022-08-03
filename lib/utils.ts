const utils = {

    monthDiff: (dateFrom: Date, dateTo: Date): number => {
        return dateTo.getMonth() - dateFrom.getMonth() +
            (12 * (dateTo.getFullYear() - dateFrom.getFullYear()))
    }

}

export default utils
