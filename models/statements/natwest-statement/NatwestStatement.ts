import dayjs from "dayjs";
import { NatwestStatementCsv } from "./types/NatwestStatementType";
import { AbstractStatement } from "../AbstractStatement";
import { NatwestStatementCsvKeys } from "./enum/NatwestHeaderKeys.enum";

export class NatwestStatement extends AbstractStatement<NatwestStatementCsv> {
    private readonly _formattedCsvData: NatwestStatementCsv[];
    constructor(csvData: Record<PropertyKey, string>[]) {
        super();
        console.log("csvData:", csvData);
        const validCsvType = this.checkCsvMatchesGivenType(csvData);
        if (!validCsvType)
            throw new Error(
                "Invalid Csv Type, CSV headers do not match chosen Statement type."
            );
        this._formattedCsvData = csvData as unknown as NatwestStatementCsv[];
    }

    checkCsvMatchesGivenType(csvData: Record<PropertyKey, string>[]): boolean {
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
    getShoppingResults(): NatwestStatementCsv[] {
        const targetShops = [
            "tesco stores",
            "morrisons",
            "asda",
            "sainsbury's",
        ];
        return this._formattedCsvData.filter(line =>
            targetShops.some(shop => {
                line["Description"].toLowerCase().includes(shop);
            })
        );
    }

    getTargetMonthResults(month: number): NatwestStatementCsv[] {
        return this._formattedCsvData.filter(line => {
            const date = dayjs(line["Date"]);
            return month === date.get("month");
        });
    }

    sumValues(csvResults: NatwestStatementCsv[]): number {
        return csvResults.reduce((acc, curr) => {
            return acc + Number(curr["Value"]);
        }, 0);
    }
}
