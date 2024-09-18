import dayjs from "dayjs";
import { NatwestStatementCsv } from "./types/NatwestStatementType";
import { AbstractStatement } from "../AbstractStatement";
import { NatwestStatementCsvKeys } from "./enum/NatwestHeaderKeys.enum";

export class NatwestStatement extends AbstractStatement<NatwestStatementCsv> {
    private readonly _formattedCsvData: NatwestStatementCsv[];
    constructor(csvData: Record<PropertyKey, string>[]) {
        super();

        const validCsvType = this.checkCsvMatchesGivenType(csvData);
        if (!validCsvType)
            throw new Error(
                "Invalid Csv Type, CSV headers do not match chosen Statement type."
            );
        this._formattedCsvData = this.transformCsvData(csvData);
    }

    private checkCsvMatchesGivenType(
        csvData: Record<PropertyKey, string>[]
    ): boolean {
        console.log("comparing...");
        const csvObject = csvData[0];
        if (
            Object.keys(csvObject).length !==
            Object.keys(NatwestStatementCsvKeys).length
        ) {
            console.log("different length");
            return false;
        }
        const validKeysSet = new Set(
            Object.values(NatwestStatementCsvKeys) as string[]
        );

        for (const key of Object.keys(csvObject)) {
            if (!validKeysSet.has(key)) {
                return false;
            }
        }
        return true;
    }

    private transformCsvData(
        csvData: Record<PropertyKey, string>[]
    ): NatwestStatementCsv[] {
        return csvData.map(lineObj => {
            const NatwestStatementLine: NatwestStatementCsv = {
                Date: dayjs(lineObj["Date"]).toDate(),
                Type: lineObj["Type"],
                Description: lineObj["Description"],
                Value: parseFloat(lineObj["Value"]),
                Balance: parseFloat(lineObj["Balance"]),
                "Account Name": lineObj["Account Name"],
                "Account Number": lineObj["Account Number"],
            };
            return NatwestStatementLine;
        }) as NatwestStatementCsv[];
    }

    getShoppingResults(tags?: string[]): NatwestStatementCsv[] {
        const targetShops = tags || [
            "tesco stores",
            "morrisons",
            "asda stores",
            "sainsbury's",
        ];
        console.log("_formattedCsvData:", this._formattedCsvData);
        return this._formattedCsvData.filter(line =>
            targetShops.some(shop =>
                line["Description"].toLowerCase().includes(shop)
            )
        );
    }

    getTargetMonthResults(
        month: number,
        csvData: NatwestStatementCsv[]
    ): NatwestStatementCsv[] {
        console.log("passed in data:", csvData);
        return csvData.filter(line => {
            const date = dayjs(line["Date"]);
            return month === date.get("month");
        });
    }

    sumValues(csvResults: NatwestStatementCsv[]): number {
        console.log("csvResults:", csvResults);
        const res = csvResults.reduce((acc, curr) => {
            return acc + curr["Value"];
        }, 0);

        return res;
    }
}
