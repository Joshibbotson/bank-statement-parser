"use client";

import { CsvParser } from "@/models/CsvParser";
import { Statements } from "@/models/statements/enum/Statements.enum";
import { StatementFactory } from "@/models/statements/StatementFactory";
import { ChangeEvent, useState } from "react";

export default function Home() {
    const [csvData, setCsvData] = useState<Record<PropertyKey, string>[]>([]);
    const [statementValue, setStatementValue] = useState<number>();

    const handleFileChange = async (
        event: ChangeEvent<HTMLInputElement>
    ): Promise<void> => {
        const file = event.target.files?.[0];
        console.log(file);
        if (file) {
            await handleFile(file);
        }
    };

    const handleFile = async (file: File) => {
        const reader = new FileReader();
        reader.onload = async event => {
            const csvContent = event.target?.result as string;
            const parser = new CsvParser();
            const parsedCsv = await parser.parseCsvContent(csvContent);
            setCsvData(parsedCsv);
        };
        reader.readAsText(file);
    };

    const handleClick = async () => {
        const result = await StatementFactory.getShoppingResults(
            csvData,
            Statements.NATWEST,
            8
        );
        setStatementValue(result);
    };

    return (
        <main className="flex flex-col items-center justify-center w-full h-screen">
            <div>
                <h1>Bank Statement Parser</h1>
                <section
                    onDragOver={event => event.preventDefault()}
                    className="flex flex-col items-center justify-center  h-72 w-72 rounded-3xl border-purple-100 border-dashed border-2"
                >
                    <h1> Drag & drop CSV here</h1>
                    <span>
                        or{" "}
                        <label
                            className="text-purple-200 cursor-pointer  hover:underline "
                            htmlFor="browse"
                        >
                            browse file
                        </label>{" "}
                        from device
                        <input
                            id="browse"
                            type="file"
                            hidden
                            accept=".csv"
                            onChange={handleFileChange}
                        />
                    </span>
                </section>
                <button onClick={handleClick}>check monthly spend</button>
                <h3>Total spent: £{statementValue?.toFixed(2)}</h3>
            </div>
        </main>
    );
}
