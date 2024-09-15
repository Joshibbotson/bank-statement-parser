import dayjs from "dayjs";

export abstract class AbstractStatement<CsvType> {
    async getParsedCsvFile(month: number): Promise<number> {
        const filteredCsv = this.getShoppingResults();
        console.log("filteredCsv:", filteredCsv);
        const targetMonth = dayjs().set("month", month).month();
        console.log("targetMonth:", targetMonth);
        const targetMonthResults = this.getTargetMonthResults(
            targetMonth,
            filteredCsv
        );

        const value = this.sumValues(targetMonthResults);
        return value;
    }

    abstract getShoppingResults(): CsvType[];

    abstract getTargetMonthResults(
        month: number,
        csvData: CsvType[]
    ): CsvType[];

    abstract sumValues(csvData: CsvType[]): number;
}
