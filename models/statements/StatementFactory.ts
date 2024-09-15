import { Statements } from "./enum/Statements.enum";
import { NatwestStatement } from "./natwest-statement/NatwestStatement";

export class StatementFactory {
    static async getShoppingResults(
        formattedCsvData: Record<PropertyKey, string>[],
        statementType: Statements,
        selectedMonth: number
    ) {
        if (!formattedCsvData) {
            throw new Error("no formatted data");
        }
        const statement = this.factory(formattedCsvData, statementType);
        return await statement.getParsedCsvFile(selectedMonth);
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
