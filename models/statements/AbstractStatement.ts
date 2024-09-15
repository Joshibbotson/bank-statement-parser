import dayjs from "dayjs";

export abstract class AbstractStatement<CsvType> {
    /** Probs need to redo this method, it's pretty hard coded right now
     * should accept a month and or in general a target set of strings
     */
    async getParsedCsvFile(targetMonth: number) {
        const filteredCsv = this.getShoppingResults();
        const lastMonth = dayjs()
            .set("month", dayjs().month() - 1)
            .month();
        const targetMonthResults = this.getTargetMonthResults(
            lastMonth,
            filteredCsv
        );

        const value = this.sumValues(targetMonthResults);
        console.log("total spent:", `£${value}`);
    }
    abstract getShoppingResults(): CsvType[];

    abstract getTargetMonthResults(
        month: number,
        csvData: CsvType[]
    ): CsvType[];

    abstract sumValues(csvData: CsvType[]): number;
}
