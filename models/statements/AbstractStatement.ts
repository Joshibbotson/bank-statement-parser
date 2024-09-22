import { Dayjs } from "dayjs";

export abstract class AbstractStatement<CsvType> {
    async getParsedCsvFile(
        selectedDate: Dayjs,
        tags?: string[]
    ): Promise<{ value: number; targetMonthResults: CsvType[] }> {
        const filteredCsv = this.getShoppingResults(tags);
        const targetMonthResults = this.getTargetMonthResults(
            selectedDate.month(),
            filteredCsv
        );

        const value = this.sumValues(targetMonthResults);
        return { value, targetMonthResults };
    }

    abstract getShoppingResults(tags?: string[]): CsvType[];

    abstract getTargetMonthResults(
        month: number,
        csvData: CsvType[]
    ): CsvType[];

    abstract sumValues(csvData: CsvType[]): number;
}
