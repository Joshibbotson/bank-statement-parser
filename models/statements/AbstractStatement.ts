import dayjs, { Dayjs } from "dayjs";

export abstract class AbstractStatement<CsvType> {
    async getParsedCsvFile(selectedDate: Dayjs): Promise<number> {
        const filteredCsv = this.getShoppingResults();
        console.log("filteredCsv:", filteredCsv);
        const targetMonthResults = this.getTargetMonthResults(
            selectedDate.month(),
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
