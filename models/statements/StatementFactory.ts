import { Dayjs } from "dayjs";
import { Statements } from "./enum/Statements.enum";
import { NatwestStatement } from "./natwest-statement/NatwestStatement";

export class StatementFactory {
    static async getShoppingResults(
        formattedCsvData: Record<PropertyKey, string>[],
        statementType: Statements,
        selectedDate: Dayjs,
        tags?: string[]
    ) {
        if (!formattedCsvData) {
            throw new Error("no formatted data");
        }
        const statement = this.factory(formattedCsvData, statementType);
        const { value, targetMonthResults } = await statement.getParsedCsvFile(
            selectedDate,
            tags
        );
        return { value, targetMonthResults };
    }

    static factory(
        formattedCsvData: Record<PropertyKey, string>[],
        statementType: Statements
    ) {
        switch (statementType) {
            case Statements.NATWEST:
                return new NatwestStatement(formattedCsvData);
        }
    }
}
