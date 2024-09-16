"use client";

import { CsvParser } from "@/models/CsvParser";
import { Statements } from "@/models/statements/enum/Statements.enum";
import { StatementFactory } from "@/models/statements/StatementFactory";
import { ChangeEvent, useState } from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Button } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import FileUploadIcon from "@mui/icons-material/FileUpload";

export default function Home() {
    const [file, setFile] = useState<File>();
    const [csvData, setCsvData] = useState<Record<PropertyKey, string>[]>([]);
    const [statementValue, setStatementValue] = useState<number>();
    const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());

    const handleFileChange = async (
        event: ChangeEvent<HTMLInputElement>
    ): Promise<void> => {
        const file = event.target.files?.[0];
        console.log(file);
        if (file) {
            setFile(file);
            await handleFile(file);
        }
    };

    const handleFile = async (file: File) => {
        const reader = new FileReader();
        console.time("parse");
        reader.onload = async event => {
            const csvContent = event.target?.result as string;
            const parser = new CsvParser();
            const parsedCsv = await parser.parseCsvContent(csvContent);
            setCsvData(parsedCsv);
        };

        reader.readAsText(file);
        console.timeEnd("parse");
    };

    const handleDateChange = (newDate: Dayjs | null) => {
        if (newDate !== null) {
            setSelectedDate(newDate);
        }
    };

    const handleClick = async () => {
        console.time("result");
        const result = await StatementFactory.getShoppingResults(
            csvData,
            Statements.NATWEST,
            selectedDate?.month()
        );
        console.timeEnd("result");
        setStatementValue(result);
    };

    return (
        <main className="flex flex-col items-center justify-center w-full h-screen">
            <div className="flex flex-col items-center justify-center w-full p-10">
                <h1 className="text-center text text-3xl	">
                    Bank Statement Parser
                </h1>
                <section
                    onDragOver={event => event.preventDefault()}
                    className="flex flex-col items-center justify-center h-72 w-full rounded-3xl border-purple-100 border-dashed border-2 md:max-w-lg"
                >
                    <FileUploadIcon />
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
                    {file ? (
                        <div>
                            {file.name} <button>X</button>
                        </div>
                    ) : (
                        <div>no file selected</div>
                    )}
                </section>
                <div className="flex flex-col mt-4 gap-3">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            defaultValue={dayjs()}
                            label={"Month and Year "}
                            views={["month", "year"]}
                            onChange={handleDateChange}
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    "& fieldset": {
                                        borderColor: "white",
                                    },
                                    "&:hover fieldset": {
                                        borderColor: "blue",
                                    },
                                    "&.Mui-focused fieldset": {
                                        borderColor: "white",
                                    },
                                },
                                "& .MuiInputLabel-root": {
                                    color: "white",
                                },
                                "& .MuiInputLabel-root.Mui-focused": {
                                    color: "white",
                                },
                                "& .MuiInputBase-input": {
                                    color: "white",
                                },
                                "& .MuiSvgIcon-root": {
                                    color: "white",
                                },
                            }}
                        />
                    </LocalizationProvider>
                    <Button
                        sx={{
                            backgroundColor: !file ? "grey" : "lilac",
                            color: !file ? "white" : "black",
                            "&:hover": {
                                backgroundColor: !file ? "grey" : "white",
                            },
                            "&.Mui-disabled": {
                                backgroundColor: "grey",
                                color: "white",
                            },
                        }}
                        variant="contained"
                        onClick={handleClick}
                        disabled={!file}
                    >
                        check monthly spend
                    </Button>
                </div>
                <h3>Total spent: £{statementValue?.toFixed(2)}</h3>
            </div>
        </main>
    );
}
