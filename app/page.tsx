"use client";

import { Statements } from "@/models/statements/enum/Statements.enum";
import { StatementFactory } from "@/models/statements/StatementFactory";
import { useState } from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Button } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import Nav from "@/components/Nav";
import TotalSpentCard from "@/components/TotalSpentCard";
import StatementType from "@/components/StatementType";

import FileUpload from "@/components/FileUpload";
import { Tag, Tags } from "@/components/tags/Tags";
import { defaultTags } from "@/components/tags/defaultTags";

export default function Home() {
    const [csvData, setCsvData] = useState<Record<PropertyKey, string>[]>([]);
    const [statementValue, setStatementValue] = useState<number>();
    const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
    const [tags, setTags] = useState<Tag[]>(defaultTags);

    const [selectedStatement, setSelectedStatement] = useState<Statements>(
        Statements.NATWEST
    );

    const handleTagsUpdate = (updatedTags: Tag[]) => {
        setTags(updatedTags);
    };

    const handleStatementUpdate = (updatedStatement: Statements) => {
        setSelectedStatement(updatedStatement);
    };
    const handleCsvDataUpdate = (
        updatedCsvData: Record<PropertyKey, string>[]
    ) => {
        setCsvData(updatedCsvData);
    };

    const handleDateChange = (newDate: Dayjs | null) => {
        if (newDate !== null) {
            setSelectedDate(newDate);
        }
    };

    const handleClick = async () => {
        const result = await StatementFactory.getShoppingResults(
            csvData,
            selectedStatement,
            selectedDate,
            tags.length ? tags.map(tag => tag.description) : undefined
        );

        setStatementValue(result);
    };

    return (
        <>
            <Nav />
            <main className="flex flex-col  justify-center w-full h-full">
                <div className="flex flex-col items-center justify-center w-full p-10">
                    <FileUpload onCsvDataChange={handleCsvDataUpdate} />
                    <div className="flex flex-col md:flex-row mt-4 gap-3">
                        <div className="flex flex-col gap-3">
                            <StatementType
                                onStatementChange={handleStatementUpdate}
                            />
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
                            <Tags onTagsChange={handleTagsUpdate} />
                        </div>
                        <div className="flex flex-col gap-6">
                            <TotalSpentCard
                                selectedDate={selectedDate}
                                statementValue={statementValue}
                            />
                            <Button
                                sx={{
                                    backgroundColor: !csvData
                                        ? "grey"
                                        : "lilac",
                                    color: !csvData ? "white" : "black",
                                    "&:hover": {
                                        backgroundColor: !csvData
                                            ? "grey"
                                            : "white",
                                    },
                                    "&.Mui-disabled": {
                                        backgroundColor: "grey",
                                        color: "white",
                                    },
                                }}
                                variant="contained"
                                onClick={handleClick}
                                disabled={!csvData.length}
                            >
                                check monthly spend
                            </Button>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
