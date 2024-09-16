import { Dayjs } from "dayjs";
import { Statements } from "./enum/Statements.enum";
import { NatwestStatement } from "./natwest-statement/NatwestStatement";

export class StatementFactory {
    static async getShoppingResults(
        formattedCsvData: Record<PropertyKey, string>[],
        statementType: Statements,
        selectedDate: Dayjs
    ) {
        if (!formattedCsvData) {
            throw new Error("no formatted data");
        }
        const statement = this.factory(formattedCsvData, statementType);
        return await statement.getParsedCsvFile(selectedDate);
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
